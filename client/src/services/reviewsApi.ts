import type { ReviewDto, CreateReviewDto } from "../types/review";
import { baseApi } from "../api/baseApi";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ReviewDto[], string>({
      query: (productId) => `Reviews/product/${productId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Reviews" as const, id })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),
    addReview: builder.mutation<{ message: string }, CreateReviewDto>({
      query: (body) => ({
        url: "Reviews",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Reviews", id: "LIST" }, "Products"],
    }),
  }),
});

export const { useGetProductReviewsQuery, useAddReviewMutation } = reviewsApi;
