import { apiClient } from "@shared/api/client";
import type { AdminUser, CreateUserInput } from "../types";

export const usersApi = {
  list: (): Promise<AdminUser[]> =>
    apiClient.get<AdminUser[]>("/users").then((r) => r.data),

  create: (input: CreateUserInput): Promise<AdminUser> =>
    apiClient.post<AdminUser>("/users", input).then((r) => r.data),
};
