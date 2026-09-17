import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Stack,
  Tooltip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { jobsApi } from "@/features/jobs/api/jobsApi";
import { OnlyOfficeViewer } from "@/shared/components/DocViewer/OnlyOfficeViewer";
import { DownloadMenuButton } from "@/features/jobs/components/DownloadMenuButton";
import type { Job, ViewInfo } from "@/features/jobs/types";

const MOCK_SOURCE = [
  { heading: "1. Giới thiệu", body: "Tài liệu này mô tả quy trình cập nhật sản xuất cho dòng sản phẩm Varex trong quý 3 năm 2026. Các thay đổi được thực hiện nhằm tối ưu hóa hiệu suất và giảm thiểu thời gian ngừng máy trong quá trình bảo trì định kỳ. Ban quản lý yêu cầu tất cả các phòng ban liên quan xem xét và xác nhận nội dung trước ngày 30 tháng 9." },
  { heading: "2. Phạm vi áp dụng", body: "Tài liệu áp dụng cho tất cả các đơn vị sản xuất tại khu vực Đông Nam Á, bao gồm Việt Nam, Thái Lan, Indonesia và Malaysia. Các đơn vị ngoài khu vực cần liên hệ với bộ phận kỹ thuật trung tâm để được hướng dẫn riêng. Phiên bản này thay thế hoàn toàn tài liệu phiên bản 2.1 ban hành tháng 6 năm 2026." },
  { heading: "3. Quy trình cập nhật", body: "Bước 1: Tắt nguồn và ngắt kết nối thiết bị khỏi nguồn điện chính. Đảm bảo thiết bị đã được tiếp đất đúng cách trước khi tiến hành bất kỳ thao tác nào. Bước 2: Tháo panel điều khiển phía trước bằng cách tháo 4 vít M4 theo chiều kim đồng hồ. Lưu ý không để lẫn các vít với nhau vì chúng có kích thước khác nhau. Bước 3: Cập nhật firmware bằng cách kết nối cổng USB-C và chạy công cụ Varex Flasher v3.2 hoặc cao hơn." },
  { heading: "4. Kiểm tra sau cập nhật", body: "Sau khi hoàn tất cập nhật, khởi động lại thiết bị và kiểm tra màn hình hiển thị phiên bản firmware mới. Chạy bộ kiểm tra chẩn đoán tích hợp bằng cách giữ nút MODE trong 5 giây. Ghi lại kết quả kiểm tra vào biểu mẫu VPU-CHK-2026 và nộp cho bộ phận QA trong vòng 24 giờ sau khi hoàn thành." },
  { heading: "5. Xử lý sự cố", body: "Nếu thiết bị không khởi động sau khi cập nhật, hãy thực hiện khôi phục cài đặt gốc bằng cách giữ đồng thời nút RESET và POWER trong 10 giây. Nếu sự cố vẫn tiếp diễn, vui lòng liên hệ đường dây hỗ trợ kỹ thuật 24/7 theo số 1800-VAR-TECH. Không cố gắng tự sửa chữa phần cứng nếu chưa được đào tạo chứng nhận." },
  { heading: "6. Lịch bảo trì định kỳ", body: "Thiết bị Varex yêu cầu bảo trì định kỳ 3 tháng một lần. Lịch bảo trì tiếp theo được lên kế hoạch vào ngày 15 tháng 12 năm 2026. Các kỹ thuật viên được chứng nhận sẽ đến tận nơi để thực hiện các quy trình bảo trì theo tiêu chuẩn ISO 9001:2015. Chi phí bảo trì đã được tính vào hợp đồng dịch vụ hàng năm." },
  { heading: "7. Phụ lục", body: "Phụ lục A: Danh sách linh kiện thay thế và mã số đặt hàng. Phụ lục B: Sơ đồ mạch điện và sơ đồ kết nối. Phụ lục C: Lịch sử phiên bản firmware và ghi chú phát hành. Phụ lục D: Danh sách kỹ thuật viên được chứng nhận tại khu vực Đông Nam Á. Tất cả các tài liệu phụ lục có thể được tải xuống từ cổng thông tin nội bộ Varex tại địa chỉ intranet.varex.com/support." },
];

const MOCK_TRANSLATED = [
  { heading: "1. Introduction", body: "This document describes the production update process for the Varex product line in Q3 2026. The changes are implemented to optimize performance and minimize downtime during scheduled maintenance. Management requires all relevant departments to review and confirm the content before September 30." },
  { heading: "2. Scope of Application", body: "This document applies to all production units in the Southeast Asia region, including Vietnam, Thailand, Indonesia, and Malaysia. Units outside the region should contact the central engineering department for separate guidance. This version completely replaces document version 2.1 issued in June 2026." },
  { heading: "3. Update Procedure", body: "Step 1: Power off and disconnect the device from the main power supply. Ensure the device is properly grounded before performing any operations. Step 2: Remove the front control panel by removing 4 M4 screws clockwise. Note: do not mix the screws as they have different sizes. Step 3: Update the firmware by connecting the USB-C port and running the Varex Flasher v3.2 tool or higher." },
  { heading: "4. Post-Update Verification", body: "After completing the update, restart the device and check the display showing the new firmware version. Run the integrated diagnostic test by holding the MODE button for 5 seconds. Record the test results on form VPU-CHK-2026 and submit to the QA department within 24 hours of completion." },
  { heading: "5. Troubleshooting", body: "If the device does not boot after the update, perform a factory reset by simultaneously holding the RESET and POWER buttons for 10 seconds. If the issue persists, please contact the 24/7 technical support hotline at 1800-VAR-TECH. Do not attempt to self-repair hardware without certified training." },
  { heading: "6. Scheduled Maintenance", body: "Varex devices require periodic maintenance every 3 months. The next scheduled maintenance is planned for December 15, 2026. Certified technicians will visit the site to perform maintenance procedures according to ISO 9001:2015 standards. Maintenance costs are included in the annual service contract." },
  { heading: "7. Appendix", body: "Appendix A: List of replacement parts and order numbers. Appendix B: Circuit diagrams and connection diagrams. Appendix C: Firmware version history and release notes. Appendix D: List of certified technicians in Southeast Asia. All appendix documents can be downloaded from the Varex internal portal at intranet.varex.com/support." },
];

