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
          p: 4,
          borderRadius: "12px",
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : !canAddMore ? "action.disabled" : "divider",
          bgcolor: isDragging ? "primary.light" : !canAddMore ? "action.hover" : "background.default",
          cursor: disabled ? "default" : "pointer",
          transition: "all 200ms ease",
          "&:hover": {
            borderColor: disabled ? "divider" : "primary.main",
            bgcolor: disabled ? "action.hover" : "rgba(0, 148, 157, 0.02)",
          },
        }}
      >
        <input
          type="file"
          hidden
          accept=".docx,.pptx,.xlsx,.doc,.ppt,.xls,.pdf"
          multiple
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) onFilesSelected(e.target.files);
            e.target.value = "";
          }}
        />
        {isAnalyzing ? (
          <CircularProgress color="primary" />
        ) : (
          <>
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
              Hỗ trợ: Word, Excel, PowerPoint, PDF
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, my: 0.5 }}>
        {Array.from({ length: maxTasks }).map((_, index) => (
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
    </>
  );
}
