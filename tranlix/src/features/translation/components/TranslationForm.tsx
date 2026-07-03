import {
  Alert, Button, Card, IconButton, Stack, Typography, Box, Chip, CircularProgress, Grid, Divider
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  CloudUpload, Close, Article, TableChart, Slideshow, InsertDriveFile
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { jobKeys } from "@features/jobs/hooks/useJobs";
import { translationApi } from "../api/translationApi";
import { LanguageSelect } from "./LanguageSelect";
import { GlossarySelect } from "@features/glossary";
import { jobsApi } from "@features/jobs";
import type { JobStatus } from "@features/jobs";

const MAX_TASKS = 3;

interface UploadFile {
  file: File;
  id: string;
}

interface RecentJob {
  id: string;
  status: JobStatus;
  progress: number;
  source_filename: string;
  target_lang: string;
  created_at: string;
  updated_at: string;
  originalFile: File;
  inline_mode: boolean;
  glossaryId?: string;
}

const TARGET_LANGUAGES = [
  { code: "English", label: "Tiếng Anh" },
  { code: "Vietnamese", label: "Tiếng Việt" },
  { code: "Chinese", label: "Tiếng Trung" },
  { code: "Japanese", label: "Tiếng Nhật" },
  { code: "Korean", label: "Tiếng Hàn" },
];

const formatLanguage = (langCode: string) => {
  return TARGET_LANGUAGES.find((l) => l.code === langCode)?.label ?? langCode;
};

const getDurationText = (job: RecentJob) => {
  const start = new Date(job.created_at).getTime();
  const end = new Date(job.updated_at).getTime();
  const diffMs = end - start;
  if (isNaN(diffMs) || diffMs < 0) return "---";

  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return `${diffSecs} giây`;

  const diffMins = Math.floor(diffSecs / 60);
  const remSecs = diffSecs % 60;
  return `${diffMins} phút ${remSecs} giây`;
};

function getFileIconAndColor(filename: string) {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  if (ext === ".docx" || ext === ".doc") {
    return { icon: <Article sx={{ fontSize: 24 }} />, color: "#1B6EF3" }; // Word Blue
  }
  if (ext === ".xlsx" || ext === ".xls") {
    return { icon: <TableChart sx={{ fontSize: 24 }} />, color: "#107C41" }; // Excel Green
  }
  if (ext === ".pptx" || ext === ".ppt") {
    return { icon: <Slideshow sx={{ fontSize: 24 }} />, color: "#C43E1C" }; // PowerPoint Orange
  }
  if (ext === ".pdf") {
    return { icon: <Article sx={{ fontSize: 24 }} />, color: "#E01B22" }; // PDF Red
  }
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
    return { icon: <InsertDriveFile sx={{ fontSize: 24 }} />, color: "#8B5CF6" }; // Image Purple
  }
  return { icon: <InsertDriveFile sx={{ fontSize: 24 }} />, color: "#64748B" }; // Default Grey
}

