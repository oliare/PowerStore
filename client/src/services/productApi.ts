import type {
  ProductDetailsDto,
  ProductDto,
  ProductStockDto,
} from "../types/product";
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

    searchProducts: builder.query<
      ProductDto[],
      { query: string; count: number }
    >({
      query: ({ query, count }) => ({
        url: "/Products/search",
        method: "GET",
        params: { query, count },
      }),
    }),
    checkStock: builder.mutation<ProductStockDto[], string[]>({
      query: (ids) => ({
        url: "/Products/check-stock",
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSearchProductsQuery,
  useCheckStockMutation,
} = productApi;
