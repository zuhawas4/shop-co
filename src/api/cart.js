import { apiRequest } from "./client.js";

export async function fetchCart() {
  return apiRequest("/cart");
}

export async function addCartItem({ productId, quantity, size, color }) {
  return apiRequest("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity, size, color }),
  });
}

export async function updateCartItem(itemId, payload) {
  return apiRequest(`/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function removeCartItem(itemId) {
  return apiRequest(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  return apiRequest("/cart", { method: "DELETE" });
}
