import { useMutation, useQueryClient } from "@tanstack/react-query";
import { glossaryApi } from "../api/glossaryApi";
import { glossaryKeys } from "./useGlossaries";

export function useAddTerm(glossaryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { source: string; target: string }) =>
      glossaryApi.addTerm({ glossary_id: glossaryId, ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: glossaryKeys.detail(glossaryId) }),
  });
}

export function useDeleteTerm(glossaryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (termId: string) => glossaryApi.deleteTerm(glossaryId, termId),
    onSuccess: () => qc.invalidateQueries({ queryKey: glossaryKeys.detail(glossaryId) }),
  });
}
