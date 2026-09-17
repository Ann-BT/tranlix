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
  error: string | null;
  // True only for PDF Text Layer Pipeline jobs that produced an editable DOCX
  // companion alongside the translated (searchable) PDF.
  has_docx: boolean;
  // Real elapsed processing time (seconds), measured directly in the Celery
  // task -- see TranslationJob.processing_seconds's own docstring for why
  // this isn't just derived from updated_at - created_at on the frontend.
  // null for jobs that predate this field or haven't reached a terminal
  // status yet.
  processing_seconds: number | null;
  created_at: string;
  updated_at: string;
}
