import type { ProductDetailsDto, ProductDto } from "../types/product";
import { baseApi } from "../api/baseApi";
import type { PagedResponse } from "../types/common";

interface GetProductsArgs {
  page: number;
  pageSize: number;
  categoryId?: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PagedResponse<ProductDto>, GetProductsArgs>({
      query: ({ page, pageSize, categoryId }) =>
        `/Products?page=${page}&pageSize=${pageSize}${categoryId ? `&categoryId=${categoryId}` : ""}`,
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query<ProductDetailsDto, string>({
      query: (id) => `/Products/details/${id}`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } = productApi;
