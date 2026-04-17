import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../api/api";
import type { UserProfile } from "../types/user/user";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: baseQuery,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getMe: builder.query<UserProfile, void>({
      query: () => "/users/me",
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetMeQuery } = usersApi;
