import { X, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} from "../services/favoritesApi";
import type { RootState } from "../store/store";
import { setFavoriteItems, toggleFavorites } from "../store/favoriteSlice";
import { MailingSection } from "./HomePage/MailingSection";
import { PLACEHOLDER_IMAGE_URL } from "../api/api";
import { addToCart } from "../store/cartSlice";
import type { FavoriteItemDTO } from "../types/favorite";
import { showNotify } from "../utils/showNotify";

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );
  const items = useSelector((state: RootState) => state.favorites.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [toggleServerFavorites] = useToggleFavoriteMutation();

  const {
    data: serverItems,
    isLoading,
    isFetching,
  } = useGetFavoritesQuery(undefined, {
    skip: !accessToken,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (serverItems && accessToken) {
      dispatch(setFavoriteItems(serverItems));
    }
  }, [serverItems, accessToken, dispatch]);

  const handleRemove = (item: FavoriteItemDTO) => {
    dispatch(toggleFavorites(item));
    showNotify.warn(`"${item.product.name}" видалено з обраного`);
    if (accessToken) {
      toggleServerFavorites({ productId: item.product.id });
    }
  };

  const handleMoveToCart = (item: FavoriteItemDTO) => {
    const { product } = item;
    const isSale =
      product.isOnSale && product.discountPrice && product.discountPrice > 0;
    const finalPrice = isSale
      ? (product.discountPrice as number)
      : product.price;

    const existingInCart = cartItems.find((c) => c.productId === product.id);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;
    const stockLimit = Number(product.stockQuantity);

    if (stockLimit <= 0) {
      showNotify.error(`На жаль, "${product.name}" закінчився`);
      return;
    }

    if (currentQtyInCart + 1 > stockLimit) {
      if (currentQtyInCart > 0) {
        showNotify.error(
          `Досягнуто ліміт залишку на складі (${stockLimit} шт.). У кошику вже є ${currentQtyInCart} шт.`,
        );
      } else {
        showNotify.error(`Доступно лише ${stockLimit} шт.`);
      }
      return;
    }

    dispatch(
      addToCart({
        productId: product.id,
        productName: product.name,
        productImage: product.image || PLACEHOLDER_IMAGE_URL,
        price: finalPrice,
        quantity: 1,
        stockQuantity: stockLimit,
        isOnSale: product.isOnSale ?? false,
        discountPrice: product.discountPrice ?? null,
      }),
    );
    showNotify.success(`"${product.name}" додано до кошика`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-montserrat">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mb-4"></div>
        <p className="text-brand-primary font-medium">
          Завантаження вашого списку...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 font-montserrat flex flex-col items-center justify-center text-center">
        <div className="bg-gray-50 p-10 rounded-full mb-8">
          <Heart size={80} className="text-gray-200" strokeWidth={1} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Список порожній
        </h1>
        <p className="text-gray-500 mb-10 max-w-sm">
          Ваш список бажань чекає на перші товари. Додайте те, що вам
          сподобалось!
        </p>
        <Link
          to="/shop"
          className="flex items-center gap-2 px-10 py-2 bg-brand-primary text-white rounded-full font-medium shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
        >
          <ArrowLeft size={20} /> До магазину
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`max-w-7xl mx-auto px-4 py-10 md:py-16 font-montserrat min-h-screen transition-opacity duration-300 ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-10">
          Мій список бажань
        </h1>

        <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-100 text-gray-500 uppercase text-[11px] tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-semibold w-[35%]">Товар</th>
                  <th className="px-6 py-3 font-semibold w-[15%]">Ціна</th>
                  <th className="px-6 py-3 font-semibold text-center w-[15%]">
                    Наявність
                  </th>
                  <th className="px-6 py-4 w-[25%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => {
                  if (!item?.product) return null;
                  const isOutOfStock = Number(item.product.stockQuantity) <= 0;
                  const hasDiscount =
                    item.product.isOnSale &&
                    item.product.discountPrice &&
                    item.product.discountPrice < item.product.price;

                  return (
                    <tr
                      key={item.product.id}
                      className="group hover:bg-gray-50/30 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 shrink-0">
                            <img
                              src={item.product.image || PLACEHOLDER_IMAGE_URL}
                              className={`w-full h-full object-cover rounded-2xl border border-gray-100 ${isOutOfStock ? "grayscale opacity-50" : ""}`}
                              alt={item.product.name}
                            />
                          </div>
                          <span
                            className={`font-semibold ${isOutOfStock ? "text-gray-400" : "text-gray-900"}`}
                          >
                            {item.product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-manrope">
                        <div className="flex flex-col">
                          {hasDiscount && !isOutOfStock ? (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                ₴ {item.product.price.toFixed(2)}
                              </span>
                              <span className="text-xl font-bold text-red-500">
                                ₴ {item.product.discountPrice?.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span
                              className={`text-xl font-semibold ${isOutOfStock ? "text-gray-400" : "text-gray-900"}`}
                            >
                              ₴ {item.product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                            isOutOfStock
                              ? "bg-red-50 text-red-500 border-red-100"
                              : "bg-green-50 text-green-600 border-green-100"
                          }`}
                        >
                          {isOutOfStock ? "Відсутній" : "В наявності"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-5">
                          <button
                            onClick={() =>
                              !isOutOfStock && handleMoveToCart(item)
                            }
                            disabled={isOutOfStock}
                            className={`flex items-center gap-2 px-8 py-2 rounded-full text-sm font-medium transition-all ${
                              isOutOfStock
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-brand-primary text-white hover:bg-brand-dark shadow-md shadow-brand-primary/10 active:scale-95"
                            }`}
                          >
                            {isOutOfStock ? "Недоступно" : "Купити"}
                          </button>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Видалити з обраного"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((item) => {
            if (!item?.product) return null;
            const isOutOfStock = Number(item.product.stockQuantity) <= 0;
            const hasDiscount =
              item.product.isOnSale &&
              item.product.discountPrice &&
              item.product.discountPrice < item.product.price;

            return (
              <div
                key={item.product.id}
                className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm relative flex flex-col gap-4"
              >
                <button
                  onClick={() => handleRemove(item)}
                  className="absolute top-4 right-4 p-2 text-gray-300 bg-gray-50 rounded-full"
                >
                  <X size={18} />
                </button>

                <div className="flex gap-4">
                  <img
                    src={item.product.image || PLACEHOLDER_IMAGE_URL}
                    className={`w-24 h-24 object-cover rounded-[20px] border border-gray-50 ${isOutOfStock ? "grayscale opacity-50" : ""}`}
                    alt={item.product.name}
                  />
                  <div className="flex flex-col justify-center pr-6">
                    <h3
                      className={`font-semibold text-sm mb-1 ${isOutOfStock ? "text-gray-400" : "text-gray-900"}`}
                    >
                      {item.product.name}
                    </h3>
                    <div className="font-manrope">
                      {hasDiscount && !isOutOfStock ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 line-through">
                            ₴ {item.product.price.toFixed(2)}
                          </span>
                          <span className="text-lg font-bold text-red-500">
                            ₴ {item.product.discountPrice?.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`text-lg font-bold ${isOutOfStock ? "text-gray-400" : "text-gray-900"}`}
                        >
                          ₴ {item.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-2">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest ${
                      isOutOfStock
                        ? "bg-red-50 text-red-500 border-red-100"
                        : "bg-green-50 text-green-600 border-green-100"
                    }`}
                  >
                    {isOutOfStock ? "Немає" : "В наявності"}
                  </span>
                  <button
                    onClick={() => !isOutOfStock && handleMoveToCart(item)}
                    disabled={isOutOfStock}
                    className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                      isOutOfStock
                        ? "bg-gray-100 text-gray-400"
                        : "bg-brand-primary text-white active:scale-95"
                    }`}
                  >
                    {isOutOfStock ? "Недоступно" : "У кошик"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MailingSection />
    </div>
  );
};
