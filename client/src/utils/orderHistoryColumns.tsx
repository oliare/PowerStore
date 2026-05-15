import { OrderStatus } from "../enums/enum";
import type { OrderDto } from "../types/order";

export const getOrderHistoryColumns = (
  onDetailsClick: (order: OrderDto) => void,
) => [
  {
    title: "ID Замовлення",
    dataIndex: "trackingNumber",
    key: "trackingNumber",
    className: "text-sm font-semibold text-brand-primary",
  },
  {
    title: "Дата",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      <span className="text-sm text-gray-500 font-manrope">
        {new Date(date).toLocaleDateString("uk-UA")}
      </span>
    ),
  },
  {
    title: "Сума",
    key: "total",
    render: (_: number, record: OrderDto) => (
      <span className="font-semibold text-gray-900 font-manrope">
        ₴{record.totalPrice.toFixed(2)} (
        {record.items.reduce((acc, item) => acc + item.quantity, 0)})
      </span>
    ),
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (status: OrderStatus) => {
      const statusLabels: Record<OrderStatus, string> = {
        [OrderStatus.Pending]: "Обробка",
        [OrderStatus.Shipped]: "В дорозі",
        [OrderStatus.Completed]: "Завершено",
        [OrderStatus.Cancelled]: "Скасовано",
        [OrderStatus.Paid]: "Оплачено",
      };

      const styles: Record<OrderStatus, string> = {
        [OrderStatus.Pending]: "bg-blue-50 text-blue-600",
        [OrderStatus.Shipped]: "bg-amber-50 text-amber-600",
        [OrderStatus.Completed]: "bg-green-50 text-green-600",
        [OrderStatus.Cancelled]: "bg-red-50 text-red-600",
        [OrderStatus.Paid]: "bg-purple-50 text-purple-600",
      };

      return (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
            styles[status] || "bg-gray-50 text-gray-500"
          }`}
        >
          {statusLabels[status] || status}
        </span>
      );
    },
  },
  {
    title: "",
    key: "action",
    align: "right" as const,
    render: (record: OrderDto) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDetailsClick(record);
        }}
        className="text-brand-primary text-sm font-semibold hover:underline bg-transparent border-none cursor-pointer"
      >
        Детальніше
      </button>
    ),
  },
];
