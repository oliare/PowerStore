import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItemDto } from "../types/cart";

interface CartState {
  items: CartItemDto[];
}

const savedItems = localStorage.getItem("cart");

const initialState: CartState = {
  items: savedItems ? JSON.parse(savedItems) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemDto>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.unshift({
          ...action.payload,
          quantity: action.payload.quantity,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    setCartItems: (state, action: PayloadAction<CartItemDto[]>) => {
      state.items = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setCartItems,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
