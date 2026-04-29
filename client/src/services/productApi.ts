import type { ProductDetailsDto, ProductDto } from "../types/product";
import { baseApi } from "../api/baseApi";
import type { PagedResponse } from "../types/common";

interface GetProductsArgs {
  page: number;
  pageSize: number;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PagedResponse<ProductDto>, GetProductsArgs>({
      query: ({ page, pageSize }) =>
        `/Products?page=${page}&pageSize=${pageSize}`,
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query<ProductDetailsDto, string>({
      query: (id) => `/Products/details/${id}`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productApi;
