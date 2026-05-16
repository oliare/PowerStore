import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import toast from "react-hot-toast";
import type { ToastifyProps } from "../types/common";

export const Toastify = ({ t, message, type }: ToastifyProps) => {
  const configs = {
    success: {
      bg: "bg-white",
      border: "border-emerald-500",
      icon: <CheckCircle className="text-emerald-500" size={20} />,
      title: "Успішно",
    },
    error: {
      bg: "bg-white",
      border: "border-rose-500",
      icon: <AlertCircle className="text-rose-400" size={20} />,
      title: "Помилка",
    },
    info: {
      bg: "bg-white",
      border: "border-blue-500",
      icon: <Info className="text-brand-primary" size={20} />,
      title: "Інформація",
    },
    warn: {
      bg: "bg-white",
      border: "border-amber-500",
      icon: <AlertCircle className="text-amber-400" size={20} />,
      title: "Увага",
    },
  };

  const config = configs[type] || configs.info;

  return (
    <div
      className={`${
        t.visible
          ? "animate-in fade-in slide-in-from-right-5"
          : "animate-out fade-out slide-out-to-right-5"
      } max-w-md w-full ${config.bg} shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${config.border} transition-all duration-300`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">{config.icon}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-bold text-gray-900 font-montserrat">
              {config.title}
            </p>
            <p className="mt-1 text-sm text-gray-500 font-montserrat leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-100">
        <button
          onClick={() => toast.remove(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          aria-label="Закрити"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
