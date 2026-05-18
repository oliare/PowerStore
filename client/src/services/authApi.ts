import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";
import { baseApi } from "../api/baseApi";

const authCredentials = { credentials: "include" as const };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userRegister) => ({
        url: "Auth/register",
        method: "POST",
        body: userRegister,
        ...authCredentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (loginCredentials) => ({
        url: "Auth/login",
        method: "POST",
        body: loginCredentials,
        ...authCredentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "Auth/refresh",
        method: "POST",
        ...authCredentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "Auth/logout",
        method: "POST",
        ...authCredentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    logoutAll: builder.mutation<void, void>({
      query: () => ({
        url: "Auth/logout-all",
        method: "POST",
        ...authCredentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useLogoutAllMutation,
} = authApi;
