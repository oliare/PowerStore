import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setFavoriteItems, toggleFavorites } from "../../store/favoriteSlice";
import { addToCart } from "../../store/cartSlice";
import {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
} from "../../services/favoritesApi";
import type { RootState } from "../../store/store";
import { Heart, Trash2, ArrowLeft, ChevronDown } from "lucide-react";
import type { FavoriteItemDTO } from "../../types/favorite";
import { PLACEHOLDER_IMAGE_URL } from "../../api/api";
import { useEffect, useState, useMemo } from "react";
import { showNotify } from "../../utils/showNotify";
import type { CartItemDto } from "../../types/cart";

export const ProfileWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.favorites.items);
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );
  const [toggleServerFavorite] = useToggleFavoriteMutation();

  const { data: serverItems } = useGetFavoritesQuery(undefined, {
    skip: !accessToken,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (serverItems && accessToken) {
      dispatch(setFavoriteItems(serverItems));
    }
  }, [serverItems, accessToken, dispatch]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortLabels: Record<string, string> = {
    default: "Без сортування",
    "price-asc": "Дешевші спочатку",
    "price-desc": "Дорожчі спочатку",
    name: "Назва A-Z",
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (activeFilter === "cheap") return item.productPrice < 1000;
        if (activeFilter === "expensive") return item.productPrice >= 1000;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.productPrice - b.productPrice;
        if (sortBy === "price-desc") return b.productPrice - a.productPrice;
        if (sortBy === "name")
          return a.productName.localeCompare(b.productName);
        return 0;
      });
  }, [items, activeFilter, sortBy]);

  const handleRemove = (item: FavoriteItemDTO) => {
    dispatch(toggleFavorites(item));
    if (accessToken) toggleServerFavorite({ productId: item.productId });
  };

  const handleAddToCartLogic = (item: FavoriteItemDTO) => {
    if (item.stockQuantity <= 0) {
      showNotify.error(`На жаль, "${item.productName}" уже закінчився`);
      return;
    }

    const cartItem: CartItemDto = {
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage || PLACEHOLDER_IMAGE_URL,
      price: item.productPrice,
      quantity: 1,
      stockQuantity: item.stockQuantity,
    };

    dispatch(addToCart(cartItem));
    showNotify.success(`"${item.productName}" додано до кошика`);
  };

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] w-full text-center font-montserrat px-4 animate-in fade-in duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-primary/10 blur-[50px] rounded-full" />
          <div className="relative bg-white p-8 rounded-full shadow-sm border border-gray-50">
            <Heart
              size={56}
              className="text-brand-primary/20"
              strokeWidth={1}
            />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Ваш список бажань порожній
        </h3>
        <Link
          to="/"
          className="flex items-center gap-2 px-12 py-2 mt-6 bg-brand-primary text-white rounded-full font-medium shadow-lg hover:bg-brand-dark transition-all"
        >
          <ArrowLeft size={20} /> <span>До каталогу</span>
        </Link>
      </div>
    );

  return (
    <div className="font-montserrat animate-in fade-in duration-500">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight">
        Список бажань
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `Всі (${items.length})` },
            { id: "cheap", label: "До 1000₴" },
            { id: "expensive", label: "Від 1000₴" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-brand-dark text-white shadow-lg shadow-gray-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-between px-5 py-2.5 bg-gray-100 rounded-full text-[13px] font-semibold text-gray-700 hover:bg-gray-200 transition-all border border-transparent focus:border-gray-300"
          >
            <span>{sortLabels[sortBy]}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isSortOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsSortOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {Object.entries(sortLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[13px] font-semibold transition-colors ${
                      sortBy === key
                        ? "bg-brand-dark text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => {
          console.log(`${item.productName}: ${item.stockQuantity}`);
          const isOutOfStock = item.stockQuantity === 0;

          return (
            <div
              key={item.productId}
              className={`group relative bg-white border border-gray-100 rounded-[28px] overflow-hidden transition-all duration-500 ${
                isOutOfStock
                  ? "grayscale opacity-70 shadow-none"
                  : "hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={item.productImage || PLACEHOLDER_IMAGE_URL}
                  alt={item.productName}
                  className={`w-full h-full object-cover transition-transform duration-[1s] ${
                    !isOutOfStock && "group-hover:scale-110"
                  }`}
                />

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="bg-gray-700/70 text-white px-4 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest shadow-xl">
                      Товар закінчився
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={() => handleRemove(item)}
                  className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0 z-20"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col justify-between items-start mb-5">
                  <div className="flex-1 max-w-40">
                    <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                      {item.productName}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    {!isOutOfStock && (
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-green-50 text-green-600">
                        В наявності
                      </span>
                    )}
                    <span
                      className={`text-lg font-semibold ${
                        isOutOfStock ? "text-gray-400" : "text-brand-primary"
                      }`}
                    >
                      ₴{item.productPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => !isOutOfStock && handleAddToCartLogic(item)}
                  disabled={isOutOfStock}
                  className={`w-full py-2 rounded-full text-sm font-semibold transition-all shadow-lg ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-brand-primary text-white hover:bg-brand-primary-dark shadow-gray-200 active:scale-[0.97]"
                  }`}
                >
                  {isOutOfStock ? "Недоступно" : "Купити"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
