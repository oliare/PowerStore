import { baseApi } from "../api/baseApi";

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "Auth/subscribe-newsletter",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubscribeToNewsletterMutation } = newsletterApi;
