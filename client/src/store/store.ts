import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authSlice";
import { baseApi } from "../api/baseApi";
import uiReducer from "./uiSlice";
import cartReducer from "./cartSlice";
import { localStorageMiddleware } from "./middleware";

export const store = configureStore({
  reducer: {
    account: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    ui: uiReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;