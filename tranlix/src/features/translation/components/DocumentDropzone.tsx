import { Box, CircularProgress, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import type { DragEvent } from "react";

interface Props {
  maxTasks: number;
  totalFiles: number;
  isDragging: boolean;
  isAnalyzing: boolean;
  isSubmitting: boolean;
  canAddMore: boolean;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
  onFilesSelected: (files: FileList) => void;
}

// Multi-file drag & drop input area, plus the "N of maxTasks" dot indicator.
export function DocumentDropzone({
  maxTasks,
  totalFiles,
  isDragging,
  isAnalyzing,
  isSubmitting,
  canAddMore,
  onDragOver,
  onDragLeave,
  onDrop,
  onFilesSelected,
}: Props) {
  const disabled = isSubmitting || isAnalyzing || !canAddMore;
  const hasFiles = totalFiles > 0;

  return (
    <>
      <Box
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        component="label"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: hasFiles ? { xs: 90, md: 110 } : { xs: 260, md: 320 },
          p: hasFiles ? { xs: 2, md: 2.5 } : { xs: 4, md: 6 },
          borderRadius: "6px",
          border: "2px dashed",
          borderColor: (theme) =>
            isDragging
              ? "#10B981"
              : !canAddMore
              ? theme.palette.divider
              : theme.palette.mode === "dark"
              ? "rgba(16, 185, 129, 0.35)"
              : "rgba(16, 185, 129, 0.5)",
          bgcolor: (theme) =>
            isDragging
              ? "rgba(16, 185, 129, 0.15)"
              : !canAddMore
              ? theme.palette.mode === "dark"
                ? "rgba(15, 23, 42, 0.6)"
                : "rgba(241, 245, 249, 0.8)"
              : theme.palette.mode === "dark"
              ? "rgba(15, 23, 42, 0.5)"
              : "rgba(248, 250, 252, 0.8)",
          cursor: disabled ? "default" : "pointer",
          transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: (theme) => (disabled ? theme.palette.divider : "#10B981"),
            bgcolor: (theme) =>
              disabled
                ? theme.palette.mode === "dark"
                  ? "rgba(15, 23, 42, 0.6)"
                  : "rgba(241, 245, 249, 0.8)"
                : "rgba(16, 185, 129, 0.08)",
          },
        }}
      >
        <input
          type="file"
          hidden
          accept=".docx,.doc,.pptx,.ppt,.xlsx,.xls,.pdf,.png,.jpg,.jpeg"
          multiple
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) onFilesSelected(e.target.files);
            e.target.value = "";
          }}
        />
        {isAnalyzing ? (
          <CircularProgress sx={{ color: "#10B981" }} size={hasFiles ? 28 : 40} />
        ) : (
          <>
            <CloudUpload
              sx={{
                fontSize: hasFiles ? 30 : 56,
                color: "#10B981",
                mb: hasFiles ? 0.5 : 1.5,
                transition: "all 300ms ease",
                "&:hover": { transform: "scale(1.08)" },
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                color: "text.primary",
                fontFamily: '"Lexend", sans-serif',
                fontSize: hasFiles ? "0.88rem" : "1rem",
                textAlign: "center",
              }}
            >
              Tải tài liệu cần dịch
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                fontSize: hasFiles ? "0.75rem" : "0.8rem",
              }}
            >
              Hỗ trợ: Office (.docx, .doc, .pptx, .ppt, .xlsx, .xls), PDF, Ảnh (.png, .jpg, .jpeg) (Tối đa 3 file)
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, my: 1 }}>
        {Array.from({ length: maxTasks }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 36,
              height: 5,
              borderRadius: "4px",
              backgroundColor: index < totalFiles ? "#10B981" : "rgba(255, 255, 255, 0.15)",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </Box>
    </>
  );
}
