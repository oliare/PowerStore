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
  brands?: string[];
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PagedResponse<ProductDto>, GetProductsArgs>({
      query: ({ page, pageSize, categoryId, brands }) => {
        // Будуємо URL вручну — бекенд (ASP.NET List<string>) очікує:
        // brands=Nike&brands=Adidas  (а НЕ brands=Nike,Adidas)
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        if (categoryId) params.set("categoryId", categoryId);
        if (brands && brands.length > 0) {
          brands.forEach((b) => params.append("brands", b));
        }
        return `/Products?${params.toString()}`;
      },
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

    getBrands: builder.query<string[], void>({
      query: () => "/Products/brands",
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSearchProductsQuery,
  useCheckStockMutation,
  useGetBrandsQuery,
} = productApi;
