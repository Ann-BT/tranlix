import { useQuery } from "@tanstack/react-query";
import { glossaryApi } from "../api/glossaryApi";

export const glossaryKeys = {
  all: ["glossaries"] as const,
  detail: (id: string) => ["glossaries", id] as const,
};

export function useGlossaries() {
  return useQuery({
    queryKey: glossaryKeys.all,
    queryFn: glossaryApi.list,
  });
}

export function useGlossary(id: string) {
  return useQuery({
    queryKey: glossaryKeys.detail(id),
    queryFn: () => glossaryApi.get(id),
    enabled: !!id,
  });
}
