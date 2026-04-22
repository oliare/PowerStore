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
import type { FavoriteItemDTO } from "../types/user/favorite";

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );
  const items = useSelector((state: RootState) => state.favorites.items);

  const [toggleServerFavorites] = useToggleFavoriteMutation();
  const { data: serverItems, isLoading } = useGetFavoritesQuery(undefined, {
    skip: !accessToken,
  });

  if (serverItems && accessToken && items.length !== serverItems.length) {
    dispatch(setFavoriteItems(serverItems));
  }

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
    handleRemove(item);
  };

  const handleRemove = (item: FavoriteItemDTO) => {
    dispatch(toggleFavorites(item));

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
          to="/"
          className="flex items-center gap-2 px-10 py-2 bg-brand-primary text-white rounded-full font-medium shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
        >
          <ArrowLeft size={20} /> До каталогу
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 font-montserrat min-h-screen">
        <h1 className="text-3xl font-semibold text-center mb-10 font-montserrat">
          Мій список бажань
        </h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-[400px] overflow-y-auto">
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
                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold">
                        <div className="flex items-center gap-5">
                          <img
                            src={item.productImage || PLACEHOLDER_IMAGE_URL}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                            alt={item.productName}
                          />
                          <span className="text-gray-900">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-semibold text-gray-900 font-manrope">
                        ₴{Number(item.productPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                          В наявності
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="bg-brand-primary hover:bg-brand-dark text-white px-8 py-2 rounded-full text-sm font-medium transition-colors"
                          >
                            В кошик
                          </button>
                          <button
                            onClick={() =>
                              accessToken
                                ? toggleServerFavorites({
                                    productId: item.productId,
                                  })
                                : dispatch(toggleFavorites(item))
                            }
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
