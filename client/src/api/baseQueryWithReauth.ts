import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { AuthResponse } from "../types/auth";
import { logOut, setCredentials } from "../store/authSlice";
import type { RootState } from "../store/store";
import { API_URL } from "./api";

const AUTH_SKIP_REFRESH_PATHS = [
  "Auth/login",
  "Auth/register",
  "Auth/refresh",
  "Auth/logout",
];

const getRequestPath = (args: string | FetchArgs): string => {
  if (typeof args === "string") return args;
  return args.url;
};

const shouldSkipRefresh = (args: string | FetchArgs): boolean => {
  const path = getRequestPath(args);
  return AUTH_SKIP_REFRESH_PATHS.some((segment) => path.includes(segment));
};

export const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).account.accessToken;
    if (token && token.length > 0) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<boolean> => {
  const refreshResult = await rawBaseQuery(
    { url: "Auth/refresh", method: "POST" },
    api,
    extraOptions,
  );

  if (refreshResult.data) {
    const data = refreshResult.data as AuthResponse;
    api.dispatch(
      setCredentials({
        accessToken: data.accessToken,
        expiresIn: data.expiresIn,
      }),
    );
    return true;
  }

  api.dispatch(logOut());
  return false;
};

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || shouldSkipRefresh(args)) {
    return result;
  }

  const state = api.getState() as RootState;
  if (!state.account.accessToken) {
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken(api, extraOptions).finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;

  if (refreshed) {
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};
