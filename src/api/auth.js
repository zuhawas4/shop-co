import { apiRequest, setToken } from "./client.js";

export async function signup({ name, email, password, confirmPassword }) {
  const data = await apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
  setToken(data.token);
  return data;
}

export async function login({ email, password }) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function fetchMe() {
  return apiRequest("/auth/me");
}

export function logout() {
  setToken(null);
}
