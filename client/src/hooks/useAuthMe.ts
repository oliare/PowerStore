import { useSelector } from "react-redux";
import { useGetMeQuery } from "../services/userApi";
import type { RootState } from "../store/store";

export const useAuthMeQuery = (
  options?: Parameters<typeof useGetMeQuery>[1],
) => {
  const accessToken = useSelector(
    (state: RootState) => state.account.accessToken,
  );

  return useGetMeQuery(undefined, {
    ...options,
    skip: !accessToken || options?.skip,
  });
};
