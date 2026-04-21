import { ArrowRight, Eye, ShoppingCart, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProductDto } from "../../types/user/product";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { SerializedError } from "@reduxjs/toolkit/react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import type { CartItemDto } from "../../types/user/cart";
import { FavoriteButton } from "../../common/FavoriteButton";
import { PLACEHOLDER_IMAGE_URL } from "../../api/api";

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
  const SkeletonCard = () => (
    <div className="bg-white p-4 border border-gray-100 rounded-lg animate-pulse">
      <div className="h-48 bg-gray-200 rounded-xl mb-10"></div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );

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
              to="/products"
              className="flex items-center gap-2 text-brand-primary font-semibold hover:underline group"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : products.map((product) => (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="group"
                  >
                    <div className="h-full bg-white p-4 border z-10 border-gray-100 rounded-lg shadow-sm transition-all hover:shadow-[0_0_20px_0_rgba(76,175,80,0.3)] hover:shadow-brand-dark/20 hover:border-brand-primary/70">
                      <div className="relative h-48 rounded-xl overflow-hidden mb-10 bg-gray-50">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0].image
                              : PLACEHOLDER_IMAGE_URL
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <FavoriteButton product={product} />
                          <button className="bg-white shadow-lg p-2.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-700 font-medium transition-colors duration-300 group-hover:text-blue-800/85 line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-[18px] font-semibold font-manrope text-black">
                            ₴ {product.price}
                          </p>
                          <p className="text-xs text-brand-accent font-medium">
                            В наявності
                          </p>
                        </div>
                        <button
                          className="p-3 rounded-full bg-gray-100 hover:text-white hover:bg-brand-primary transition-colors flex-shrink-0"
                          onClick={(e) => handleCartClick(e, product)}
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </div>
    </section>
  );
};
