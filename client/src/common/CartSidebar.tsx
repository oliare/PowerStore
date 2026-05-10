import { Drawer } from "antd";
import { X, ShoppingBag, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart } from "../store/cartSlice";
import { closeCartSidebar } from "../store/uiSlice";
import type { RootState } from "../store/store";
import { PLACEHOLDER_IMAGE_URL } from "../api/api";
import { useCheckStockMutation } from "../services/productApi";
import { showNotify } from "../utils/showNotify";

export const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isCartSidebarOpen } = useSelector((state: RootState) => state.ui);

  const [checkStock, { isLoading: isChecking }] = useCheckStockMutation();

  const totalPrice = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      const ids = items.map((item) => item.productId);

      const stockInfo = await checkStock(ids).unwrap();

      const unavailableItems = stockInfo.filter((s) => s.stockQuantity <= 0);

      if (unavailableItems.length > 0) {
        showNotify.error(
          "На жаль, деякі товари вже закінчилися. Перевірте кошик.",
        );
        dispatch(closeCartSidebar());
        navigate("/cart");
      } else {
        dispatch(closeCartSidebar());
        navigate("/checkout");
      }
    } catch (error) {
      showNotify.error("Помилка при перевірці наявності товару.");
      console.error("Stock check failed:", error);
    }
  };

  const handleGoToCart = () => {
    dispatch(closeCartSidebar());
    navigate("/cart");
  };

  const getPlural = (
    number: number,
    one: string,
    two: string,
    five: string,
  ) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center py-2 font-montserrat">
          <span className="text-xl font-semibold text-gray-900">
            Кошик <span className="font-manrope">({items.length})</span>
          </span>
        </div>
      }
      placement="right"
      onClose={() => dispatch(closeCartSidebar())}
      open={isCartSidebarOpen}
      width={400}
      closeIcon={<X size={24} className="text-gray-900" />}
    >
      <div className="flex flex-col h-full font-montserrat">
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 items-center group">
              <div className="w-20 h-20 bg-brand-primary/5 rounded-xl border border-gray-200 flex-shrink-0 p-2">
                <img
                  src={item.productImage || PLACEHOLDER_IMAGE_URL}
                  alt={item.productName}
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-all"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                  {item.productName}
                </h4>
                <p className="text-gray-500 text-xs mt-1 font-manrope">
                  {item.quantity}x
                  <span className="text-base font-bold text-gray-900 pl-2">
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
            <span className="font-semibold text-xl text-brand-primary font-manrope">
              ₴{totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || isChecking}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary text-white rounded-full font-semibold 
              hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 
              active:scale-[0.98]
              disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isChecking ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Перевірка...
              </>
            ) : (
              "Оформити замовлення"
            )}
          </button>

          <button
            onClick={handleGoToCart}
            className="w-full py-2.5 bg-brand-primary/10 text-brand-primary rounded-full font-semibold hover:bg-brand-primary/20 transition-all"
          >
            Перейти до кошика
          </button>
        </div>
      </div>
    </Drawer>
  );
};