export function TranslationForm() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [targetLang, setTargetLang] = useState("English");
  const [glossaryIds, setGlossaryIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Poll active recent jobs
  useEffect(() => {
    const activeJobs = recentJobs.filter(j => j.status === "pending" || j.status === "processing");
    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updatedJobs = await Promise.all(
          recentJobs.map(async (rj) => {
            if (rj.status === "pending" || rj.status === "processing") {
              const freshJob = await jobsApi.get(rj.id);
              return {
                ...rj,
                status: freshJob.status,
                progress: freshJob.progress,
                created_at: freshJob.created_at,
                updated_at: freshJob.updated_at,
              };
            }
            return rj;
          })
        );

        const hasChange = updatedJobs.some((uj, idx) => uj.status !== recentJobs[idx].status || uj.progress !== recentJobs[idx].progress);
        if (hasChange) {
          setRecentJobs(updatedJobs);
          queryClient.invalidateQueries({ queryKey: jobKeys.all });
        }
      } catch (err) {
        console.error("Error polling job statuses", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [recentJobs, queryClient]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remainingSlots = MAX_TASKS - uploadFiles.length;
      const newFiles: UploadFile[] = [];

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        newFiles.push({
          file: files[i],
          id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        });
      }

      setUploadFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isSubmitting && uploadFiles.length < MAX_TASKS) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isSubmitting || uploadFiles.length >= MAX_TASKS) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const remainingSlots = MAX_TASKS - uploadFiles.length;
      const newFiles: UploadFile[] = [];

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        newFiles.push({
          file: files[i],
          id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        });
      }

      setUploadFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };



  const canAddMore = uploadFiles.length < MAX_TASKS;
  const totalFiles = uploadFiles.length;

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
          Tạo tác vụ dịch mới
        </Typography>
      </Box>

      <Grid container>
        {/* Left Column: File Upload & List (60%) */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ p: 3, borderRight: { md: "1px solid" }, borderColor: { md: "divider" } }}>
          <Stack spacing={2.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", fontFamily: '"Lexend", sans-serif' }}>
              1. Chọn tài liệu cần dịch
            </Typography>

            {/* Drag & Drop Zone */}
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                borderRadius: "12px",
                border: "2px dashed",
                borderColor: isDragging ? "primary.main" : !canAddMore ? "action.disabled" : "divider",
                bgcolor: isDragging ? "rgba(0, 148, 157, 0.04)" : !canAddMore ? "action.hover" : "background.default",
                cursor: !canAddMore || isSubmitting ? "default" : "pointer",
                transition: "all 200ms ease",
                "&:hover": {
                  borderColor: !canAddMore || isSubmitting ? "divider" : "primary.main",
                  bgcolor: !canAddMore || isSubmitting ? "action.hover" : "rgba(0, 148, 157, 0.02)",
                },
              }}
              component="label"
            >
              <input
                type="file"
                hidden
                accept=".docx,.pptx,.xlsx,.doc,.ppt,.xls,.pdf,.png,.jpg,.jpeg"
                multiple
                disabled={isSubmitting || !canAddMore}
                onChange={handleFileUpload}
              />
              <CloudUpload
                sx={{
                  fontSize: 40,
                  color: isDragging ? "primary.main" : "text.secondary",
                  mb: 1.5,
                  transition: "color 150ms"
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "text.primary", fontFamily: '"Lexend", sans-serif' }}>
                Kéo thả file vào đây hoặc click để chọn tệp
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center" }}>
                Hỗ trợ: Word, Excel, PowerPoint, PDF, Ảnh
              </Typography>
            </Box>

            {/* File Counter Indicator */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, my: 0.5 }}>
              {Array.from({ length: MAX_TASKS }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 36,
                    height: 5,
                    borderRadius: 2,
                    backgroundColor: index < totalFiles ? "primary.main" : "divider",
                    transition: "background-color 0.3s",
                  }}
                />
              ))}
            </Box>

            {/* Uploaded Files List */}
            {totalFiles > 0 && (
              <Stack spacing={1.5}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Tài liệu đã chọn ({totalFiles})
                </Typography>
                {uploadFiles.map((item) => {
                  const { icon, color } = getFileIconAndColor(item.file.name);
                  return (
                    <Card
                      key={item.id}
                      elevation={0}
                      sx={{
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor: "background.default",
                        boxShadow: "none",
                        p: 0,
                        "&:hover": {
                          transform: "none",
                          boxShadow: "none",
                        }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}>
                        <Box sx={{ color, display: "flex", alignItems: "center" }}>
                          {icon}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontFamily: '"Source Sans 3", sans-serif',
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {item.file.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                        <Chip
                          label="Sẵn sàng"
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ borderRadius: "4px", height: "20px", fontSize: "0.7rem", fontWeight: 700 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeFile(item.id)}
                          disabled={isSubmitting}
                          sx={{
                            color: "text.secondary",
                            "&:hover": { color: "error.main", bgcolor: "rgba(220, 38, 38, 0.04)" }
                          }}
                        >
                          <Close sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Stack>
        </Grid>

        {/* Right Column: Settings & Submit (40%) */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ p: 3, display: "flex", flexDirection: "column", bgcolor: "rgba(0, 148, 157, 0.01)" }}>
          <Stack spacing={3} sx={{ height: "100%", justifyContent: "space-between" }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", fontFamily: '"Lexend", sans-serif' }}>
                2. Thiết lập dịch thuật
              </Typography>

              {/* Language Select */}
              <Box>
                <LanguageSelect value={targetLang} onChange={setTargetLang} />
              </Box>

              {/* Glossary Select */}
              <Box>
                <GlossarySelect
                  value={glossaryIds}
                  onChange={setGlossaryIds}
                  targetLang={targetLang}
                  disabled={isSubmitting}
                />
              </Box>

              {/* Error/Success Alerts */}
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

            {/* Submit Button */}
            <Button
              variant="contained"
              size="large"
              color="primary"
              disabled={totalFiles === 0 || isSubmitting}
              onClick={async () => {
                if (uploadFiles.length === 0) return;
                setIsSubmitting(true);
                setErrorMsg("");
                setIsSuccess(false);

                const glossariesToUse = glossaryIds.length > 0 ? glossaryIds : [undefined];
                const jobsToSubmit: { file: File; glossaryId?: string }[] = [];

                for (const item of uploadFiles) {
                  for (const gId of glossariesToUse) {
                    jobsToSubmit.push({
                      file: item.file,
                      glossaryId: gId,
                    });
                  }
                }

                try {
                  const createdJobs = await Promise.all(
                    jobsToSubmit.map(async (task) => {
                      const job = await translationApi.create({
                        file: task.file,
                        targetLang,
                        inlineMode: false,
                        glossaryId: task.glossaryId,
                      });
                      return {
                        id: job.id,
                        status: job.status,
                        progress: job.progress,
                        source_filename: job.source_filename,
                        target_lang: job.target_lang,
                        created_at: job.created_at,
                        updated_at: job.updated_at,
                        originalFile: task.file,
                        inline_mode: false,
                        glossaryId: task.glossaryId,
                      };
                    })
                  );

                  queryClient.invalidateQueries({ queryKey: jobKeys.all });
                  setIsSuccess(true);
                  setRecentJobs(prev => [...createdJobs, ...prev]);
                  setUploadFiles([]);
                  setGlossaryIds([]);
                  setTimeout(() => setIsSuccess(false), 4000);
                } catch (e: any) {
                  setErrorMsg(e?.message || "Có lỗi xảy ra khi tải lên và dịch tài liệu.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
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

      {/* Divider between upload and recent jobs status */}
      {recentJobs.length > 0 && <Divider sx={{ my: 0 }} />}

      {/* Recent Jobs Section */}
      {recentJobs.length > 0 && (
        <Box sx={{ p: 3, bgcolor: "background.paper" }}>

          <Stack spacing={2}>
            {recentJobs.map((rj) => {
              const { icon, color } = getFileIconAndColor(rj.source_filename);
              return (
                <Card
                  key={rj.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: rj.status === "completed" ? "success.light" : rj.status === "failed" ? "error.light" : "divider",
                    bgcolor: rj.status === "completed" ? "rgba(46, 125, 50, 0.01)" : rj.status === "failed" ? "rgba(211, 47, 47, 0.01)" : "background.default",
                    boxShadow: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "none",
                      boxShadow: "none",
                    }
                  }}
                >
                  <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    {/* File Icon & Info */}
                    <Grid size={{ xs: 12, sm: 5 }} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{ color, display: "flex", alignItems: "center" }}>
                        {icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontFamily: '"Source Sans 3", sans-serif',
                          }}
                        >
                          {rj.source_filename}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Dịch sang: {formatLanguage(rj.target_lang)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Status Chip & Time */}
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                      {rj.status === "pending" && (
                        <Chip label="Đã tải lên" size="small" color="info" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                      )}
                      {rj.status === "processing" && (
                        <Chip label="Đang xử lý" size="small" color="warning" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                      )}
                      {rj.status === "completed" && (
                        <Chip label="Hoàn thành" size="small" color="success" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                      )}
                      {rj.status === "failed" && (
                        <Chip label="Thất bại" size="small" color="error" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                      )}

                      {(rj.status === "completed" || rj.status === "failed") && (
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                          ({getDurationText(rj)})
                        </Typography>
                      )}
                    </Grid>

                    {/* Actions */}
                    <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      {rj.status === "completed" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={() => navigate(`/compare/${rj.id}`)}
                          sx={{
                            fontWeight: 600,
                            borderRadius: "6px",
                            textTransform: "none",
                            py: 0.5,
                            fontSize: "0.8rem",
                          }}
                        >
                          So sánh
                        </Button>
                      )}

                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}
    </Card>
  );
}