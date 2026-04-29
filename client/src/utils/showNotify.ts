import toast from "react-hot-toast";

export const showNotify = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast(msg, { className: "info" }),
  warn: (msg: string) => toast(msg, { className: "warn" }),
};
