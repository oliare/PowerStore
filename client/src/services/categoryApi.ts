import type { CategoryDto } from "../types/category";
import { baseApi } from "../api/baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryDto[], void>({
      query: () => "categories",
      providesTags: ["Category"],
    }),

    getCategoryTree: builder.query<CategoryDto[], void>({
      query: () => "categories/tree",
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query<CategoryDto, string>({
      query: (id) => `categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    createCategory: builder.mutation<CategoryDto, Partial<CategoryDto>>({
      query: (body) => ({
        url: "categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
} = categoryApi;
