import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItemDto } from "../types/cart";
import { showNotify } from "../utils/showNotify";

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

      const stockLimit = action.payload.stockQuantity ?? 999;

      if (existingItem) {
        const newQuantity = existingItem.quantity + action.payload.quantity;

        if (newQuantity > stockLimit) {
          existingItem.quantity = stockLimit;
          showNotify.error(
            `Досягнуто ліміт залишку на складі (${stockLimit} шт.)`,
          );
        } else {
          existingItem.quantity = newQuantity;
        }
      } else {
        const initialQuantity =
          action.payload.quantity > stockLimit
            ? stockLimit
            : action.payload.quantity;

        state.items.unshift({
          ...action.payload,
          quantity: initialQuantity,
        });

        if (action.payload.quantity > stockLimit) {
          showNotify.error(`Додано лише доступний залишок (${stockLimit} шт.)`);
        }
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (item) {
        const stockLimit = item.stockQuantity ?? 999;

        if (action.payload.quantity > stockLimit) {
          item.quantity = stockLimit;
          showNotify.error(`На складі залишилося лише ${stockLimit} шт.`);
        } else if (action.payload.quantity > 0) {
          item.quantity = action.payload.quantity;
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
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
