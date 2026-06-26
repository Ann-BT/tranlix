import { useQuery } from "@tanstack/react-query";

import { jobsApi } from "../api/jobsApi";
import { jobKeys } from "./useJobs";

// Poll trạng thái 1 job cho tới khi xong (completed/failed).
export function useJobPolling(id: string | undefined) {
  return useQuery({
    queryKey: id ? jobKeys.detail(id) : ["jobs", "none"],
    queryFn: () => jobsApi.get(id as string),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 2000;
    },
  });
}
