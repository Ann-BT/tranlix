import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (t: string | null) => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("access_token"),
  setToken: (t) => {
    if (t) localStorage.setItem("access_token", t);
    else localStorage.removeItem("access_token");
    set({ token: t });
  },
  isAuthenticated: () => Boolean(get().token),
}));
