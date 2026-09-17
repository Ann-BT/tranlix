import { useMutation, useQueryClient } from "@tanstack/react-query";
import { glossaryApi } from "../api/glossaryApi";
import { glossaryKeys } from "./useGlossaries";

export function useCreateGlossary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: glossaryApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: glossaryKeys.all }),
  });
}
