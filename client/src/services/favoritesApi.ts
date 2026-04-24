import type {
  FavoriteItemDTO,
  ToggleFavoriteRequestDTO,
} from "../types/favorite";
import { baseApi } from "../api/baseApi";

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<FavoriteItemDTO[], void>({
      query: () => "/Favorites",
      providesTags: ["Favorites"],
    }),

    toggleFavorite: builder.mutation<void, ToggleFavoriteRequestDTO>({
      query: (body) => ({
        url: "/Favorites/toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favorites"],
    }),

    syncFavorites: builder.mutation<
      FavoriteItemDTO[],
      { productIds: string[] }
    >({
      query: (body) => ({
        url: "/Favorites/sync",
        method: "POST",
        body: body.productIds,
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useToggleFavoriteMutation,
  useSyncFavoritesMutation,
} = favoritesApi;
