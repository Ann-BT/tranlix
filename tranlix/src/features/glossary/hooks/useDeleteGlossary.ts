import { useMutation, useQueryClient } from "@tanstack/react-query";
import { glossaryApi } from "../api/glossaryApi";
import { glossaryKeys } from "./useGlossaries";

export function useDeleteGlossary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => glossaryApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: glossaryKeys.all }),
  });
}
