import { Table } from "antd";
import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { OrderStatus } from "../../enums/enum";
import { useGetMyOrdersQuery } from "../../services/orderApi";
import { Pagination } from "../../common/Pagination";
import type { OrderDto } from "../../types/order";
import { OrderDetailsModal } from "../../common/OrderDetailsModal";
import { getOrderHistoryColumns } from "../../utils/orderHistoryColumns";

const orderHistoryColumns = getOrderHistoryColumns(() => {});

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
          locale={{
            emptyText: (
              <div className="py-20 text-center text-gray-400">
                Замовлень не знайдено
              </div>
            ),
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName="group hover:bg-gray-50/50 transition-colors cursor-pointer"
        />
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

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
