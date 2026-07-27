import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";

export const userKeys = {
  all: ["users"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: usersApi.list,
  });
}
