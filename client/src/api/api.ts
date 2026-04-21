import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const PLACEHOLDER_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsrGS4gCi1t_OKtlUFXwoXq0Z1yJBkNagHOsgoPa1N-A&s";

export const createBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).account.accessToken;
    if (token && token.length > 0) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
