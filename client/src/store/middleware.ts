import type { Middleware } from "@reduxjs/toolkit";

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    if (typeof action === "object" && action !== null && "type" in action) {
      const actionType = (action as { type: string }).type;
      if (actionType.startsWith("cart/")) {
        localStorage.setItem(
          "cart",
          JSON.stringify(state.cart.items),
        );
      }
    }

    return result;
  };
