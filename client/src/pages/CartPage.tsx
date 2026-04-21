import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { ArrowLeft, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { MailingSection } from "./HomePage/MailingSection";

export const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 font-montserrat flex flex-col items-center justify-center text-center">
        <div className="bg-gray-100/60 p-8 rounded-full mb-6">
          <ShoppingBag size={80} className="text-gray-300" strokeWidth={0.5} />
        </div>
        <h1 className="text-3xl font-medium text-gray-900 mb-4">
          Ваш кошик порожній
        </h1>
        <p className="text-gray-500 mb-10 max-w-xl">
          Схоже, ви ще нічого не додали до кошика. <br />
          Перегляньте наш каталог, щоб знайти найкращі пропозиції!
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-10 py-2 bg-brand-primary text-white rounded-full font-medium shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-[0.95]"
        >
          <ArrowLeft size={20} />
          Перейти до покупок
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 font-montserrat min-h-screen">
        <h1 className="text-3xl font-semibold text-center mb-10">Мій кошик</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className={`h-[300px] overflow-y-auto`}>
              <table className="w-full text-left flex-grow">
                <thead className="border-b border-gray-100 text-gray-400 uppercase text-[11px] tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-medium">Товар</th>
                    <th className="px-6 py-4 font-medium">Ціна</th>
                    <th className="px-6 py-4 font-medium">Кількість</th>
                    <th className="px-6 py-4 font-medium">Сума</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.productId} className="group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.productImage || "placeholder.png"}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                          <span className="font-semibold text-gray-900">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-gray-900 font-medium font-manrope">
                        ₴ {item.price}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3 border border-gray-200 rounded-full w-max px-3 py-1">
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity - 1,
                                }),
                              )
                            }
                            className="hover:text-brand-primary transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-semibold text-gray-900 font-manrope">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity + 1,
                                }),
                              )
                            }
                            className="hover:text-brand-primary transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-semibold text-gray-900 font-manrope">
                        ₴{(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-6">
                        <button
                          onClick={() =>
                            dispatch(removeFromCart(item.productId))
                          }
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50/50 flex justify-between items-center mt-auto">
              <Link
                to="/"
                className="flex items-center gap-2 px-8 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-all active:scale-[0.98]"
              >
                <ArrowLeft size={18} />
                Повернутися до магазину
              </Link>
              <div className="text-gray-400 text-sm italic">
                {items.length} тов. у кошику
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col h-full min-h-[380px]">
            <h2 className="text-xl font-semibold mb-6">Разом</h2>

            <div className="space-y-4 border-b border-gray-100 pb-6 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Сума:</span>
                <span className="font-semibold text-gray-900 font-manrope text-base">
                  ₴{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Доставка:</span>
                <span className="font-semibold text-brand-primary">
                  Безкоштовно
                </span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold mb-8">
              <span>Всього:</span>
              <span className="font-manrope">₴{subtotal.toFixed(2)}</span>
            </div>

            <button className="mt-auto w-full py-2 bg-brand-primary text-white rounded-full font-medium shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-[0.98]">
              Оформити замовлення
            </button>
          </div>
        </div>
      </div>
      <MailingSection />
    </>
  );
};
