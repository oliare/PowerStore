import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isAuthModalOpen: boolean;
  isCartSidebarOpen: boolean;
  authModalTitle: string;
}

const initialState: UiState = {
  isAuthModalOpen: false,
  isCartSidebarOpen: false,
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
    toggleCartSidebar: (state) => {
      state.isCartSidebarOpen = !state.isCartSidebarOpen;
    },
    openCartSidebar: (state) => {
      state.isCartSidebarOpen = true;
    },
    closeCartSidebar: (state) => {
      state.isCartSidebarOpen = false;
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  toggleCartSidebar,
  openCartSidebar,
  closeCartSidebar,
} = uiSlice.actions;
export default uiSlice.reducer;
