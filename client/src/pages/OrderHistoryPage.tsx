import { Table } from "antd";
import { ProfileSidebar } from "../common/ProfileSidebar";
import { MailingSection } from "./HomePage/MailingSection";

export const OrderHistoryPage = () => {
  const dataSource = [
    {
      key: "1",
      id: "#738",
      date: "8 Вер, 2020",
      total: "135.00$ (5 Товарів)",
      status: "Обробка",
    },
    {
      key: "2",
      id: "#703",
      date: "24 Трав, 2020",
      total: "25.00$ (1 Товар)",
      status: "В дорозі",
    },
    {
      key: "3",
      id: "#130",
      date: "22 Жовт, 2020",
      total: "250.00$ (4 Товари)",
      status: "Завершено",
    },
    {
      key: "4",
      id: "#561",
      date: "1 Лют, 2020",
      total: "35.00$ (1 Товар)",
      status: "Завершено",
    },
    {
      key: "5",
      id: "#440",
      date: "15 Січ, 2020",
      total: "120.00$ (2 Товари)",
      status: "Скасовано",
    },
  ];

  const columns = [
    {
      title: "ID Замовлення",
      dataIndex: "id",
      key: "id",
      className: "text-sm font-medium text-gray-900",
      onCell: () => ({ style: { padding: "18px 24px" } }),
      onHeaderCell: () => ({ style: { padding: "14px 24px" } }),
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      className: "text-sm text-gray-600",
      onCell: () => ({ style: { padding: "18px 24px" } }),
      onHeaderCell: () => ({ style: { padding: "14px 24px" } }),
    },
    {
      title: "Сума",
      dataIndex: "total",
      key: "total",
      className: "text-sm text-gray-600",
      onCell: () => ({ style: { padding: "18px 24px" } }),
      onHeaderCell: () => ({ style: { padding: "14px 24px" } }),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      onCell: () => ({ style: { padding: "18px 24px" } }),
      onHeaderCell: () => ({ style: { padding: "14px 24px" } }),
      render: (status: string) => {
        const statusStyles: Record<string, string> = {
          Обробка: "text-blue-500/70",
          "В дорозі": "text-amber-500/70",
          Завершено: "text-gray-400",
          Скасовано: "text-red-400/70",
        };
        return (
          <span
            className={`text-sm font-medium ${statusStyles[status] || "text-gray-500"}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "",
      key: "action",
      onCell: () => ({
        style: { padding: "18px 36px", textAlign: "right" as const },
      }),
      onHeaderCell: () => ({ style: { padding: "14px 24px" } }),
      render: () => (
        <button className="text-brand-primary text-sm font-semibold hover:underline transition-colors">
          Детальніше
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar activeKey="history" />

          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  Історія замовлень
                </h1>
                <div className="text-sm text-gray-500">
                  Показано{" "}
                  <span className="text-gray-900 font-medium">
                    {dataSource.length}
                  </span>{" "}
                  замовлень
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  className="ant-table-custom"
                  pagination={{
                    pageSize: 5,
                    position: ["bottomCenter"],
                    className: "px-6 p-3 border-t border-gray-50",
                  }}
                  rowClassName={() => "hover:bg-gray-50 transition-colors"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <MailingSection />
    </div>
  );
};
