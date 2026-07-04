export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface ViewInfo {
  url: string;
  filename: string;
  filetype: string;
  document_type: string;
  doc_key: string;
}

export interface Job {
  id: string;
  status: JobStatus;
  source_filename: string;
  target_lang: string;
  inline_mode: boolean;
  progress: number;
  segment_count: number | null;
  error: string | null;
  // True only for PDF Text Layer Pipeline jobs that produced an editable DOCX
  // companion alongside the translated (searchable) PDF.
  has_docx: boolean;
  created_at: string;
  updated_at: string;
}
