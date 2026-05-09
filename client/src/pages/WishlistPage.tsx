import { X, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { useEffect } from "react";

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );
  const items = useSelector((state: RootState) => state.favorites.items);

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

  const handleMoveToCart = (item: FavoriteItemDTO) => {
    dispatch(
      addToCart({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: item.productPrice,
        quantity: 1,
      }),
    );
    showNotify.success(`"${item.productName}" перенесено в кошик`);
    handleRemove(item, false);
  };

  const handleRemove = (item: FavoriteItemDTO, showToast = true) => {
    dispatch(toggleFavorites(item));

    if (showToast) {
      showNotify.warn(`"${item.productName}" видалено з обраного`);
    }

    if (accessToken) {
      toggleServerFavorites({ productId: item.productId });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20 font-montserrat text-brand-primary">
        Завантаження...
      </div>
    );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 font-montserrat flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100/60 p-8 rounded-full mb-6">
          <Heart size={80} className="text-gray-300" strokeWidth={0.5} />
        </div>
        <h1 className="text-3xl font-medium text-gray-900 mb-4">
          Ваш список бажань порожній
        </h1>
        <p className="text-gray-500 mb-10 max-w-sm">
          Додайте товари, які вам сподобались, щоб не загубити їх пізніше.
        </p>
        <Link
          to="/shop"
          className="flex items-center gap-2 px-10 py-2 bg-brand-primary text-white rounded-full font-medium shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
        >
          <ArrowLeft size={20} /> До каталогу
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        className={`max-w-7xl mx-auto px-4 py-12 font-montserrat min-h-screen transition-opacity duration-300 ${isFetching ? "opacity-60" : "opacity-100"}`}
      >
        <h1 className="text-3xl font-semibold text-center mb-10">
          Мій список бажань
        </h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 text-gray-400 uppercase text-[11px] tracking-widest">
                <tr>
                  <th className="px-6 py-3 font-semibold w-[35%]">Товар</th>
                  <th className="px-6 py-3 font-semibold w-[15%]">Ціна</th>
                  <th className="px-6 py-3 font-semibold text-center w-[15%]">
                    Наявність
                  </th>
                  <th className="px-6 py-4 w-[25%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => {
                  const isOutOfStock = Number(item.stockQuantity) <= 0;

                  return (
                    <tr
                      key={item.productId}
                      className={`group transition-colors ${
                        isOutOfStock ? "bg-gray-50/50" : "hover:bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <img
                              src={item.productImage || PLACEHOLDER_IMAGE_URL}
                              className={`w-16 h-16 object-cover rounded-lg border border-gray-100 transition-all ${
                                isOutOfStock
                                  ? "grayscale contrast-75 opacity-60"
                                  : ""
                              }`}
                              alt={item.productName}
                            />
                            {isOutOfStock && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full rotate-45 absolute" />
                              </div>
                            )}
                          </div>
                          <span
                            className={`font-semibold ${isOutOfStock ? "text-gray-400 decoration-gray-300" : "text-gray-900"}`}
                          >
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-6 font-semibold font-manrope ${isOutOfStock ? "text-gray-400" : "text-gray-900"}`}
                      >
                        ₴{Number(item.productPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-6 text-center">
                        {isOutOfStock ? (
                          <span className="px-3 py-1 rounded-md text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                            Немає
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            В наявності
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() =>
                              !isOutOfStock && handleMoveToCart(item)
                            }
                            disabled={isOutOfStock}
                            className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${
                              isOutOfStock
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-brand-primary hover:bg-brand-dark text-white shadow-md shadow-brand-primary/10 active:scale-95"
                            }`}
                          >
                            {isOutOfStock ? "Недоступно" : "В кошик"}
                          </button>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Видалити"
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
      </div>
      <MailingSection />
    </>
  );
};
