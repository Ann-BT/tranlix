import { apiClient } from "@shared/api/client";
import type { Job } from "@features/jobs";
import type { PreflightResponse } from "../types";

export const translationApi = {
  preflight: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient
      .post<PreflightResponse>("/translations/preflight", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  create: (payload: {
    filename: string;
    sourceKey: string;
    targetLang: string;
    glossaryIds: string[];
    topics: string[];
    forceOcr?: boolean;
  }) => {
    const form = new FormData();
    form.append("filename", payload.filename);
    form.append("source_key", payload.sourceKey);
    form.append("target_lang", payload.targetLang);
    payload.glossaryIds.forEach((id) => form.append("glossary_ids", id));
    payload.topics.forEach((t) => form.append("topics", t));
    form.append("force_ocr", String(payload.forceOcr ?? false));
    return apiClient
      .post<Job>("/translations", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
