import { Alert, Box, Button, Card, CircularProgress, Divider, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PlayArrow } from "@mui/icons-material";

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
  const readyFiles = upload.uploadFiles.filter((f) => f.preflight);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(30, 58, 138, 0.3)"
            : "0 10px 30px rgba(0, 0, 0, 0.08), 0 0 20px rgba(16, 185, 129, 0.1)",
        backgroundColor: "background.paper",
        color: "text.primary",
      }}
    >
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          {/* 1. Upload Document Dropzone */}
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

          {/* 2 & 3. Language & Glossary Selectors */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LanguageSelect value={targetLang} onChange={setTargetLang} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <GlossarySelect
                value={glossaryIds}
                onChange={setGlossaryIds}
                targetLang={targetLang}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>

          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: "4px" }}>
              {errorMsg}
            </Alert>
          )}

          {isSuccess && (
            <Alert severity="success" sx={{ borderRadius: "4px" }}>
              Đã tạo tác vụ dịch thành công! Theo dõi tiến trình bên dưới.
            </Alert>
          )}

          {/* 4. Action Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={totalFiles === 0 || isSubmitting || upload.isAnalyzing || readyFiles.length !== totalFiles}
            onClick={() => submit(readyFiles)}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
            sx={{
              py: 1.6,
              fontFamily: '"Lexend", sans-serif',
              fontSize: "1.05rem",
              fontWeight: 800,
              borderRadius: "4px",
              textTransform: "none",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              boxShadow: totalFiles > 0 && !isSubmitting ? "0 6px 20px rgba(16, 185, 129, 0.4)" : "none",
              transition: "all 0.25s ease",
              "&:hover": {
                backgroundColor: "#059669",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 28px rgba(16, 185, 129, 0.5)",
              },
            }}
          >
            {isSubmitting
              ? "Đang xử lý dịch..."
              : totalFiles > 0
                ? `Dịch ngay (${totalFiles} tài liệu)`
                : "Dịch ngay"
            }
          </Button>
        </Stack>
      </Box>

      {/* Seamless Recent Jobs Pipeline Section */}
      {recentJobs.length > 0 && <Divider sx={{ my: 0 }} />}
      <RecentJobsList jobs={recentJobs} />
    </Card>
  );
}
