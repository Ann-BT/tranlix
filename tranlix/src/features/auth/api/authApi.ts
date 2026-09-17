import { apiClient } from "@shared/api/client";
import type { Credentials } from "../types";

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  login: (creds: Credentials) =>
    apiClient.post<TokenResponse>("/auth/login", creds).then((r) => r.data),
};
