import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../api/api";
import type { UserProfile } from "../types/user/user";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: createBaseQuery,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getMe: builder.query<UserProfile, void>({
      query: () => "/Users/me",
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetMeQuery } = usersApi;
