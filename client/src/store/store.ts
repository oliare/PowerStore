import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authSlice";
import { baseApi } from "../api/baseApi";
import uiReducer from "./uiSlice.ts";

export const store = configureStore({
  reducer: {
    account: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
