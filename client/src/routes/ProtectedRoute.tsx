import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Spin from "antd/es/spin";
import { useAuthMeQuery } from "../hooks/useAuthMe";
import type { RootState } from "../store/store";

export const ProtectedRoute = () => {
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );
  const { data: user, isLoading, isFetching } = useAuthMeQuery();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || isFetching) {
    return <Spin>Завантаження...</Spin>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
