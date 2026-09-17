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

const FEATURED_MOCK_JOBS: Job[] = [
  {
    id: "0d0a6949-3d89-44cc-ae3f-3cbb5f466b0e",
    status: "completed",
    source_filename: "Varex Production Update Letter.pdf",
    target_lang: "Tiếng Việt",
    error: null,
    has_docx: true,
    processing_seconds: 76,
    created_at: "2026-09-16T15:30:14Z",
    updated_at: "2026-09-16T15:31:30Z",
  },
  {
    id: "8213bc01-9f12-4211-b12a-442299aa1029",
    status: "processing",
    source_filename: "Quy trình Vận hành Chuẩn (SOP) Y tế 2026.pdf",
    target_lang: "Tiếng Việt",
    error: null,
    has_docx: false,
    processing_seconds: 45,
    created_at: "2026-09-16T14:12:05Z",
    updated_at: "2026-09-16T14:12:50Z",
  },
  {
    id: "e55b1022-7721-4d3f-bc91-231188bb3310",
    status: "completed",
    source_filename: "Báo cáo tài chính hợp nhất Q3-2026.xlsx",
    target_lang: "English",
    error: null,
    has_docx: false,
    processing_seconds: 32,
    created_at: "2026-09-16T12:05:30Z",
    updated_at: "2026-09-16T12:06:02Z",
  },
  {
    id: "7711aa88-6622-4113-9821-112233445566",
    status: "completed",
    source_filename: "Hợp đồng Mua bán Thiết bị Y tế Kỹ thuật cao.pdf",
    target_lang: "Tiếng Việt",
    error: null,
    has_docx: true,
    processing_seconds: 100,
    created_at: "2026-09-16T10:22:18Z",
    updated_at: "2026-09-16T10:23:58Z",
  },
  {
    id: "fdf9e1ce-bfdc-4fb9-82b9-38613ae6c1c9",
    status: "completed",
    source_filename: "CIS Service Levels Matrix.pdf",
    target_lang: "Tiếng Việt",
    error: null,
    has_docx: false,
    processing_seconds: 18,
    created_at: "2026-09-15T18:34:40Z",
    updated_at: "2026-09-15T18:34:58Z",
  },
  {
    id: "a71c8b91-821a-4c22-901d-5511b81e4a10",
    status: "completed",
    source_filename: "BDE-25V270 User Manual 220V 50HZ v2023-A.docx",
    target_lang: "Tiếng Việt",
    error: null,
    has_docx: true,
    processing_seconds: 125,
    created_at: "2026-09-15T16:20:12Z",
    updated_at: "2026-09-15T16:22:17Z",
  },
  {
    id: "33221100-4455-6677-8899-aabbccddeeff",
    status: "completed",
    source_filename: "Tài liệu Hướng dẫn Sử dụng Máy chụp X-Quang Varex.pdf",
    target_lang: "Tiếng Việt",
    error: null,
    has_docx: true,
    processing_seconds: 190,
    created_at: "2026-09-15T14:15:00Z",
    updated_at: "2026-09-15T14:18:10Z",
  },
  {
    id: "99887766-5544-3322-1100-ffeeddccbbaa",
    status: "failed",
    source_filename: "Tờ khai Hải quan và Chứng nhận Xuất xứ CO.docx",
    target_lang: "English",
    error: "Tệp tin bị khóa định dạng hoặc bị lỗi cấu trúc font",
    has_docx: false,
    processing_seconds: 12,
    created_at: "2026-09-15T11:45:10Z",
    updated_at: "2026-09-15T11:45:22Z",
  },
];

const RAW_FILENAMES = [
  "Điều lệ Công ty Cổ phần Y tế Quốc tế 2026.docx",
  "Biên bản Giao nhận Hàng hóa và Kiểm định Chất lượng.pdf",
  "Tài liệu Thuyết minh Kỹ thuật Hệ thống Siêu âm.pptx",
  "Thỏa thuận Bảo mật Thông tin NDA Doanh nghiệp.docx",
  "Báo cáo Đánh giá Tác động Môi trường Dự án 2026.pdf",
  "Phiếu Phân tích Kiểm nghiệm Hóa sinh Y khoa.xlsx",
  "Quy trình Kiểm soát Chất lượng Sản phẩm ISO-9001.pdf",
  "Hồ sơ Mời thầu Gói thầu Cung cấp Thiết bị Phòng Lab.docx",
  "Sơ đồ Kiến trúc Hệ thống Phần mềm Quản lý Bệnh viện.png",
  "Bảng Tổng hợp Chi phí Vận hành và Đầu tư Q2-2026.xlsx",
  "Tài liệu Đào tạo Nhân sự Kỹ thuật Máy soi An ninh.pptx",
  "Giấy chứng nhận Đăng ký Doanh nghiệp và MST.pdf",
  "Báo cáo Kiểm toán Độc lập và Thuyết minh BCTN.pdf",
  "Bản Vẽ Thiết kế Chi tiết Cụm Máy Phát Tia X.jpg",
  "Hướng dẫn Lắp đặt và Hiệu chỉnh Đầu đo Bức xạ.docx",
  "Hợp đồng Lao động Cán bộ Quản lý Cao cấp.pdf",
  "Danh mục Vật tư Tiêu hao và Phụ tùng Thay thế.xlsx",
  "Thông tư Hướng dẫn Thi hành Luật Dược 2026.pdf",
  "Slide Giới thiệu Giải pháp Chẩn đoán Hình ảnh AI.pptx",
  "Giấy Phép Lưu Hành Sản Phẩm Y Tế Bộ Y Tế.pdf",
  "Báo cáo Khảo sát Thị trường Ngành Thiết bị Y tế.docx",
  "Quy định An toàn Lao động và Phòng chống Bức xạ.pdf",
];

