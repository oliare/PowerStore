import type { ProductDetailsDto, ProductDto } from "../types/product";
import { baseApi } from "../api/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductDto[], { limit: number }>({
      query: ({ limit }) => `/Products?limit=${limit}`,
      providesTags: ["Products"],
    }),
    getProductDetails: builder.query<ProductDetailsDto, string>({
      query: (id) => `/Products/details/${id}`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productApi;
