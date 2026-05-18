import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

import type { AuthState, JwtPayload, UserAuth } from "../types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const EXPIRES_AT_KEY = "accessTokenExpiresAt";

const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
const storedExpiresAt = localStorage.getItem(EXPIRES_AT_KEY);

const buildAuthFlags = (token: string | null): UserAuth => {
  if (!token) {
    return { isAdmin: false, isUser: false, isAuth: false, roles: [] };
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);
    const roles = Array.isArray(payload.role)
      ? payload.role
      : payload.role
        ? [payload.role]
        : [];

    return {
      isAuth: true,
      roles,
      isAdmin: roles.includes("Admin"),
      isUser: roles.includes("User"),
    };
  } catch {
    return { isAdmin: false, isUser: false, isAuth: true, roles: [] };
  }
};

const initialState: AuthState = {
  accessToken: storedToken,
  expiresAt: storedExpiresAt ? Number(storedExpiresAt) : null,
  auth: buildAuthFlags(storedToken),
  isLoggingOut: false,
};

const userSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; expiresIn?: number }>,
    ) => {
      const { accessToken, expiresIn } = action.payload;
      const expiresAt =
        typeof expiresIn === "number"
          ? Date.now() + expiresIn * 1000
          : state.expiresAt;

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (expiresAt) {
        localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
      }

      state.accessToken = accessToken;
      state.expiresAt = expiresAt;
      state.auth = buildAuthFlags(accessToken);
      state.isLoggingOut = false;
    },

    setLoggingOut: (state, action: PayloadAction<boolean>) => {
      state.isLoggingOut = action.payload;
    },

    logOut: (state) => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(EXPIRES_AT_KEY);

      state.accessToken = null;
      state.expiresAt = null;
      state.auth = {
        isAdmin: false,
        isUser: false,
        isAuth: false,
        roles: [],
      };
      state.isLoggingOut = false;
    },
  },
});

export const getToken = (state: { account: AuthState }) =>
  state.account.accessToken;

export const selectIsAuthenticated = (state: { account: AuthState }) =>
  state.account.auth.isAuth && Boolean(state.account.accessToken);

export const { setCredentials, setLoggingOut, logOut } = userSlice.actions;
export default userSlice.reducer;
