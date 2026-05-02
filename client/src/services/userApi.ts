import type { UserProfile } from "../types/user";
import { baseApi } from "../api/baseApi";
import type { ContactMessage } from "../types/common";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserProfile, void>({
      query: () => "/Users/me",
      providesTags: ["User"],
    }),

    sendMessage: builder.mutation<void, ContactMessage>({
      query: (message) => ({
        url: "Users/contact-message",
        method: "POST",
        body: message,
      }),
    }),
  }),
});

export const { useGetMeQuery, useSendMessageMutation } = usersApi;
