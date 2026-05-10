import { Table, Modal } from "antd";
import { useState, useMemo } from "react";
import {
  ChevronDown,
  Package,
  Calendar,
  CreditCard,
  Minus,
} from "lucide-react";
import { OrderStatus } from "../../enums/enum";
import { useGetMyOrdersQuery } from "../../services/orderApi";
import { orderHistoryColumns } from "../../utils/orderHistoryColumns";
import { Pagination } from "../../common/Pagination";
import type { OrderDto, OrderItemDto } from "../../types/order";
import { PLACEHOLDER_IMAGE_URL } from "../../api/api";

export const ProfileHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: orders, isLoading } = useGetMyOrdersQuery();
  const ordersPerPage = 5;

  const sortLabels: Record<string, string> = {
    newest: "Спочатку нові",
    oldest: "Спочатку старі",
    expensive: "Найдорожчі",
  };

  const processedOrders = useMemo(() => {
    if (!orders) return [];
    const result = orders.filter((item) => {
      if (activeFilter === "active") return item.status === OrderStatus.Pending;
      if (activeFilter === "completed")
        return item.status === OrderStatus.Completed;
      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "expensive") return b.totalPrice - a.totalPrice;
      return 0;
    });
  }, [orders, activeFilter, sortBy]);

  const totalPages = Math.ceil(processedOrders.length / ordersPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;

  const currentOrders = useMemo(() => {
    const lastIndex = activePage * ordersPerPage;
    const firstIndex = lastIndex - ordersPerPage;
    return processedOrders.slice(firstIndex, lastIndex);
  }, [processedOrders, activePage]);

  const handleRowClick = (order: OrderDto) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="font-montserrat animate-in fade-in duration-500">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight">
        Історія замовлень
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `Всі (${orders?.length || 0})` },
            { id: "active", label: "Активні" },
            { id: "completed", label: "Завершені" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setCurrentPage(1);
              }}
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
              className={`transition-transform ${isSortOpen ? "rotate-180" : ""}`}
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
                      setCurrentPage(1);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[13px] font-semibold ${sortBy === key ? "bg-brand-dark text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm shadow-gray-100 mb-8">
        <Table
          rowKey="id"
          dataSource={currentOrders}
          columns={orderHistoryColumns}
          pagination={false}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName="group hover:bg-gray-50/50 transition-colors cursor-pointer"
        />

        {processedOrders.length === 0 && !isLoading && (
          <div className="py-20 text-center text-gray-400">
            Замовлень не знайдено
          </div>
        )}
      </div>

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={600}
        className="order-details-modal"
      >
        {selectedOrder && (
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
                  {selectedOrder.id.slice(-8).toUpperCase()}
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
                    {new Date(selectedOrder?.createdAt).toLocaleDateString()}
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
                    {selectedOrder.totalPrice} ₴
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <p className="text-[11px] text-gray-400 font-bold uppercase mb-4 flex items-center gap-2">
                <Package size={14} /> Склад замовлення
              </p>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {selectedOrder.items?.map((item: OrderItemDto, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-400 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image || PLACEHOLDER_IMAGE_URL}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package size={16} />
                        )}
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
              onClick={() => setIsModalOpen(false)}
              className="w-full py-4 bg-brand-primary text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Закрити
            </button>
          </div>
        )}
      </Modal>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <style>{`
        .order-details-modal .ant-modal-content {
          border-radius: 24px;
          padding: 24px;
        }
        .ant-table-thead > tr > th {
          background: #F9FAFB !important;
          color: #9CA3AF !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.08em !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #F3F4F6 !important;
          padding: 14px 24px !important;
          font-family: 'Montserrat', sans-serif !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #F9FAFB !important;
          padding: 18px 24px !important;
          font-family: 'Montserrat', sans-serif !important;
        }
      `}</style>
    </div>
  );
};
