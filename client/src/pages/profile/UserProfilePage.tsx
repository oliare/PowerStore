import { useRef, useState } from "react";
import { Table, Input } from "antd";
import { User, Mail, Calendar, Phone, SquarePen } from "lucide-react";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from "../../services/userApi";
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE_URL } from "../../api/api";
import { showNotify } from "../../utils/showNotify";
import { ImageCropperModal } from "../../common/ImageCropperModal";
import type { UserProfile } from "../../types/user";
import { useGetMyOrdersQuery } from "../../services/orderApi";
import { orderHistoryColumns } from "../../utils/orderHistoryColumns";

export const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState<Partial<UserProfile> | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const { data: user, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const { data: orders } = useGetMyOrdersQuery();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleEditStart = () => {
    setLocalData({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!localData) return;

    const { firstName, lastName, phoneNumber } = localData;

    if (!firstName?.trim()) {
      showNotify.warn("Ім'я не може бути порожнім");
      return;
    }

    if (!lastName?.trim()) {
      showNotify.warn("Прізвище не може бути порожнім");
      return;
    }

    if (firstName.trim().length < 2) {
      showNotify.error("Ім'я занадто коротке (мінімум 2 символи)");
      return;
    }

    if (lastName.trim().length < 2) {
      showNotify.error("Прізвище занадто коротке (мінімум 2 символи)");
      return;
    }

    const phoneRegex = /^\+?[0-9]{10,14}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      showNotify.error("Будь ласка, введіть коректний номер телефону");
      return;
    }

    const formData = new FormData();
    formData.append("FirstName", localData.firstName ?? "");
    formData.append("LastName", localData.lastName ?? "");
    formData.append("PhoneNumber", localData.phoneNumber ?? "");

    if (pendingImageFile) {
      formData.append("ImageFile", pendingImageFile);
    }

    try {
      await updateProfile(formData).unwrap();
      showNotify.success("Профіль успішно оновлено!");
      setIsEditing(false);
      setPreviewImage(null);
      setPendingImageFile(null);
      setLocalData(null);
    } catch {
      showNotify.error("Хм... Сталася помилка при збереженні профілю");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalData(null);
    setPreviewImage(null);
    setPendingImageFile(null);
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    } else {
      showNotify.info("Спочатку натисніть 'Редагувати', щоб змінити фото");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotify.error("Будь ласка, виберіть зображення");
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      showNotify.error("Файл занадто великий. Максимальний розмір — 5 МБ");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const onCropConfirm = (file: File, preview: string) => {
    setPendingImageFile(file);
    setPreviewImage(preview);
    setIsCropModalOpen(false);
  };

  const avatarSrc =
    previewImage ??
    (user?.image
      ? `${IMAGE_BASE_URL}/avatars/${user.image}`
      : PLACEHOLDER_IMAGE_URL);

  return (
    <>
      <ImageCropperModal
        image={imageToCrop}
        open={isCropModalOpen}
        onCancel={() => setIsCropModalOpen(false)}
        onConfirm={onCropConfirm}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-500 font-montserrat">Завантаження...</span>
        </div>
      ) : (
        <div>
          <div className="grid md:grid-cols-[1fr_2fr] gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center h-full justify-center">
              <div className="relative w-36 h-36 mb-4">
                <div
                  className={`relative w-full h-full rounded-full overflow-hidden border-2 transition-all ${
                    isEditing
                      ? "border-brand-primary cursor-pointer"
                      : "border-brand-primary/20"
                  }`}
                  onClick={handleImageClick}
                >
                  <img
                    src={avatarSrc || PLACEHOLDER_IMAGE_URL}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />

                  {isEditing && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] flex items-center justify-center transition-opacity">
                      <div className="font-montserrat">
                        <SquarePen className="text-white w-7 h-7" />
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 font-montserrat">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500 mb-5 font-montserrat text-sm">
                Клієнт
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold font-montserrat">
                  Особисті дані
                </p>
                <div className="flex items-center gap-4">
                  {isEditing && (
                    <button
                      onClick={handleCancel}
                      className="text-gray-400 font-semibold hover:text-gray-600 transition-all text-sm font-montserrat"
                    >
                      Скасувати
                    </button>
                  )}
                  <button
                    onClick={isEditing ? handleSave : handleEditStart}
                    disabled={isSaving}
                    className="text-brand-primary font-semibold hover:text-brand-dark transition-all text-sm disabled:opacity-50 font-montserrat"
                  >
                    {isSaving
                      ? "Збереження..."
                      : isEditing
                        ? "Зберегти зміни"
                        : "Редагувати"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                <div className="space-y-1">
                  <label className="text-gray-400 text-xs font-montserrat">
                    Ім'я
                  </label>
                  {isEditing ? (
                    <Input
                      value={localData?.firstName}
                      onChange={(e) =>
                        setLocalData((prev) =>
                          prev ? { ...prev, firstName: e.target.value } : null,
                        )
                      }
                      className="rounded-lg font-montserrat"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 flex items-center gap-2 font-montserrat">
                      <User size={14} className="text-gray-500" />{" "}
                      {user?.firstName}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 text-xs font-montserrat">
                    Прізвище
                  </label>
                  {isEditing ? (
                    <Input
                      value={localData?.lastName}
                      onChange={(e) =>
                        setLocalData((prev) =>
                          prev ? { ...prev, lastName: e.target.value } : null,
                        )
                      }
                      className="rounded-lg font-montserrat"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 flex items-center gap-2 font-montserrat">
                      <User size={14} className="text-gray-500" />{" "}
                      {user?.lastName}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 text-xs font-montserrat">
                    Телефон
                  </label>
                  {isEditing ? (
                    <Input
                      value={localData?.phoneNumber}
                      onChange={(e) =>
                        setLocalData((prev) =>
                          prev
                            ? { ...prev, phoneNumber: e.target.value }
                            : null,
                        )
                      }
                      className="rounded-lg font-montserrat"
                    />
                  ) : (
                    <div className="font-medium text-gray-900 flex items-center gap-2 font-montserrat">
                      <Phone size={14} className="text-gray-500" />{" "}
                      {user?.phoneNumber || "Не вказано"}
                    </div>
                  )}
                </div>

                <div className="space-y-1 opacity-70">
                  <label className="text-gray-500 text-xs font-montserrat">
                    Електронна пошта
                  </label>
                  <div className="font-medium text-gray-600 flex items-center gap-2 font-montserrat">
                    <Mail size={14} /> {user?.email}
                  </div>
                </div>

                <div className="space-y-1 opacity-70">
                  <label className="text-gray-400 text-xs font-montserrat">
                    Дата реєстрації
                  </label>
                  <div className="font-medium text-gray-600 flex items-center gap-2 font-montserrat">
                    <Calendar size={14} /> {formatDate(user?.createdAt)}
                  </div>
                </div>

                <div className="space-y-1 opacity-70">
                  <label className="text-gray-400 text-xs font-montserrat">
                    Дата оновлення
                  </label>
                  <div className="font-medium text-gray-600 flex items-center gap-2 font-montserrat">
                    <Calendar size={14} /> {formatDate(user?.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl mt-10 shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                Останні замовлення
              </h2>
              <a
                href="/profile/history"
                className="text-brand-primary font-semibold hover:text-brand-dark transition-all text-sm flex items-center gap-2 font-montserrat"
              >
                Дивитися всі замовлення
              </a>
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-2xl border border-gray-50 overflow-hidden">
                <Table
                  dataSource={orders?.slice(0, 2)}
                  columns={orderHistoryColumns}
                  pagination={false}
                  rowKey="id"
                  loading={isLoading}
                  locale={{ emptyText: "У вас поки немає замовлень" }}
                  rowClassName="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          <style>{`
            .ant-table { font-family: 'Montserrat', sans-serif !important; }
            .ant-table-thead > tr > th {
              background: #F9FAFB !important;
              color: #9CA3AF !important;
              font-size: 11px !important;
              text-transform: uppercase !important;
              letter-spacing: 0.1em !important;
              font-weight: 700 !important;
              border-bottom: 1px solid #F3F4F6 !important;
              padding: 16px 24px !important;
            }
            .ant-table-tbody > tr > td {
              border-bottom: 1px solid #F9FAFB !important;
              padding: 20px 24px !important;
            }
          `}</style>
        </div>
      )}
    </>
  );
};
