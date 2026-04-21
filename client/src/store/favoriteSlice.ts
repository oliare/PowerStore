import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FavoriteItemDTO } from "../types/user/favorite";

interface FavoritesState {
  items: FavoriteItemDTO[];
}

const savedItems = localStorage.getItem("favorites");

const initialState: FavoritesState = {
  items: savedItems ? JSON.parse(savedItems) : [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorites: (state, action: PayloadAction<FavoriteItemDTO>) => {
      const index = state.items.findIndex(
        (item) => item.productId === action.payload.productId,
      );
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
    setFavoriteItems: (state, action: PayloadAction<FavoriteItemDTO[]>) => {
      state.items = action.payload;
      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem("favorites");
    },
  },
});

export const { toggleFavorites, setFavoriteItems, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
