import type { Job } from "@features/jobs";

export interface CreateTranslationInput {
  file: File;
  targetLang: string;
  inlineMode: boolean;
}

export type CreatedJob = Job;

export const SUPPORTED_EXTENSIONS = [
  ".docx", ".doc", ".pptx", ".ppt", ".xlsx", ".xls",
] as const;

export const TARGET_LANGUAGES = [
  { code: "English", label: "Tiếng Anh" },
  { code: "Vietnamese", label: "Tiếng Việt" },
  { code: "Japanese", label: "Tiếng Nhật" },
  { code: "Chinese", label: "Tiếng Trung" },
  { code: "Korean", label: "Tiếng Hàn" },
] as const;
