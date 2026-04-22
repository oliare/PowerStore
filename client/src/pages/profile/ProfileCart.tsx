import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../../store/cartSlice";
import { Minus, Plus, Trash2, ShoppingBasket, ArrowLeft } from "lucide-react";
import type { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGE_URL } from "../../api/api";

export const ProfileCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  if (cartItems.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] w-full text-center font-montserrat bg-white rounded-[28px] border border-gray-100 border-dashed p-10 animate-in fade-in duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-primary/10 blur-[50px] rounded-full" />
          <div className="relative bg-white p-8 rounded-full shadow-sm border border-gray-50 flex items-center justify-center">
            <ShoppingBasket
              size={56}
              className="text-brand-primary/20"
              strokeWidth={1}
            />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Ваш кошик порожній
        </h3>
        <p className="text-gray-400 mb-8 max-w-[300px] text-sm">
          Здається, ви ще нічого не додали. Час виправити це!
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-12 py-3 bg-brand-primary text-white rounded-full font-medium shadow-lg hover:bg-brand-dark transition-all"
        >
          <ArrowLeft size={20} /> <span>До покупок</span>
        </Link>
      </div>
    );

  return (
    <div className="font-montserrat animate-in fade-in duration-500">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight">
        Кошик ({cartItems.length})
      </h1>

      <div className="grid grid-cols-1 gap-3 mb-10 overflow-x-auto h-[300px]">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-[24px] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-all duration-300"
          >
            <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-2xl bg-gray-50 border border-gray-50">
              <img
                src={item.productImage || PLACEHOLDER_IMAGE_URL}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={item.productName}
              />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0 flex flex-col gap-1">
              <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                {item.productName}
              </h3>
              <p className="text-md font-semibold text-brand-primary font-manrope">
                ₴{item.price.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-full border border-gray-100  font-manrope">
              <button
                onClick={() =>
                  handleUpdateQuantity(item.productId, item.quantity - 1)
                }
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-brand-primary transition-all active:scale-90"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-6 text-center font-bold text-base text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.productId, item.quantity + 1)
                }
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-brand-primary transition-all active:scale-90"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>

            <button
              onClick={() => dispatch(removeFromCart(item.productId))}
              className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center sm:text-left">
            <p className="text-gray-400 text-sm font-medium mb-1">
              Загальна сума до сплати
            </p>
            <p className="text-2xl font-bold text-gray-900 font-manrope">
              ₴{totalPrice.toLocaleString()}
            </p>
          </div>
          <button className="w-full sm:w-auto px-12 py-2 bg-brand-primary text-white rounded-full font-semibold shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-[0.98]">
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  );
};
