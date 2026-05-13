import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorites } from "../store/favoriteSlice";
import { useToggleFavoriteMutation } from "../services/favoritesApi";
import type { RootState } from "../store/store";
import type { ProductDto } from "../types/product";
import type { FavoriteItemDTO } from "../types/favorite";
import { showNotify } from "../utils/showNotify";

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

  const isFavorite = localItems.some(
    (item) => item?.product?.id === product?.id,
  );

  const [toggleServerFavorites] = useToggleFavoriteMutation();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      showNotify.warn(`"${product.name}" видалено з обраного`);
    } else {
      showNotify.success(`"${product.name}" додано до обраного`);
    }

    dispatch(
      toggleFavorites({
        id: product.id,
        productId: product.id,
        addedAt: new Date().toISOString(),
        product: product,
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
      className={`p-2.5 rounded-full border border-gray-200 transition-all ${
        isFavorite
          ? "bg-brand-primary text-white "
          : "bg-white text-gray-800 hover:bg-brand-primary hover:text-white"
      } ${className}`}
    >
      <Heart
        size={22}
        fill={isFavorite ? "currentColor" : "none"}
        className="transition-colors"
      />
    </button>
  );
};
