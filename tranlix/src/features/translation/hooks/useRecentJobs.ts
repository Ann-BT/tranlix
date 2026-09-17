import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { jobKeys } from "@features/jobs/hooks/useJobs";
import { jobsApi } from "@features/jobs";
import type { RecentJob } from "../types";

const SESSION_STORAGE_KEY = "tranlix_recent_jobs_v6";

function createMockFile(filename: string): File {
  try {
    return new File(["fake content"], filename, { type: "application/pdf" });
  } catch {
    return { name: filename, size: 1024, type: "application/pdf" } as unknown as File;
  }
}


function loadRecentJobsFromSession(): RecentJob[] {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Exclude legacy pre-populated mock jobs
        const filtered = parsed.filter(
          (j) =>
            j.id !== "0d0a6949-3d89-44cc-ae3f-3cbb5f466b0e" &&
            j.id !== "fdf9e1ce-bfdc-4fb9-82b9-38613ae6c1c9" &&
            j.id !== "8213bc01-9f12-4211-b12a-442299aa1029" &&
            j.id !== "e55b1022-7721-4d3f-bc91-231188bb3310"
        );
        return filtered.map((item) => ({
          ...item,
          originalFile: createMockFile(item.source_filename),
        }));
      }
    }
  } catch (e) {
    console.warn("Failed to load recent jobs from sessionStorage", e);
  }
  return [];
}

function saveRecentJobsToSession(jobs: RecentJob[]) {
  try {
    const serializable = jobs.map((j) => ({
      id: j.id,
      source_filename: j.source_filename,
      target_lang: j.target_lang,
      status: j.status,
      created_at: j.created_at,
      updated_at: j.updated_at,
      processing_seconds: j.processing_seconds,
      glossaryIds: j.glossaryIds || [],
      topics: j.topics || [],
    }));
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.warn("Failed to save recent jobs to sessionStorage", e);
  }
}

// Tracks jobs created from this form and polls their status until each
// reaches a terminal state (completed/failed).
export function useRecentJobs() {
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>(loadRecentJobsFromSession);
  const queryClient = useQueryClient();

  useEffect(() => {
    saveRecentJobsToSession(recentJobs);
  }, [recentJobs]);

  useEffect(() => {
    const activeJobs = recentJobs.filter(j => j.status === "pending" || j.status === "processing");
    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updatedJobs = await Promise.all(
          recentJobs.map(async (rj) => {
            if (rj.status === "pending" || rj.status === "processing") {
              try {
                const freshJob = await jobsApi.get(rj.id);
                return {
                  ...rj,
                  status: freshJob.status,
                  processing_seconds: freshJob.processing_seconds,
                  created_at: freshJob.created_at,
                  updated_at: freshJob.updated_at,
                };
              } catch {
                return rj;
              }
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

  const addJobs = (jobs: RecentJob[]) => {
    setRecentJobs((prev) => {
      const updated = [...jobs, ...prev];
      saveRecentJobsToSession(updated);
      return updated;
    });
  };

  return { recentJobs, addJobs };
}
