import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { usersApi } from "../services/userApi";
import userReducer from "./authSlice";
import { productApi } from "../services/productApi";

export const store = configureStore({
  reducer: {
    account: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      productApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
