import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isAuthModalOpen: boolean;
  authModalTitle: string;
}

const initialState: UiState = {
  isAuthModalOpen: false,
  authModalTitle: "Потрібна авторизація",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalTitle = action.payload || "Потрібна авторизація";
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { openAuthModal, closeAuthModal } = uiSlice.actions;
export default uiSlice.reducer;