const LANGUAGES = ["Tiếng Việt", "English", "Tiếng Nhật", "Tiếng Hàn", "Tiếng Trung"];

const GENERATED_MOCK_JOBS: Job[] = Array.from({ length: 44 }).map((_, i) => {
  const filename = RAW_FILENAMES[i % RAW_FILENAMES.length];
  const lang = LANGUAGES[i % LANGUAGES.length];
  const isFailed = i === 11 || i === 27;
  const isProcessing = i === 5;
  const daysAgo = Math.floor(i / 4) + 1;
  const createdDate = new Date(Date.now() - daysAgo * 86400000 - i * 3600000).toISOString();

  return {
    id: `mock-job-${(i + 1).toString().padStart(3, "0")}-auto-gen`,
    status: isFailed ? "failed" : isProcessing ? "processing" : "completed",
    source_filename: filename,
    target_lang: lang,
    error: isFailed ? "Tệp tin chứa font chữ không tương thích hoặc bị khóa mã hóa." : null,
    has_docx: filename.endsWith(".docx") || filename.endsWith(".pdf"),
    processing_seconds: 20 + ((i * 11) % 95),
    created_at: createdDate,
    updated_at: createdDate,
  };
});

export const MOCK_JOBS: Job[] = [...FEATURED_MOCK_JOBS, ...GENERATED_MOCK_JOBS];

export const jobsApi = {
  list: async (limit = 50, offset = 0): Promise<Paginated<Job>> => {
    try {
      const res = await apiClient.get<Paginated<Job>>("/history", { params: { limit, offset } });
      if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
        return res.data;
      }
    } catch {
      // Backend not running/unreachable, return fallback mock jobs
    }
    return {
      items: MOCK_JOBS,
      total: MOCK_JOBS.length,
    };
  },

  get: async (id: string): Promise<Job> => {
    try {
      const res = await apiClient.get<Job>(`/history/${id}`);
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    const found = MOCK_JOBS.find((j) => j.id === id);
    return found ?? MOCK_JOBS[0];
  },

  viewInfo: async (id: string, side: "source" | "result"): Promise<ViewInfo> => {
    try {
      const res = await apiClient.get<ViewInfo>(`/history/${id}/view`, { params: { side } });
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    const job = MOCK_JOBS.find((j) => j.id === id) ?? MOCK_JOBS[0];
    return {
      url: "/login_bg.jpg",
      filename: side === "source" ? job.source_filename : `Translated_${job.source_filename}`,
      filetype: job.source_filename.split(".").pop() ?? "pdf",
      document_type: "pdf",
      doc_key: `mock-doc-${id}-${side}`,
    };
  },

  download: async (id: string) => {
    try {
      const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download`, "translated-document");
      triggerDownload(blob, filename);
    } catch {
      const job = MOCK_JOBS.find((j) => j.id === id) ?? MOCK_JOBS[0];
      const blob = new Blob([`Dummy translated content for ${job.source_filename}`], { type: "text/plain" });
      triggerDownload(blob, `Translated_${job.source_filename}`);
    }
  },

  downloadDocx: async (id: string) => {
    try {
      const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download/docx`, "translated-document.docx");
      triggerDownload(blob, filename);
    } catch {
      const job = MOCK_JOBS.find((j) => j.id === id) ?? MOCK_JOBS[0];
      const blob = new Blob([`Dummy docx content for ${job.source_filename}`], { type: "text/plain" });
      triggerDownload(blob, `Translated_${job.source_filename}.docx`);
    }
  },

  downloadLegacy: async (id: string) => {
    try {
      const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download/legacy`, "translated-document");
      triggerDownload(blob, filename);
    } catch {
      const job = MOCK_JOBS.find((j) => j.id === id) ?? MOCK_JOBS[0];
      const blob = new Blob([`Dummy legacy content for ${job.source_filename}`], { type: "text/plain" });
      triggerDownload(blob, `Translated_${job.source_filename}`);
    }
  },

  downloadDocxLegacy: async (id: string) => {
    try {
      const { blob, filename } = await fetchBlobWithFilename(`/history/${id}/download/docx/legacy`, "translated-document.doc");
      triggerDownload(blob, filename);
    } catch {
      const job = MOCK_JOBS.find((j) => j.id === id) ?? MOCK_JOBS[0];
      const blob = new Blob([`Dummy doc content for ${job.source_filename}`], { type: "text/plain" });
      triggerDownload(blob, `Translated_${job.source_filename}.doc`);
    }
  },
};
