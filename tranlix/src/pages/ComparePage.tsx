import { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Paper, Button, IconButton, CircularProgress, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { jobsApi } from "@/features/jobs/api/jobsApi";
import { colorTokens } from "@/shared/styles/tokens";
import { OnlyOfficeViewer } from "@/shared/components/DocViewer/OnlyOfficeViewer";
import { DownloadMenuButton } from "@/features/jobs/components/DownloadMenuButton";
import type { Job, ViewInfo } from "@/features/jobs/types";

export function ComparePage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [sourceView, setSourceView] = useState<ViewInfo | null>(null);
  const [resultView, setResultView] = useState<ViewInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: colorTokens.wine500 }} />
      </Box>
    );
  }

  if (error || !job) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error" sx={{ mb: 3 }}>
          {error || "Không tìm thấy thông tin tác vụ."}
        </Typography>
        <Button
          component={RouterLink}
          to="/history"
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
        >
          Quay lại Lịch sử
        </Button>
      </Box>
    );
  }

  const ViewPanel = ({
    label,
    viewInfo,
    editorId,
  }: {
    label: string;
    viewInfo: ViewInfo | null;
    editorId: string;
  }) => (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        border: `1px solid ${colorTokens.neutral200}`,
        overflow: "hidden",
        backgroundColor: colorTokens.white,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          bgcolor: colorTokens.neutral50,
          borderBottom: `1px solid ${colorTokens.neutral200}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "48px",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: colorTokens.neutral800, fontFamily: '"Lexend", sans-serif' }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, position: "relative", minHeight: { xs: "350px", md: "unset" } }}>
        {viewInfo ? (
          <OnlyOfficeViewer viewInfo={viewInfo} editorId={editorId} />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography variant="body2" color="text.secondary">
              {job.status === "processing" ? "Đang xử lý..." : "Chưa có bản dịch."}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", gap: 3 }}>
      {/* Header */}
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
          border: `1px solid ${colorTokens.neutral200}`,
          backgroundColor: colorTokens.white,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/history")}
            sx={{
              border: `1px solid ${colorTokens.neutral200}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 150ms ease",
              "&:hover": { borderColor: colorTokens.wine500, backgroundColor: colorTokens.wine50 },
            }}
          >
            <ArrowBack sx={{ fontSize: 20, color: colorTokens.neutral700 }} />
          </IconButton>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontFamily: '"Lexend", sans-serif',
                color: colorTokens.neutral800,
                fontSize: "1.15rem",
                lineHeight: 1.2,
              }}
            >
              So sánh tài liệu
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: colorTokens.neutral500, fontFamily: '"Source Sans 3", sans-serif' }}
            >
              {job.source_filename}
            </Typography>
          </Box>
        </Stack>

        {job.status === "completed" && (
          <DownloadMenuButton
            job={job}
            label="Tải bản dịch"
            size="medium"
            sx={{
              py: 1.2, px: 3, borderRadius: "10px",
              fontFamily: '"Lexend", sans-serif', fontWeight: 600, fontSize: "0.9rem",
              textTransform: "none", backgroundColor: colorTokens.wine500,
              color: colorTokens.white,
              border: "none",
              boxShadow: `0 4px 14px rgba(0, 148, 157, 0.25)`,
              transition: "all 150ms ease",
              "&:hover": {
                backgroundColor: colorTokens.wine600,
                transform: "translateY(-1px)",
                boxShadow: `0 6px 20px rgba(0, 148, 157, 0.35)`,
              },
              "&:active": { transform: "translateY(0px)", boxShadow: `0 2px 8px rgba(0, 148, 157, 0.2)` },
            }}
          />
        )}
      </Paper>

      {/* Viewer panels */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          flex: 1,
          minHeight: 0,
        }}
      >
        <ViewPanel label="TÀI LIỆU GỐC" viewInfo={sourceView} editorId="oo-source" />
        <ViewPanel label="BẢN DỊCH" viewInfo={resultView} editorId="oo-result" />
      </Box>
    </Box>
  );
}
