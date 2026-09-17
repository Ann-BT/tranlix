import { useState } from "react";

import { translationApi } from "../api/translationApi";
import type { RecentJob, UploadFile } from "../types";

interface Args {
  targetLang: string;
  glossaryIds: string[];
  onSuccess: (jobs: RecentJob[]) => void;
}

// Submits one translation job per ready file, applying every selected
// glossary to that job (the backend merges terms across all of them).
// Topic is NOT shared across the batch -- each file carries its own
// `topics` (set per-file in the upload list UI, see UploadFile.topics),
// since different documents submitted together can be about different
// subjects; topics left empty for a given file are auto-detected
// server-side for that file only.
export function useSubmitTranslation({ targetLang, glossaryIds, onSuccess }: Args) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (readyFiles: UploadFile[]) => {
    if (readyFiles.length === 0) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setIsSuccess(false);

    try {
      const createdJobs: RecentJob[] = await Promise.all(
        readyFiles.map(async (item) => {
          const job = await translationApi.create({
            filename: item.file.name,
            sourceKey: item.preflight!.sourceKey,
            targetLang,
            glossaryIds,
            topics: item.topics,
            forceOcr: item.forceOcr,
          });
          return {
            id: job.id,
            status: job.status,
            source_filename: job.source_filename,
            target_lang: job.target_lang,
            processing_seconds: job.processing_seconds,
            created_at: job.created_at,
            updated_at: job.updated_at,
            originalFile: item.file,
            glossaryIds,
            topics: item.topics,
          };
        })
      );

      onSuccess(createdJobs);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Có lỗi xảy ra khi tải lên và dịch tài liệu.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, errorMsg, isSuccess };
}
