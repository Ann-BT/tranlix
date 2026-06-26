import { apiClient } from "@shared/api/client";
import type { Paginated } from "@shared/api/types";
import type { Job } from "../types";

export const jobsApi = {
  list: (limit = 50, offset = 0) =>
    apiClient.get<Paginated<Job>>("/jobs", { params: { limit, offset } }).then((r) => r.data),

  get: (id: string) => apiClient.get<Job>(`/jobs/${id}`).then((r) => r.data),

  downloadUrl: (id: string) => `${apiClient.defaults.baseURL}/jobs/${id}/download`,
};
