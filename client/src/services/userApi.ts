import type { UserProfile } from "../types/user";
import { baseApi } from "../api/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserProfile, void>({
      query: () => "/Users/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery } = usersApi;
