import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorites } from "../store/favoriteSlice";
import { useToggleFavoriteMutation } from "../services/favoritesApi";
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

  const isFavorite = localItems.some((item) => item.productId === product.id);

  const [toggleServerFavorites] = useToggleFavoriteMutation();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleFavorites({
        productId: product.id,
        productName: product.name,
        productImage: product.image || PLACEHOLDER_IMAGE_URL,
        productPrice: product.price,
      } as FavoriteItemDTO),
    );

    if (accessToken) {
      try {
        await toggleServerFavorites({ productId: product.id }).unwrap();
      } catch (error) {
        console.error("Failed to sync favorite:", error);
      }
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
