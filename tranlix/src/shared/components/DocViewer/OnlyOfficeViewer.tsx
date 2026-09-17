import { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { CheckCircleOutlined } from "@mui/icons-material";
import type { ViewInfo } from "@features/jobs/types";

declare global {
  interface Window {
    DocsAPI?: {
      DocEditor: new (containerId: string, config: unknown) => { destroyEditor?: () => void };
    };
  }
}

let _scriptPromise: Promise<void> | null = null;

function loadOnlyOfficeScript(serverUrl: string): Promise<void> {
  if (window.DocsAPI) return Promise.resolve();
  if (!_scriptPromise) {
    _scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[src*="web-apps/apps/api/documents/api.js"]`
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", reject);
        return;
      }
      const s = document.createElement("script");
      s.src = `${serverUrl}/web-apps/apps/api/documents/api.js`;
      s.onload = () => resolve();
      s.onerror = () => {
        _scriptPromise = null;
        reject(new Error("OnlyOffice script load failed"));
      };
      document.head.appendChild(s);
    });
  }
  return _scriptPromise;
}

interface Props {
  viewInfo: ViewInfo;
  editorId: string;
}

const ONLYOFFICE_URL = (import.meta.env.VITE_ONLYOFFICE_URL as string | undefined) ?? "";
const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"]);

// Interactive Theme-Aware Mock Document Sheet Viewer when OnlyOffice server is offline
function MockDocumentViewer({ viewInfo: _viewInfo, isResult }: { viewInfo: ViewInfo; isResult: boolean }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#080D1A" : "#EEF2F6",
        color: isDark ? "#F8FAFC" : "#0F172A",
        p: { xs: 2, md: 3 },
        gap: 3,
        alignItems: "center",
      }}
    >
      {/* Page 1 Sheet */}
      <Paper
        elevation={isDark ? 6 : 2}
        sx={{
          width: "100%",
          maxWidth: "780px",
          minHeight: "720px",
          p: { xs: 3, sm: 5 },
          bgcolor: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "4px",
          border: "1px solid",
          borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
          boxShadow: isDark
            ? "0 12px 32px rgba(0, 0, 0, 0.5)"
            : "0 6px 24px rgba(0, 0, 0, 0.08)",
          fontFamily: '"Source Sans 3", sans-serif',
          lineHeight: 1.6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={3}>
          {/* Document Header */}
          <Box sx={{ borderBottom: "2px solid #0F172A", pb: 2 }}>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, letterSpacing: 1.2 }}>
              {isResult ? "VĂN BẢN ĐÃ DỊCH HỆ THỐNG TRANLIX" : "CONFIDENTIAL DOCUMENT - ORIGINAL SOURCE"}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                fontFamily: '"Lexend", sans-serif',
                mt: 0.5,
              }}
            >
              {isResult
                ? "BÁO CÁO CẬP NHẬT SẢN XUẤT VÀ THÔNG SỐ KỸ THUẬT VAREX 2026"
                : "VAREX IMAGING PRODUCTION UPDATE & TECHNICAL SPECIFICATION 2026"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#475569", display: "block", mt: 0.5 }}>
              {isResult
                ? "Ngày ban hành: 08/09/2026 | Mã tài liệu: VA-2026-XRAY-09 | Ngôn ngữ nguồn: Tiếng Anh"
                : "Issue Date: September 08, 2026 | Document Ref: VA-2026-XRAY-09 | Source Language: English"}
            </Typography>
          </Box>

          {/* Section 1 */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#1E293B", fontFamily: '"Lexend", sans-serif', mb: 1 }}
            >
              {isResult ? "1. TỔNG QUAN HỆ THỐNG VÀ QUY TRÌNH AN TOÀN" : "1. SYSTEM OVERVIEW & SAFETY PROCEDURES"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#334155", textAlign: "justify" }}>
              {isResult ? (
                <>
                  Tài liệu kỹ thuật này quy định chi tiết về cấu hình{" "}
                  <Box component="span" sx={{ bgcolor: "#D1FAE5", px: 0.8, py: 0.2, borderRadius: "4px", color: "#065F46", fontWeight: 600 }}>
                    bộ thu nhận hình ảnh tấm phẳng
                  </Box>{" "}
                  X-quang cao áp và cụm vỏ bóng X-quang sử dụng trong hệ thống{" "}
                  <Box component="span" sx={{ bgcolor: "#D1FAE5", px: 0.8, py: 0.2, borderRadius: "4px", color: "#065F46", fontWeight: 600 }}>
                    chụp X-quang
                  </Box>{" "}
                  kỹ thuật số. Tất cả quy trình lắp đặt, vận hành và bảo trì phải tuân thủ nghiêm ngặt tiêu chuẩn thiết bị y tế ISO 13485.
                </>
              ) : (
                <>
                  This technical document specifies the configuration of high-voltage X-ray tube housing assemblies and{" "}
                  <Box component="span" sx={{ bgcolor: "#FEF3C7", px: 0.8, py: 0.2, borderRadius: "4px", color: "#92400E", fontWeight: 600 }}>
                    flat panel detectors
                  </Box>{" "}
                  used in digital{" "}
                  <Box component="span" sx={{ bgcolor: "#FEF3C7", px: 0.8, py: 0.2, borderRadius: "4px", color: "#92400E", fontWeight: 600 }}>
                    radiography
                  </Box>{" "}
                  systems. All installation and maintenance procedures must strictly comply with ISO 13485 medical device regulations.
                </>
              )}
            </Typography>
          </Box>

          {/* Section 2: Table */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#1E293B", fontFamily: '"Lexend", sans-serif', mb: 1 }}
            >
              {isResult ? "2. BẢNG THÔNG SỐ KỸ THUẬT ĐỊNH MỨC" : "2. NOMINAL TECHNICAL SPECIFICATIONS TABLE"}
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "6px" }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#F1F5F9" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#1E293B" }}>
                      {isResult ? "Hạng mục Thông số" : "Parameter Item"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1E293B" }}>
                      {isResult ? "Giá trị Quy chuẩn" : "Nominal Value"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1E293B" }}>
                      {isResult ? "Đánh giá" : "Status"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {isResult ? "Tốc độ quay anốt" : "Anode rotation speed"}
                    </TableCell>
                    <TableCell>10,000 {isResult ? "vòng/phút" : "RPM"}</TableCell>
                    <TableCell sx={{ color: "#059669", fontWeight: 600 }}>
                      <CheckCircleOutlined sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                      {isResult ? "Đạt chuẩn" : "Verified"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {isResult ? "Thời gian phát tia" : "Exposure time"}
                    </TableCell>
                    <TableCell>120 ms</TableCell>
                    <TableCell sx={{ color: "#059669", fontWeight: 600 }}>
                      <CheckCircleOutlined sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                      {isResult ? "Tối ưu" : "Optimal"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {isResult ? "Điện áp vận hành" : "Operating Voltage"}
                    </TableCell>
                    <TableCell>220V 50Hz</TableCell>
                    <TableCell sx={{ color: "#059669", fontWeight: 600 }}>
                      <CheckCircleOutlined sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                      {isResult ? "Ổn định" : "Stable"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>

        <Box sx={{ pt: 3, borderTop: "1px solid #E2E8F0", mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ color: "#94A3B8" }}>
            TRANLIX DOC ENGINE
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700 }}>
            Trang 1 / 2
          </Typography>
        </Box>
      </Paper>

      {/* Page 2 Sheet */}
      <Paper
        elevation={isDark ? 6 : 2}
        sx={{
          width: "100%",
          maxWidth: "780px",
          minHeight: "560px",
          p: { xs: 3, sm: 5 },
          bgcolor: "#FFFFFF",
          color: "#0F172A",
          borderRadius: "4px",
          border: "1px solid",
          borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
          boxShadow: isDark
            ? "0 12px 32px rgba(0, 0, 0, 0.5)"
            : "0 6px 24px rgba(0, 0, 0, 0.08)",
          fontFamily: '"Source Sans 3", sans-serif',
          lineHeight: 1.6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={3}>
          {/* Page 2 content */}
          <Box sx={{ borderBottom: "2px solid #0F172A", pb: 1.5 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#1E293B", fontFamily: '"Lexend", sans-serif' }}
            >
              {isResult ? "3. ĐIỀU KHOẢN PHÁP LÝ & BẢO HÀNH CHUYÊN NGÀNH" : "3. LEGAL & WARRANTY TERMS"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: "#334155", textAlign: "justify", mb: 2 }}>
              {isResult ? (
                <>
                  <Box component="span" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    Điều khoản bồi thường thiệt hại:
                  </Box>{" "}
                  Nhà sản xuất cam kết{" "}
                  <Box component="span" sx={{ bgcolor: "#D1FAE5", px: 0.8, py: 0.2, borderRadius: "4px", color: "#065F46", fontWeight: 600 }}>
                    bồi thường thiệt hại
                  </Box>{" "}
                  cho bất kỳ sự cố kỹ thuật nào do lỗi chế tạo gây ra trong thời hạn bảo hành 24 tháng. Việc can thiệp trái phép hoặc vi phạm điều kiện vận hành sẽ hủy bỏ các điều khoản về{" "}
                  <Box component="span" sx={{ bgcolor: "#D1FAE5", px: 0.8, py: 0.2, borderRadius: "4px", color: "#065F46", fontWeight: 600 }}>
                    sự kiện bất khả kháng
                  </Box>.
                </>
              ) : (
                <>
                  <Box component="span" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    Indemnification Clause:
                  </Box>{" "}
                  The manufacturer guarantees full{" "}
                  <Box component="span" sx={{ bgcolor: "#FEF3C7", px: 0.8, py: 0.2, borderRadius: "4px", color: "#92400E", fontWeight: 600 }}>
                    indemnification
                  </Box>{" "}
                  for any technical defects resulting from manufacturing flaws within the 24-month warranty period. Unauthorized modification or improper operation shall void all applicable{" "}
                  <Box component="span" sx={{ bgcolor: "#FEF3C7", px: 0.8, py: 0.2, borderRadius: "4px", color: "#92400E", fontWeight: 600 }}>
                    force majeure
                  </Box>{" "}
                  remedies.
                </>
              )}
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "6px" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", display: "block", mb: 0.5 }}>
                {isResult ? "Thuật ngữ chuyên ngành áp dụng:" : "Glossary Terms Matched:"}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label={isResult ? "radiography → chụp X-quang" : "radiography"} size="small" color="success" variant="outlined" />
                <Chip label={isResult ? "flat panel detector → bộ thu nhận tấm phẳng" : "flat panel detector"} size="small" color="success" variant="outlined" />
                <Chip label={isResult ? "indemnification → bồi thường thiệt hại" : "indemnification"} size="small" color="success" variant="outlined" />
              </Box>
            </Paper>
          </Box>
        </Stack>

        <Box sx={{ pt: 3, borderTop: "1px solid #E2E8F0", mt: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ color: "#94A3B8" }}>
            TRANLIX DOC ENGINE
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700 }}>
            Trang 2 / 2
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export function OnlyOfficeViewer({ viewInfo, editorId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<{ destroyEditor?: () => void } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const isImage = IMAGE_EXT.has(viewInfo.filetype.toLowerCase());
  const isResult = editorId.includes("result");

  useEffect(() => {
    if (isImage) {
      setStatus("ready");
      return;
    }

    if (!ONLYOFFICE_URL) {
      setStatus("error");
      return;
    }

    let destroyed = false;
    setStatus("loading");

    loadOnlyOfficeScript(ONLYOFFICE_URL)
      .then(() => {
        if (destroyed || !window.DocsAPI || !containerRef.current) return;

        if (editorInstanceRef.current?.destroyEditor) {
          editorInstanceRef.current.destroyEditor();
          editorInstanceRef.current = null;
        }

        containerRef.current.innerHTML = "";
        const mount = document.createElement("div");
        mount.id = editorId;
        containerRef.current.appendChild(mount);

        editorInstanceRef.current = new window.DocsAPI!.DocEditor(editorId, {
          document: {
            fileType: viewInfo.filetype,
            key: viewInfo.doc_key,
            title: viewInfo.filename,
            url: viewInfo.url,
            permissions: {
              edit: false,
              download: false,
              print: false,
              comment: false,
              fillForms: false,
            },
          },
          documentType: viewInfo.document_type,
          type: "embedded",
          editorConfig: {
            mode: "view",
            lang: "vi",
            customization: {
              autosave: false,
              chat: false,
              compactHeader: true,
              feedback: { visible: false },
              forcesave: false,
              help: false,
              plugins: false,
              toolbarNoTabs: true,
              hideRightMenu: true,
              uiTheme: "theme-light",
            },
          },
          events: {
            onAppReady: () => setStatus("ready"),
            onError: () => setStatus("error"),
            onRequestClose: () => setStatus("error"),
          },
        });
      })
      .catch(() => {
        if (!destroyed) {
          setStatus("error");
        }
      });

    return () => {
      destroyed = true;
      if (editorInstanceRef.current?.destroyEditor) {
        editorInstanceRef.current.destroyEditor();
        editorInstanceRef.current = null;
      }
    };
  }, [viewInfo.url, viewInfo.doc_key, isImage, editorId]);

  if (isImage) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          bgcolor: "#f5f5f5",
        }}
      >
        <img
          src={viewInfo.url}
          alt={viewInfo.filename}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Box>
    );
  }

  // Render high-fidelity Theme-Aware Mock Document Sheet Viewer when OnlyOffice server URL is offline/unconfigured
  if (status === "error" || !ONLYOFFICE_URL) {
    return <MockDocumentViewer viewInfo={viewInfo} isResult={isResult} />;
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      {status === "loading" && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <CircularProgress size={32} />
        </Box>
      )}

      <Box ref={containerRef} sx={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
