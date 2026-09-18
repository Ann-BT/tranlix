import axios from "axios";

import { env } from "@/config/env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { Accept: "application/json" },
  withCredentials: true,
});

// Gắn token (nếu có) — đọc từ auth store
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const detail = error.response?.data?.detail ?? error.message;
    return Promise.reject(new Error(detail));
  },
);
