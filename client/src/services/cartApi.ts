import { baseApi } from "../api/baseApi";
import type { CartItemDto, SyncCartDto } from "../types/cart"; // імпортуйте SyncCartDto

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRemoteCart: builder.query<CartItemDto[], void>({
      query: () => "/Cart",
      providesTags: ["Cart"],
    }),

    syncCart: builder.mutation<CartItemDto[], SyncCartDto>({
      query: (dto) => ({
        url: "/Cart/sync",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const { useGetRemoteCartQuery, useSyncCartMutation } = cartApi;
