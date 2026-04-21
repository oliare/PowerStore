import { X, ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} from "../services/favoritesApi";
import type { RootState } from "../store/store";
import { toggleFavorites } from "../store/favoriteSlice";

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );
  const localItems = useSelector((state: RootState) => state.favorites.items);

  const { data: serverItems = [], isLoading } = useGetFavoritesQuery(
    undefined,
    {
      skip: !accessToken,
    },
  );
  const [toggleServerFavorites] = useToggleFavoriteMutation();

  const items = accessToken ? serverItems : localItems;

  if (isLoading)
    return (
      <div className="flex justify-center py-20 font-manrope text-brand-primary">
        Завантаження...
      </div>
    );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 font-manrope flex flex-col items-center justify-center text-center">
        <div className="bg-gray-50 p-8 rounded-full mb-6">
          <Heart size={80} className="text-gray-300" strokeWidth={1} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ваш список бажань порожній
        </h1>
        <p className="text-gray-500 mb-10 max-w-sm">
          Додайте товари, які вам сподобались, щоб не загубити їх пізніше.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-10 py-3 bg-brand-primary text-white rounded-full font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all"
        >
          <ArrowLeft size={20} /> До каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-manrope">
      <h1 className="text-3xl font-bold text-center mb-10">
        Мій список бажань
      </h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-xs tracking-widest">
              <tr>
                <th className="px-6 py-4 font-medium">Товар</th>
                <th className="px-6 py-4 font-medium">Ціна</th>
                <th className="px-6 py-4 font-medium text-center">Наявність</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                return (
                  <tr
                    key={item.productId}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-6 font-semibold">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || "placeholder.png"}
                          className="w-16 h-16 object-contain rounded-lg border border-gray-100"
                          alt={item.name}
                        />
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-gray-900">
                      ₴{Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                        В наявності
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-end gap-4">
                        <button className="bg-[#00B207] hover:bg-[#009906] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors">
                          Додати
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
  );
};
