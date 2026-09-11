import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { jobKeys } from "@features/jobs/hooks/useJobs";
import { jobsApi } from "@features/jobs";
import type { RecentJob } from "../types";

// Tracks jobs created from this form and polls their status until each
// reaches a terminal state (completed/failed).
export function useRecentJobs() {
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const activeJobs = recentJobs.filter(j => j.status === "pending" || j.status === "processing");
    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updatedJobs = await Promise.all(
          recentJobs.map(async (rj) => {
            if (rj.status === "pending" || rj.status === "processing") {
              const freshJob = await jobsApi.get(rj.id);
              return {
                ...rj,
                status: freshJob.status,
                processing_seconds: freshJob.processing_seconds,
                created_at: freshJob.created_at,
                updated_at: freshJob.updated_at,
              };
            }
            return rj;
          })
        );

        const hasChange = updatedJobs.some((uj, idx) => uj.status !== recentJobs[idx].status);
        if (hasChange) {
          setRecentJobs(updatedJobs);
          queryClient.invalidateQueries({ queryKey: jobKeys.all });
        }
      } catch (err) {
        console.error("Error polling job statuses", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [recentJobs, queryClient]);

  const addJobs = (jobs: RecentJob[]) => setRecentJobs(prev => [...jobs, ...prev]);

  return { recentJobs, addJobs };
}
