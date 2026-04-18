import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState } from "../types/user/auth";

const ACCESS_TOKEN = "accessToken";
const token = localStorage.getItem(ACCESS_TOKEN);

const initialState: AuthState = {
  accessToken: token || null,
  auth: {
    isAdmin: false,
    isUser: false,
    isAuth: !!token,
    roles: [],
  },
};

const userSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;

      localStorage.setItem(ACCESS_TOKEN, accessToken);

      state.accessToken = accessToken;
      state.auth.isAuth = true;
    },

    logOut: (state) => {
      localStorage.removeItem(ACCESS_TOKEN);

      state.accessToken = null;
      state.auth = {
        isAdmin: false,
        isUser: false,
        isAuth: false,
        roles: [],
      };
    },
  },
});

export const getToken = (state: { account: AuthState }) => state.account.accessToken;

export const { setCredentials, logOut } = userSlice.actions;
export default userSlice.reducer;
