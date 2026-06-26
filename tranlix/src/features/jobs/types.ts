export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  source_filename: string;
  target_lang: string;
  inline_mode: boolean;
  progress: number;
  segment_count: number | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}
