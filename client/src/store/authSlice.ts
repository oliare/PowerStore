import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState } from "../types/user/auth";

const ACCESS_TOKEN = "accessToken";
const token = localStorage.getItem(ACCESS_TOKEN);

const initialState: AuthState = {
  token: token || null,
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
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;

      localStorage.setItem(ACCESS_TOKEN, token);

      state.token = token;
      state.auth.isAuth = true;
    },

    logOut: (state) => {
      localStorage.removeItem(ACCESS_TOKEN);

      state.token = null;
      state.auth = {
        isAdmin: false,
        isUser: false,
        isAuth: false,
        roles: [],
      };
    },
  },
});

export const getToken = (state: { account: AuthState }) =>
  state.account.token;

export const { setCredentials, logOut } = userSlice.actions;
export default userSlice.reducer;
