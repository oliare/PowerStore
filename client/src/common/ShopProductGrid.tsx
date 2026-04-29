import { Eye, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import type { ProductDto } from "../types/product";
import type { CartItemDto } from "../types/cart";
import { FavoriteButton } from "./FavoriteButton";
import { SkeletonCard } from "./SkeletonCard";

const PLACEHOLDER_IMAGE_URL = "/images/placeholder.png";

interface ShopProductGridProps {
  products: ProductDto[];
  isLoading?: boolean;
}

export const ShopProductGrid = ({
  products,
  isLoading,
}: ShopProductGridProps) => {
  const dispatch = useDispatch();
  const handleCartClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductDto,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(product, 1);
  };

  const handleAddToCart = (product: ProductDto, selectedQuantity: number) => {
    const image =
      product.images && product.images.length > 0
        ? product.images[0].image
        : "";

    const finalImage = product.image || image;

    const item: CartItemDto = {
      productId: product.id,
      productName: product.name,
      productImage: finalImage,
      price: product.price,
      quantity: selectedQuantity,
    };

    dispatch(addToCart(item));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group"
            >
              <div className="h-full bg-white p-4 border border-gray-100 rounded-xl shadow-sm transition-all hover:shadow-xl hover:border-brand-primary/40 relative">
                <div className="relative h-44 rounded-lg overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-2">
                  <img
                    src={product.images?.[0]?.image || PLACEHOLDER_IMAGE_URL}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <FavoriteButton product={product} />
                    <button className="bg-white shadow-lg p-2.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm text-gray-800 font-medium line-clamp-2 min-h-[40px] font-montserrat group-hover:text-brand-primary transition-colors">
                    {product.name.length > 30
                      ? product.name.slice(0, 20) + "..."
                      : product.name}
                  </h3>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900 font-manrope">
                        ₴ {product.price}
                      </span>
                      <span className="text-xs text-brand-accent font-medium">
                        В наявності
                      </span>
                    </div>

                    <button
                      className="p-3 rounded-full bg-gray-100 hover:text-white hover:bg-brand-primary transition-colors flex-shrink-0"
                      onClick={(e) => handleCartClick(e, product)}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};
