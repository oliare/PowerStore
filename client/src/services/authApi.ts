import { createApi } from "@reduxjs/toolkit/query/react";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/user/auth";
import { createBaseQuery } from "../api/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery,
  tagTypes: ["Auth"],
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
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
