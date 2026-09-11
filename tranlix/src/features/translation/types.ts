import type { Job, JobStatus } from "@features/jobs";

export interface PreflightResponse {
  fileName: string;
  fileType: string;
  sizeMB: number;
  estimatedTime: string;
  sourceKey: string;
  pages?: number;
  needOCR?: boolean;
}

export type CreatedJob = Job;

// One file the user has added to the upload form, plus its own preflight
// analysis state -- each file is analyzed independently so several can be
// added and previewed at once. `topics` is this file's OWN topic selection
// (not shared across the batch): each document can be about a different
// subject, so topic must be picked per file, not once for every file
// submitted together.
export interface UploadFile {
  file: File;
  id: string;
  preflight?: PreflightResponse;
  isAnalyzing: boolean;
  error?: string;
  topics: string[];
  // Manual override for the backend's pipeline auto-detection: forces a PDF
  // through OCR (Scan/Image pipeline) instead of PDF Text Layer. Only
  // meaningful for PDFs -- a PDF can have a non-empty but CORRUPTED text
  // layer (see backend's pdf_text/parser.py looks_like_broken_encoding),
  // which preflight's own needOCR heuristic (chars_per_page < 50) doesn't
  // reliably catch since garbled characters still count toward that
  // threshold. Default false: OCR is slower and (for Vietnamese sources)
  // less accurate on diacritics than the normal text-layer pipeline, so it
  // should only run when the user has a reason to believe it's needed.
  forceOcr: boolean;
}

// A job just created from this form, tracked locally for live status
// polling until it reaches a terminal state.
export interface RecentJob {
  id: string;
  status: JobStatus;
  source_filename: string;
  target_lang: string;
  processing_seconds: number | null;
  created_at: string;
  updated_at: string;
  originalFile: File;
  glossaryIds: string[];
  topics: string[];
}

// Image upload (scan_image pipeline) stays disabled -- that pipeline is a
// separate, permanent NotImplementedError (PaddleOCR/OpenCV deliberately
// left out of pyproject.toml, see tranlix-platform/CLAUDE.md), not a
// temporary restriction like PDF's was.
export const SUPPORTED_EXTENSIONS = [
  ".docx", ".doc", ".pptx", ".ppt", ".xlsx", ".xls", ".pdf",
] as const;

export const TARGET_LANGUAGES = [
  { code: "English", label: "Tiếng Anh" },
  { code: "Vietnamese", label: "Tiếng Việt" },
  { code: "Japanese", label: "Tiếng Nhật" },
  { code: "Chinese", label: "Tiếng Trung" },
  { code: "Korean", label: "Tiếng Hàn" },
  { code: "French", label: "Tiếng Pháp" },
  { code: "Spanish", label: "Tiếng Tây Ban Nha" },
  { code: "Russian", label: "Tiếng Nga" },
] as const;

// Fixed document-topic vocabulary, given to the LLM as translation context
// to improve terminology/word-sense accuracy. Keep in sync with
// TOPIC_CATEGORIES in tranlix-platform/app/features/translations/topics.py.
export const TOPICS = [
  { value: "Pháp lý", label: "Pháp lý" },
  { value: "Tài chính/Kế toán", label: "Tài chính/Kế toán" },
  { value: "Y tế", label: "Y tế" },
  { value: "Kỹ thuật/CNTT", label: "Kỹ thuật/CNTT" },
  { value: "Kỹ thuật cơ khí/điện", label: "Kỹ thuật cơ khí/điện" },
  { value: "Marketing/Quảng cáo", label: "Marketing/Quảng cáo" },
  { value: "Nhân sự", label: "Nhân sự" },
  { value: "Hợp đồng/Thương mại", label: "Hợp đồng/Thương mại" },
  { value: "Hành chính/Chính phủ", label: "Hành chính/Chính phủ" },
  { value: "Giáo dục/Học thuật", label: "Giáo dục/Học thuật" },
  { value: "Chung (General)", label: "Chung (General)" },
] as const;
