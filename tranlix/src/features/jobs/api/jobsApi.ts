import { apiClient } from "@shared/api/client";
import type { Paginated } from "@shared/api/types";
import type { Job, ViewInfo } from "../types";

// These endpoints require the Authorization header, which a plain <a href>/window.open
// navigation can't attach — so we fetch via apiClient as a blob and drive the
// download/open client-side instead of linking straight to the URL.

function extractFilename(disposition?: string): string | null {
  if (!disposition) return null;
  const utf8 = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1]);
    } catch {
      // fall through to plain filename
    }
  }
  const plain = disposition.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : null;
}

async function fetchBlobWithFilename(path: string, fallbackName: string) {
  const res = await apiClient.get(path, { responseType: "blob" });
  const filename = extractFilename(res.headers["content-disposition"]) || fallbackName;
  return { blob: res.data as Blob, filename };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const jobsApi = {
  list: (limit = 50, offset = 0) =>
    apiClient.get<Paginated<Job>>("/history", { params: { limit, offset } }).then((r) => r.data),

  get: (id: string) => apiClient.get<Job>(`/history/${id}`).then((r) => r.data),

  viewInfo: (id: string, side: "source" | "result") =>
    apiClient.get<ViewInfo>(`/history/${id}/view`, { params: { side } }).then((r) => r.data),

  download: async (id: string) => {
    const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download`, "translated-document");
    triggerDownload(blob, filename);
  },

  downloadDocx: async (id: string) => {
    const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download/docx`, "translated-document.docx");
    triggerDownload(blob, filename);
  },

  // Office Pipeline always stores its result in the "new" OOXML format
  // (.docx/.xlsx/.pptx) — the engine only understands OOXML. This converts the
  // stored result to the legacy .doc/.xls/.ppt format on the fly (LibreOffice,
  // server-side), offered as a download CHOICE regardless of whether the
  // upload itself was legacy or modern (old MS Office can't open the new
  // format at all, independent of what was uploaded).
  downloadLegacy: async (id: string) => {
    const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download/legacy`, "translated-document");
    triggerDownload(blob, filename);
  },

  // Same idea as downloadLegacy, but for the PDF Text Layer Pipeline's DOCX
  // companion (job.has_docx) instead of an Office Pipeline result.
  downloadDocxLegacy: async (id: string) => {
    const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download/docx/legacy`, "translated-document.doc");
    triggerDownload(blob, filename);
  },
};
