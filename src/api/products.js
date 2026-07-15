import { apiRequest } from "./client.js";

export function normalizeProduct(product) {
  if (!product) return null;
  return {
    ...product,
    id: product._id || product.id,
    image: product.images?.[0] || product.image || "",
  };
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  const data = await apiRequest(`/products${qs ? `?${qs}` : ""}`);
  return {
    products: (data.products || []).map(normalizeProduct),
    pagination: data.pagination,
  };
}

export async function fetchProductById(id) {
  const product = await apiRequest(`/products/${id}`);
  return normalizeProduct(product);
}
