import { apiClient } from "@shared/api/client";
import type { Job } from "@features/jobs";
import type { CreateTranslationInput } from "../types";

export const translationApi = {
  create: ({ file, targetLang, inlineMode, glossaryId }: CreateTranslationInput) => {
    const form = new FormData();
    form.append("file", file);
    form.append("target_lang", targetLang);
    form.append("inline_mode", String(inlineMode));
    if (glossaryId) form.append("glossary_id", glossaryId);
    return apiClient
      .post<Job>("/translations", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
};
