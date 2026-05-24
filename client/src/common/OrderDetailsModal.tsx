import { Modal } from "antd";
import {
  Calendar,
  CreditCard,
  Package,
  Minus,
  ShoppingBag,
} from "lucide-react";
import type { OrderDto, OrderItemDto } from "../types/order";

interface OrderDetailsModalProps {
  order: OrderDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) => {
  if (!order) return null;

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className="order-details-modal"
    >
      <div className="font-montserrat p-2">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
              Деталі замовлення
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mt-2">
              <Minus
                size={24}
                className="inline-block rotate-90 text-brand-primary -mr-1 -ml-3 mb-1"
              />
              {order.id.slice(-8).toUpperCase()}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">
                Дата
              </p>
              <p className="text-sm font-bold font-manrope">
                {new Date(order.createdAt).toLocaleDateString("uk-UA")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CreditCard size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">
                Сума до сплати
              </p>
              <p className="text-sm font-bold text-brand-dark font-manrope">
                {order.totalPrice} ₴
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <p className="text-[11px] text-gray-400 font-bold uppercase mb-4 flex items-center gap-2">
            <Package size={14} /> Склад замовлення
          </p>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {order.items?.map((item: OrderItemDto, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <ShoppingBag className="text-gray-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-manrope">
                      {item.quantity} шт. × {item.price} ₴
                    </p>
                  </div>
                </div>
                <p className="text-xs font-bold font-manrope">
                  {item.price * item.quantity} ₴
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-brand-primary text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Закрити
        </button>
      </div>
    </Modal>
  );
};
