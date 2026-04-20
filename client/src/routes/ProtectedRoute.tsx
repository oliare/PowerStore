import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../services/userApi";
import Spin from "antd/es/spin";

export const ProtectedRoute = () => {
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) return <Spin>Завантаження...</Spin>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
