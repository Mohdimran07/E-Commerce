import { createSlice } from "@reduxjs/toolkit";
import { updateState } from "../utils/cartUtilis";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const Item = action.payload;

      const existingItem = state.cartItems.find((e) => e._id === Item._id);

      if (existingItem) {
        state.cartItems = state.cartItems.map((i) =>
          i._id === existingItem._id ? Item : i
        );
      } else {
        state.cartItems = [...state.cartItems, Item];
      }

      return updateState(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      return updateState(state);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
