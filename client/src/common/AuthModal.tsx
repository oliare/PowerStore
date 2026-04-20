import { Modal } from "antd";
import { LogIn, UserPlus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const AuthModal = ({
  isOpen,
  onClose,
  title = "Потрібна авторизація",
}: AuthModalProps) => {
  const navigate = useNavigate();

  const handleAction = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      className="font-manrope"
      width={400}
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="text-brand-primary" size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          {title}
        </h2>
        <p className="text-gray-500 mb-8 px-4">
          Увійдіть у свій аккаунт, щоб зберігати товари, переглядати історію
          замовлень та отримувати персональні знижки.
        </p>

        <div className="space-y-3 px-4">
          <button
            onClick={() => handleAction("/login")}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
          >
            <LogIn size={20} /> УВІЙТИ
          </button>
          <button
            onClick={() => handleAction("/register")}
            className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all"
          >
            <UserPlus size={20} /> ЗАРЕЄСТРУВАТИСЯ
          </button>
        </div>
      </div>
    </Modal>
  );
};
