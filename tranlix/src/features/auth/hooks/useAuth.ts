import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => setToken(data.access_token),
  });
}
