const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateState = (state) => {
  //Calculate the Item price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate shipping Price(If Order is over 500 then free, else 20rs for shipping)
  state.shippingPrice = addDecimals(state.itemsPrice > 500 ? 0 : 20);

  //Calculate tax Price(10%)
  state.taxPrice = addDecimals(Number(0.1 * state.itemsPrice).toFixed(2));

  //Now Totalprice
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
