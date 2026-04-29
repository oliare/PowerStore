import type { Toast } from "react-hot-toast/headless";

export interface PagedResponse<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface ToastifyProps {
  t: Toast;
  message: string;
  type: "success" | "error" | "info" | "warn";
}
