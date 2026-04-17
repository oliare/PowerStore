import { useState } from "react";
import { Table, Input } from "antd";
import { User, Mail, Calendar, Phone, SquarePen } from "lucide-react";
import { ProfileSidebar } from "../common/ProfileSidebar";
import { MailingSection } from "./HomePage/mailingSection";

export const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "Dianne",
    lastName: "Russell",
    email: "dainne.ressell@gmail.com",
    phone: "(671) 555-0110",
    registrationDate: "12.02.2021",
    birthDate: "5 Apr, 1990",
    updatedAt: "13 May, 2021",
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved:", userData);
  };

  const dataSource = [
    {
      key: "1",
      id: "#738",
      date: "8 Sep, 2020",
      total: "$135.00",
      status: "Processing",
    },
    {
      key: "2",
      id: "#703",
      date: "24 May, 2020",
      total: "$25.00",
      status: "Completed",
    },
  ];

  const columns = [
    { title: "№ Замовлення", dataIndex: "id", key: "id" },
    { title: "Дата", dataIndex: "date", key: "date" },
    { title: "Загалом", dataIndex: "total", key: "total" },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`capitalize ${status == "Completed" ? "text-gray-400" : "text-brand-dark"}`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <a className="text-brand-primary font-medium hover:underline cursor-pointer">
          Детальніше
        </a>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat">
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar activeKey="dashboard" />

          <div className="w-full lg:w-3/4 space-y-6">
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-full justify-center">
                <div className="relative w-35 h-35 mb-4">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-brand-primary/20">
                    <img
                      src="https://i.pravatar.cc/150?u=dianne"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-1 right-3 cursor-pointer">
                    <SquarePen className="w-6 h-6 bg-white cursor-pointer rounded shadow-md hover:bg-slate-50 transition-all text-gray-500" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 font-montserrat">
                  {userData.firstName} {userData.lastName}
                </h3>
                <p className="text-gray-500 mb-5 font-montserrat text-sm">
                  Користувач
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    Інформація про користувача
                  </p>
                  <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className="text-brand-primary font-semibold hover:text-brand-dark transition-all text-sm"
                  >
                    {isEditing ? "Зберегти зміни" : "Редагувати"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                  <div className="space-y-1">
                    <label className="text-gray-400 text-xs">Ім'я</label>
                    {isEditing ? (
                      <Input
                        value={userData.firstName}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            firstName: e.target.value,
                          })
                        }
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <User size={14} /> {userData.firstName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 text-xs">Прізвище</label>
                    {isEditing ? (
                      <Input
                        value={userData.lastName}
                        onChange={(e) =>
                          setUserData({ ...userData, lastName: e.target.value })
                        }
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <User size={14} /> {userData.lastName}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 opacity-70">
                    <label className="text-gray-400 text-xs">Email</label>
                    <div className="font-medium text-gray-600 flex items-center gap-2">
                      <Mail size={14} /> {userData.email}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 text-xs">Телефон</label>
                    <div className="font-medium text-gray-500/80 flex items-center gap-2">
                      <Phone size={14} /> {userData.phone}
                    </div>
                  </div>

                  <div className="space-y-1 opacity-70">
                    <label className="text-gray-400 text-xs">
                      Дата народження
                    </label>
                    <div className="font-medium text-gray-600 flex items-center gap-2">
                      <Calendar size={14} /> {userData.birthDate}
                    </div>
                  </div>
                  <div className="space-y-1 opacity-70">
                    <label className="text-gray-400 text-xs">
                      Дата реєстрації (оновлено {userData.updatedAt})
                    </label>
                    <div className="font-medium text-gray-600 flex items-center gap-2">
                      <Calendar size={14} /> {userData.registrationDate} 
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 flex justify-between items-center border-b border-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Історія замовлень
                </h2>
                <a
                  href="#"
                  className="text-brand-primary font-semibold hover:underline text-sm"
                >
                  Переглянути всі
                </a>
              </div>
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                className="custom-table"
              />
            </div>
          </div>
        </div>
      </main>
      <MailingSection />
    </div>
  );
};
