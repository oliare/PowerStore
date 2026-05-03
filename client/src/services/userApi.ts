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

    updateProfile: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "Users/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useSendMessageMutation,
  useUpdateProfileMutation,
} = usersApi;
