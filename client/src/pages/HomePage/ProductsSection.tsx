import {
  ArrowRight,
  ShoppingCart,
  AlertCircle,
  PackageCheck,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  type ProductDto,
  getActualPrice,
  hasActiveDiscount,
} from "../../types/product";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { SerializedError } from "@reduxjs/toolkit/react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import type { CartItemDto } from "../../types/cart";
import type { RootState } from "../../store/store";
import { FavoriteButton } from "../../common/FavoriteButton";
import { PLACEHOLDER_IMAGE_URL } from "../../api/api";
import { SkeletonCard } from "../../common/SkeletonCard";
import { showNotify } from "../../utils/showNotify";
import { StockStatus } from "../../common/StockStatus";

interface ProductsSectionProps {
  products: ProductDto[];
  isLoading?: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
}

export const ProductsSection = ({
  products,
  isLoading,
  error,
}: ProductsSectionProps) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (product: ProductDto, selectedQuantity: number) => {
    if (product.stockQuantity <= 0) {
      showNotify.error(`На жаль, "${product.name}" уже закінчився`);
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.productId === product.id,
    );
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalPotentialQty = currentQtyInCart + selectedQuantity;

    if (totalPotentialQty > product.stockQuantity) {
      if (currentQtyInCart > 0) {
        showNotify.error(
          `У кошику вже ${currentQtyInCart} шт. Досягнуто ліміт залишку на складі (${product.stockQuantity} шт.)`,
        );
      } else {
        showNotify.error(`Доступно лише ${product.stockQuantity} шт.`);
      }
      return;
    }

    const image =
      product.images && product.images.length > 0
        ? product.images[0].image
        : "";
    const finalImage = product.image || image;

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
    handleAddToCart(product, 1);
  };

  return (
    <section className="relative font-montserrat">
      <div className="absolute top-0 -right-0">
        <img
          src="horizontal.svg"
          alt="icon"
          className="w-52 opacity-10 brightness-[0.5] pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 mb-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold z-10">Рекомендовані товари</h2>
          {!isLoading && !error && (
            <Link
              to="/shop"
              className="flex items-center gap-2 text-brand-primary font-semibold hover:underline group cursor-pointer z-10"
            >
              Переглянути всі
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          )}
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-2xl border border-red-100">
            <AlertCircle className="text-red-500 mb-2" size={40} />
            <p className="text-red-800 font-medium">
              Не вдалося завантажити товари
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-red-600 underline hover:text-red-800"
            >
              Спробувати ще раз
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : products.map((product) => {
                  const isOutOfStock = product.stockQuantity <= 0;
                  const hasDiscount = hasActiveDiscount(product);

                  return (
                    <Link
                      to={`/product/${product.id}`}
                      key={product.id}
                      className="group"
                    >
                      <div
                        className={`h-full bg-white p-4 border border-gray-100 rounded-2xl shadow-sm transition-all relative flex flex-col ${
                          isOutOfStock
                            ? "opacity-70 grayscale-[0.4]"
                            : "hover:shadow-xl hover:border-brand-primary/40"
                        }`}
                      >
                        <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-gray-50 flex items-center justify-center p-2 flex-shrink-0">
                          <img
                            src={
                              product.images?.[0]?.image ||
                              PLACEHOLDER_IMAGE_URL
                            }
                            alt={product.name}
                            className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ${
                              !isOutOfStock && "group-hover:scale-110"
                            }`}
                          />

                          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <FavoriteButton product={product} />
                          </div>

                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-10">
                              <span className="bg-white/90 text-gray-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">
                                Немає
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex-1 mb-3">
                            <h3
                              className={`text-sm font-medium line-clamp-2 min-h-[40px] transition-colors ${
                                isOutOfStock
                                  ? "text-gray-500"
                                  : "text-gray-800 group-hover:text-brand-primary"
                              }`}
                            >
                              {product.name}
                            </h3>
                          </div>

                          <div className="flex items-end justify-between pt-1 w-full">
                            <div className="flex flex-col gap-1">
                              {hasDiscount ? (
                                <div className="flex flex-col leading-tight">
                                  <span className="text-[13px] text-gray-400 line-through font-manrope">
                                    ₴ {product.price}
                                  </span>
                                  <span className="text-xl font-bold font-manrope text-red-500">
                                    ₴ {product.discountPrice}
                                  </span>
                                </div>
                              ) : (
                                <div className="leading-tight">
                                  <span
                                    className={`text-xl font-bold font-manrope ${
                                      isOutOfStock
                                        ? "text-gray-500"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    ₴ {product.price}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-center gap-0.5">
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
                                <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-0.5 rounded-full w-fit mt-0.5">
                                  <PackageCheck size={12} />
                                  <span className="text-[10px] font-medium">
                                    В наявності
                                  </span>
                                </div>
                              ) : (
                                <StockStatus
                                  className="mt-0.5"
                                  quantity={product.stockQuantity}
                                />
                              )}
                            </div>

                            <button
                              type="button"
                              disabled={isOutOfStock}
                              className={`p-3 rounded-full transition-colors flex-shrink-0 self-end ${
                                isOutOfStock
                                  ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                  : "bg-gray-100 text-gray-700 hover:text-white hover:bg-brand-primary"
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
        )}
      </div>
    </section>
  );
};
