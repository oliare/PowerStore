import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import { localStorageMiddleware } from "./middleware";
import userReducer from "./authSlice";
import uiReducer from "./uiSlice";
import cartReducer from "./cartSlice";
import favoritesReducer from "./favoriteSlice";

export const store = configureStore({
  reducer: {
    account: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    ui: uiReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
