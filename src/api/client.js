const API_BASE = import.meta.env.VITE_API_URL || "/api";

const GUEST_KEY = "shopco_guest_id";
const TOKEN_KEY = "shopco_token";

export function getGuestId() {
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  headers["x-guest-id"] = getGuestId();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.errors?.[0]?.msg ||
      `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
