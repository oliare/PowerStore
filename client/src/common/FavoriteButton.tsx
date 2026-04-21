import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorites } from "../store/favoriteSlice";
import {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} from "../services/favoritesApi";
import type { RootState } from "../store/store";
import type { ProductDto } from "../types/user/product";
import { PLACEHOLDER_IMAGE_URL } from "../api/api";
import type { FavoriteItemDTO } from "../types/user/favorite";

export const FavoriteButton = ({
  product,
  className = "",
}: {
  product: ProductDto;
  className?: string;
}) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );

  const localItems = useSelector((state: RootState) => state.favorites.items);
  const { data: serverItems = [] } = useGetFavoritesQuery(undefined, {
    skip: !accessToken,
  });
  const [toggleServerFavorites] = useToggleFavoriteMutation();

  const isFavorite = accessToken
    ? serverItems.some((item) => item.productId === product.id)
    : localItems.some((item) => item.productId === product.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (accessToken) {
      await toggleServerFavorites({ productId: product.id }).unwrap();
    } else {
      dispatch(
        toggleFavorites({
          productId: product.id,
          productName: product.name,
          productImage: product.image || PLACEHOLDER_IMAGE_URL,
          productPrice: product.price,
        } as FavoriteItemDTO),
      );
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2.5 rounded-full shadow-lg transition-all border border-transparent ${
        isFavorite
          ? "bg-brand-primary text-white border-brand-primary"
          : "bg-white text-gray-900 hover:bg-brand-primary hover:text-white"
      } ${className}`}
    >
      <Heart
        size={18}
        fill={isFavorite ? "currentColor" : "none"}
        className="transition-colors"
      />
    </button>
  );
};