export function ComparePage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [sourceView, setSourceView] = useState<ViewInfo | null>(null);
  const [resultView, setResultView] = useState<ViewInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unified master scroll ref
  const masterScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    jobsApi
      .get(jobId)
      .then((data) => {
        setJob(data);
        setError(null);
        return Promise.all([
          jobsApi.viewInfo(jobId, "source"),
          data.status === "completed" ? jobsApi.viewInfo(jobId, "result") : Promise.resolve(null),
        ]);
      })
      .then(([src, res]) => {
        setSourceView(src);
        setResultView(res);
      })
      .catch((err) => {
        console.error("Failed to load job details", err);
        setError("Không thể tải thông tin tác vụ dịch thuật.");
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "65vh" }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress sx={{ color: "#10B981" }} size={42} />
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Lexend", sans-serif' }}>
            Đang tải dữ liệu so sánh tài liệu...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 500,
            mx: "auto",
            p: 4,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" color="error" sx={{ mb: 2, fontFamily: '"Lexend", sans-serif' }}>
            {error || "Không tìm thấy thông tin tác vụ."}
          </Typography>
          <Button
            component={RouterLink}
            to="/history"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              bgcolor: "#10B981",
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            Quay lại Lịch sử
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        gap: 2.5,
        px: { xs: 1, sm: 2 },
        py: 1,
      }}
    >
      {/* Header & Control Bar - Theme-Aware */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(15, 23, 42, 0.95)" : "#FFFFFF",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 10px 30px rgba(0, 0, 0, 0.4)"
              : "0 4px 20px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Tooltip title="Quay lại danh sách" arrow>
            <IconButton
              onClick={() => navigate("/history")}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 150ms ease",
                bgcolor: "background.paper",
                "&:hover": {
                  borderColor: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "#10B981",
                },
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontFamily: '"Lexend", sans-serif',
                color: "text.primary",
                fontSize: { xs: "1.05rem", sm: "1.25rem" },
                lineHeight: 1.2,
              }}
            >
              {job.source_filename}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          {/* Download Action */}
          {job.status === "completed" && (
            <DownloadMenuButton
              job={job}
              label="Tải bản dịch"
              size="medium"
              sx={{
                py: 1,
                px: 2.5,
                borderRadius: "8px",
                fontFamily: '"Lexend", sans-serif',
                fontWeight: 700,
                fontSize: "0.88rem",
                textTransform: "none",
                backgroundColor: "#10B981",
                color: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                "&:hover": {
                  backgroundColor: "#059669",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.45)",
                },
              }}
            />
          )}
        </Stack>
      </Paper>

      {/* Main Parallel Viewer Track with Unified Master Scroll */}
      <Box
        ref={masterScrollRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          pr: 0.5,
          borderRadius: "12px",
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2.5,
            alignItems: "stretch",
            minHeight: "100%",
          }}
        >
          {/* Left Side: Original Source Document */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                  : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                px: 2.5,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "#0F172A" : "#F8FAFC"),
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                height: "44px",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  fontFamily: '"Lexend", sans-serif',
                  letterSpacing: "0.5px",
                  fontSize: "0.9rem",
                }}
              >
                TÀI LIỆU GỐC
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, position: "relative" }}>
              {sourceView ? (
                <OnlyOfficeViewer viewInfo={sourceView} editorId="oo-source" />
              ) : (
                <Box sx={{ p: 3 }}>
                  {MOCK_SOURCE.map((section, i) => (
                    <Box key={i} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.8, fontFamily: '"Lexend", sans-serif', color: "text.primary" }}>
                        {section.heading}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.9 }}>
                        {section.body}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>

          {/* Right Side: Translated Result Document */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                  : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                px: 2.5,
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "#0F172A" : "#F8FAFC"),
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                height: "44px",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: (theme) => (theme.palette.mode === "dark" ? "#34D399" : "#059669"),
                  fontFamily: '"Lexend", sans-serif',
                  letterSpacing: "0.5px",
                  fontSize: "0.9rem",
                }}
              >
                BẢN DỊCH
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, position: "relative" }}>
              {resultView ? (
                <OnlyOfficeViewer viewInfo={resultView} editorId="oo-result" />
              ) : (
                <Box sx={{ p: 3 }}>
                  {MOCK_TRANSLATED.map((section, i) => (
                    <Box key={i} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.8, fontFamily: '"Lexend", sans-serif', color: "text.primary" }}>
                        {section.heading}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.9 }}>
                        {section.body}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
