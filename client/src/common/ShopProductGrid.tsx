import { PackageCheck, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import {
  type ProductDto,
  getActualPrice,
  hasActiveDiscount,
} from "../types/product";
import type { CartItemDto } from "../types/cart";
import type { RootState } from "../store/store";
import { FavoriteButton } from "./FavoriteButton";
import { SkeletonCard } from "./SkeletonCard";
import { showNotify } from "../utils/showNotify";
import { StockStatus } from "../common/StockStatus";

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
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (product: ProductDto, selectedQuantity: number) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.id,
    );
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalPotentialQty = currentQtyInCart + selectedQuantity;

    if (product.stockQuantity <= 0) {
      showNotify.error(`На жаль, "${product.name}" уже закінчився`);
      return;
    }

    if (totalPotentialQty > product.stockQuantity) {
      showNotify.error(
        currentQtyInCart > 0
          ? `У кошику вже ${currentQtyInCart} шт. Досягнуто ліміт залишку (${product.stockQuantity} шт.)`
          : `Доступно лише ${product.stockQuantity} шт.`,
      );
      return;
    }

    const finalImage =
      product.image || product.images?.[0]?.image || PLACEHOLDER_IMAGE_URL;

    const item: CartItemDto = {
      productId: product.id,
      productName: product.name,
      productImage: finalImage,
      price: getActualPrice(product),
      quantity: selectedQuantity,
      stockQuantity: product.stockQuantity,
      isOnSale: product.isOnSale,
      discountPrice: product.discountPrice,
      discountPercentage: product.discountPercentage,
    };

    dispatch(addToCart(item));
    showNotify.success(`"${product.name}" додано до кошика`);
  };

  const handleCartClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: ProductDto,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stockQuantity <= 0) {
      showNotify.error("Товару немає в наявності");
      return;
    }

    handleAddToCart(product, 1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : products.map((product) => {
            const isOutOfStock = product.stockQuantity <= 0;
            const hasDiscount = hasActiveDiscount(product);
            console.log(
              "Rendering product:",
              product.discountPercentage,
              product.discountPrice,
              product.discountPrice,
              product.price,
            );

            return (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group"
              >
                <div
                  className={`h-full bg-white p-4 border border-gray-100 rounded-xl shadow-sm transition-all relative 
                  ${
                    isOutOfStock
                      ? "opacity-60 grayscale-[0.5]"
                      : "hover:shadow-xl hover:border-brand-primary/40"
                  }`}
                >
                  <div className="relative h-44 rounded-lg overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-2">
                    <img
                      src={product.images?.[0]?.image || PLACEHOLDER_IMAGE_URL}
                      alt={product.name}
                      className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 
                        ${!isOutOfStock && "group-hover:scale-110"}`}
                    />

                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-10">
                        <span className="bg-white/90 text-gray-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">
                          Немає
                        </span>
                      </div>
                    )}

                    <div
                      className="absolute top-0 right-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FavoriteButton product={product} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3
                      className={`text-sm font-medium line-clamp-2 min-h-[40px] font-montserrat transition-colors
                      ${isOutOfStock ? "text-gray-500" : "text-gray-800 group-hover:text-brand-primary"}`}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        {hasDiscount ? (
                          <div className="flex flex-col">
                            <span className="text-[13px] text-gray-400 line-through font-manrope leading-none">
                              ₴ {Number(product.price).toFixed(2)}
                            </span>
                            <span className="text-lg font-bold font-manrope text-red-500">
                              ₴ {Number(product.discountPrice).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`text-lg font-bold font-manrope ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}
                          >
                            ₴ {Number(product.price).toFixed(2)}
                          </span>
                        )}

                        <div className="flex items-center gap-0.5 pb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={
                                i < Math.round(product.rate || 0)
                                  ? "fill-[#fbd53c] text-[#fbd53c]"
                                  : "text-gray-200 fill-gray-200"
                              }
                            />
                          ))}
                          <span className="text-[10px] text-gray-400 font-manrope ml-0.5">
                            {(product.rate || 0).toFixed(1)}
                          </span>
                        </div>

                        {!isOutOfStock ? (
                          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit mt-1">
                            <PackageCheck size={12} />
                            <span className="text-[10px] font-medium">
                              В наявності
                            </span>
                          </div>
                        ) : (
                          <StockStatus
                            className="mt-1"
                            quantity={product.stockQuantity}
                          />
                        )}
                      </div>

                      <button
                        disabled={isOutOfStock}
                        className={`p-3 rounded-full transition-colors flex-shrink-0 
                          ${
                            isOutOfStock
                              ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                              : "bg-gray-100 hover:text-white hover:bg-brand-primary"
                          }`}
                        onClick={(e) => handleCartClick(e, product)}
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
    </div>
  );
};
