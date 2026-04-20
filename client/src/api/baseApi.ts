import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: createBaseQuery,
  tagTypes: ["User", "Auth", "Products"],
  endpoints: () => ({}),
});
