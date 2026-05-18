import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Auth",
    "Products",
    "Cart",
    "Favorites",
    "Order",
    "Category",
    "Reviews",
  ],
  endpoints: () => ({}),
});
