import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jobKeys } from "@features/jobs/hooks/useJobs";
import { translationApi } from "../api/translationApi";

export function useCreateTranslation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: translationApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: jobKeys.all }),
  });
}
