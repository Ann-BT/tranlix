import { Alert, Box, Button, Card, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { jobKeys } from "@features/jobs/hooks/useJobs";
import { GlossarySelect } from "@features/glossary";

import { LanguageSelect } from "./LanguageSelect";
import { DocumentDropzone } from "./DocumentDropzone";
import { UploadFileList } from "./UploadFileList";
import { RecentJobsList } from "./RecentJobsList";
import { useUploadFiles } from "../hooks/useUploadFiles";
import { useRecentJobs } from "../hooks/useRecentJobs";
import { useSubmitTranslation } from "../hooks/useSubmitTranslation";

const MAX_TASKS = 3;

export function TranslationForm() {
  const [targetLang, setTargetLang] = useState("English");
  const [glossaryIds, setGlossaryIds] = useState<string[]>([]);

  const upload = useUploadFiles(MAX_TASKS);
  const { recentJobs, addJobs } = useRecentJobs();
  const queryClient = useQueryClient();

  const { submit, isSubmitting, errorMsg, isSuccess } = useSubmitTranslation({
    targetLang,
    glossaryIds,
    onSuccess: (jobs) => {
      addJobs(jobs);
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      upload.clear();
      setGlossaryIds([]);
    },
  });

  const canAddMore = upload.canAddMore && !isSubmitting;
  const totalFiles = upload.uploadFiles.length;
  const readyFiles = upload.uploadFiles.filter(f => f.preflight);

  return (
    <Card
      elevation={0}
      sx={{
        p: 0,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider", bgcolor: "neutral.50" }}>
        <Typography variant="h6" sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 700, fontSize: "1.15rem", color: "text.primary" }}>
          Tải tài liệu dịch thuật
        </Typography>
      </Box>

      <Grid container>
        {/* Left Column: File Upload & List (60%) */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ p: 3, borderRight: { md: "1px solid" }, borderColor: { md: "divider" } }}>
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", fontFamily: '"Lexend", sans-serif' }}>
              1. Chọn tài liệu cần dịch
            </Typography>

            <DocumentDropzone
              maxTasks={MAX_TASKS}
              totalFiles={totalFiles}
              isDragging={upload.isDragging}
              isAnalyzing={upload.isAnalyzing}
              isSubmitting={isSubmitting}
              canAddMore={canAddMore}
              onDragOver={(e) => {
                e.preventDefault();
                if (canAddMore) upload.setIsDragging(true);
              }}
              onDragLeave={() => upload.setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                upload.setIsDragging(false);
                if (!canAddMore) return;
                upload.addFiles(Array.from(e.dataTransfer.files));
              }}
              onFilesSelected={(files) => upload.addFiles(Array.from(files))}
            />

            <UploadFileList
              files={upload.uploadFiles}
              onRemove={upload.removeFile}
              onTopicsChange={upload.setFileTopics}
              onForceOcrChange={upload.setFileForceOcr}
              disabled={isSubmitting}
            />
          </Stack>
        </Grid>

        {/* Right Column: Settings & Submit (40%) */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ p: 3, display: "flex", flexDirection: "column", bgcolor: "rgba(0, 148, 157, 0.01)" }}>
          <Stack spacing={3} sx={{ height: "100%", justifyContent: "space-between" }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", fontFamily: '"Lexend", sans-serif' }}>
                2. Thiết lập dịch thuật
              </Typography>

              <Box>
                <LanguageSelect value={targetLang} onChange={setTargetLang} />
              </Box>

              <Box>
                <GlossarySelect
                  value={glossaryIds}
                  onChange={setGlossaryIds}
                  targetLang={targetLang}
                  disabled={isSubmitting}
                />
              </Box>

              {errorMsg && (
                <Alert severity="error" sx={{ borderRadius: "8px" }}>
                  {errorMsg}
                </Alert>
              )}

              {isSuccess && (
                <Alert severity="success" sx={{ borderRadius: "8px" }}>
                  Đã tạo tác vụ dịch thành công! Theo dõi tiến trình bên dưới.
                </Alert>
              )}
            </Stack>

            <Button
              variant="contained"
              size="large"
              color="primary"
              disabled={totalFiles === 0 || isSubmitting || upload.isAnalyzing || readyFiles.length !== totalFiles}
              onClick={() => submit(readyFiles)}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
              sx={{
                py: 1.5,
                fontFamily: '"Lexend", sans-serif',
                fontSize: "0.95rem",
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "none",
                boxShadow: totalFiles > 0 && !isSubmitting ? "0 4px 14px rgba(0, 148, 157, 0.25)" : "none",
                mt: { xs: 2, md: 4 },
              }}
            >
              {isSubmitting
                ? "Đang tải lên..."
                : totalFiles > 0
                  ? `Bắt đầu dịch (${totalFiles} tài liệu)`
                  : "Bắt đầu dịch"
              }
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {recentJobs.length > 0 && <Divider sx={{ my: 0 }} />}
      <RecentJobsList jobs={recentJobs} />
    </Card>
  );
}
