import type { OrderCreateDto, OrderDto } from "../types/order";
import { baseApi } from "../api/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderDto, OrderCreateDto>({
      query: (newOrder) => ({
        url: "Orders",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Order"],
    }),

    getMyOrders: builder.query<OrderDto[], void>({
      query: () => "Orders/my-orders",
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<OrderDto, string>({
      query: (id) => `Orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;
