import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { JwtPayload } from "../types/user/auth";

export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as JwtPayload;
    const token = state.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
