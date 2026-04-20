import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../api/api";
import type { ProductDetailsDto, ProductDto } from "../types/user/product";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: createBaseQuery,
  tagTypes: ["Products"],
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
