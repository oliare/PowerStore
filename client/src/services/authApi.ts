import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/user/auth";
import { baseApi } from "../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<void, RegisterRequest>({
      query: (userRegister) => ({
        url: "Auth/register",
        method: "POST",
        body: userRegister,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (loginCredentials) => ({
        url: "Auth/login",
        method: "POST",
        body: loginCredentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
