import { Table } from "antd";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { OrderRecord } from "../../types/order";

export const ProfileHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const sortLabels: Record<string, string> = {
    newest: "Спочатку нові",
    oldest: "Спочатку старі",
    expensive: "Найдорожчі",
  };

  const dataSource: OrderRecord[] = [
    {
      key: "1",
      id: "#738",
      date: "2020-09-08",
      total: 135,
      items: 5,
      status: "Обробка",
    },
    {
      key: "2",
      id: "#703",
      date: "2020-05-24",
      total: 25,
      items: 1,
      status: "В дорозі",
    },
    {
      key: "3",
      id: "#130",
      date: "2020-10-22",
      total: 250,
      items: 4,
      status: "Завершено",
    },
    {
      key: "4",
      id: "#561",
      date: "2020-02-01",
      total: 35,
      items: 1,
      status: "Завершено",
    },
    {
      key: "5",
      id: "#440",
      date: "2020-01-15",
      total: 120,
      items: 2,
      status: "Скасовано",
    },
  ];

  const filteredData = dataSource
    .filter((item) => {
      if (activeFilter === "active")
        return item.status === "Обробка" || item.status === "В дорозі";
      if (activeFilter === "completed") return item.status === "Завершено";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "expensive") return b.total - a.total;
      return 0;
    });

  const columns = [
    {
      title: "ID Замовлення",
      dataIndex: "id",
      key: "id",
      className: "text-sm font-semibold text-gray-900",
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString("uk-UA"),
      className: "text-sm text-gray-500",
    },
    {
      title: "Сума",
      key: "total",
      render: (_: OrderRecord, record: OrderRecord) => (
        <span className="font-semibold text-gray-900">
          ₴{record.total} ({record.items})
        </span>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const styles: Record<string, string> = {
          Обробка: "bg-blue-50 text-blue-600",
          "В дорозі": "bg-amber-50 text-amber-600",
          Завершено: "bg-green-50 text-green-600",
          Скасовано: "bg-red-50 text-red-600",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              styles[status] || "bg-gray-50 text-gray-500"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "",
      key: "action",
      align: "right" as const,
      render: () => (
        <button className="text-brand-primary text-sm font-semibold hover:underline">
          Детальніше
        </button>
      ),
    },
  ];

  return (
    <div className="font-montserrat animate-in fade-in duration-500">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight">
        Історія замовлень
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: `Всі (${dataSource.length})` },
            { id: "active", label: "Активні" },
            { id: "completed", label: "Завершені" },
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
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[13px] font-semibold ${
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

      <div className="bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm shadow-gray-100">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{
            pageSize: 5,
            position: ["bottomCenter"],
          }}
          rowClassName="group hover:bg-gray-50/50 transition-colors cursor-pointer"
        />
      </div>

      <style>{`
        /* Основний шрифт для всієї таблиці та її елементів */
        .ant-table, 
        .ant-table-container, 
        .ant-table-thead > tr > th, 
        .ant-table-tbody > tr > td,
        .ant-pagination {
          font-family: 'Montserrat', sans-serif !important;
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
        }

        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #F9FAFB !important;
          padding: 18px 24px !important;
        }

        .ant-table-tbody > tr:hover > td {
          background: rgba(0,0,0,0.02) !important;
        }

        .ant-table-pagination.ant-pagination {
          margin: 0 !important;
          border-top: 1px solid #F9FAFB;
          padding: 20px 0;
        }

        /* Стилізація кнопок пагінації, якщо потрібно */
        .ant-pagination-item a, .ant-pagination-item-ellipsis {
          font-family: 'Montserrat', sans-serif !important;
        }
      `}</style>
    </div>
  );
};
