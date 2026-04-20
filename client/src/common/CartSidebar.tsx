import { Drawer } from "antd";
import { X, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart } from "../store/cartSlice";
import { closeCartSidebar } from "../store/uiSlice";
import type { RootState } from "../store/store";

export const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isCartSidebarOpen } = useSelector((state: RootState) => state.ui);

  const totalPrice = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0,
  );

  const getPlural = (
    number: number,
    one: string,
    two: string,
    five: string,
  ) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
  };

  const handleCheckout = () => {
    dispatch(closeCartSidebar());
    navigate("/checkout");
  };

  const handleGoToCart = () => {
    dispatch(closeCartSidebar());
    navigate("/cart");
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center py-2 font-manrope">
          <span className="text-xl font-bold text-gray-900">
            Кошик ({items.length})
          </span>
        </div>
      }
      placement="right"
      onClose={() => dispatch(closeCartSidebar())}
      open={isCartSidebarOpen}
      width={400}
      closeIcon={<X size={24} className="text-gray-900" />}
    >
      <div className="flex flex-col h-full font-manrope">
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 items-center group">
              <div className="w-20 h-20 bg-brand-primary/5 rounded-xl border border-gray-200 flex-shrink-0 p-2">
                <img
                  src={
                    item.productImage
                      ? item.productImage
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsrGS4gCi1t_OKtlUFXwoXq0Z1yJBkNagHOsgoPa1N-A&s"
                  }
                  alt={item.productName}
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-all"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {item.productName}
                </h4>
                <p className="text-gray-500 text-xs mt-1">
                  {item.quantity}x
                  <span className="font-bold text-gray-900 pl-2">
                    ₴{item.price}
                  </span>
                </p>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.productId))}
                className="p-1.5 rounded-full border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400">Ваш кошик порожній</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-4 text-[14px]">
          <div className="flex justify-between items-center text-gray-900">
            <span className="font-semibold text-[15px]">
              {items.length}{" "}
              {getPlural(items.length, "товар", "товари", "товарів")}
            </span>
            <span className="font-bold text-xl text-brand-primary">
              ₴{totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-2.5 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 active:scale-[0.98]"
          >
            Оформити замовлення
          </button>
          <button
            onClick={handleGoToCart}
            className="w-full py-2.5 bg-brand-primary/10 text-brand-primary rounded-full font-semibold hover:bg-brand-primary/10 transition-all"
          >
            Перейти до кошика
          </button>
        </div>
      </div>
    </Drawer>
  );
};
