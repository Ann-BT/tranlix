import { useQuery } from "@tanstack/react-query";

import { jobsApi } from "../api/jobsApi";

export const jobKeys = {
  all: ["jobs"] as const,
  detail: (id: string) => ["jobs", id] as const,
};

export function useJobs() {
  return useQuery({ 
    queryKey: jobKeys.all, 
    queryFn: () => jobsApi.list(),
    refetchInterval: (query) => {
      const items = query.state.data?.items;
      const hasActive = items?.some(
        (job) => job.status === "pending" || job.status === "processing"
      );
      return hasActive ? 3000 : false;
    }
  });
}
