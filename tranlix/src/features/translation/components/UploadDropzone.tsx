import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArticleIcon from "@mui/icons-material/Article";
import TableChartIcon from "@mui/icons-material/TableChart";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

import { formatBytes } from "@shared/lib/formatBytes";
import { SUPPORTED_EXTENSIONS } from "../types";

interface Props {
  file: File | null;
  onFile: (file: File | null) => void;
}

function getFileIconAndColor(filename: string) {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  if (ext === ".docx" || ext === ".doc") {
    return { icon: <ArticleIcon sx={{ fontSize: 44 }} />, color: "#1B6EF3" }; // Word Blue
  }
  if (ext === ".xlsx" || ext === ".xls") {
    return { icon: <TableChartIcon sx={{ fontSize: 44 }} />, color: "#107C41" }; // Excel Green
  }
  if (ext === ".pptx" || ext === ".ppt") {
    return { icon: <SlideshowIcon sx={{ fontSize: 44 }} />, color: "#C43E1C" }; // PowerPoint Orange
  }
  if (ext === ".pdf") {
    return { icon: <ArticleIcon sx={{ fontSize: 44 }} />, color: "#E01B22" }; // PDF Red
  }
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
    return { icon: <InsertDriveFileIcon sx={{ fontSize: 44 }} />, color: "#8B5CF6" }; // Image Purple
  }
  return { icon: <InsertDriveFileIcon sx={{ fontSize: 44 }} />, color: "#64748B" }; // Default Grey
}

export function UploadDropzone({ file, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const fileInfo = file ? getFileIconAndColor(file.name) : null;

  return (
    <Box
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!file) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (file) return;
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
          const ext = droppedFile.name.substring(droppedFile.name.lastIndexOf(".")).toLowerCase();
          if (SUPPORTED_EXTENSIONS.includes(ext as typeof SUPPORTED_EXTENSIONS[number])) {
            onFile(droppedFile);
          }
        }
      }}
      sx={{
        p: 4,
        textAlign: "center",
        cursor: file ? "default" : "pointer",
        borderRadius: 3,
        border: "2px dashed",
        borderColor: dragging ? "primary.main" : file ? "primary.main" : "divider",
        bgcolor: dragging ? "primary.light" : file ? "background.paper" : "background.default",
        boxShadow: file ? "0px 4px 12px rgba(0, 148, 157, 0.05)" : "none",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: file ? "background.paper" : dragging ? "primary.light" : "rgba(0, 148, 157, 0.02)",
        },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={SUPPORTED_EXTENSIONS.join(",")}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) onFile(selectedFile);
        }}
      />
      {file && fileInfo ? (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            py: 1,
            px: 2,
            textAlign: "left",
            alignItems: "center",
          }}
        >
          <Box sx={{ color: fileInfo.color, display: "flex", alignItems: "center" }}>
            {fileInfo.icon}
          </Box>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Typography
              sx={{
                fontFamily: '"Lexend", sans-serif',
                fontWeight: 600,
                fontSize: "1rem",
                color: "text.primary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatBytes(file.size)}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            sx={{
              color: "text.secondary",
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              transition: "all 150ms",
              "&:hover": {
                color: "error.main",
                borderColor: "error.light",
                bgcolor: "error.light" + "1A", // 10% opacity
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      ) : (
        <Stack spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: dragging ? "primary.main" : "text.secondary",
              transition: "color 150ms",
            }}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: '"Lexend", sans-serif',
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "text.primary",
                mb: 0.5,
              }}
            >
              Kéo thả file tài liệu vào đây
            </Typography>
            <Typography variant="body2" color="text.secondary">
              hoặc click để chọn tệp từ máy tính
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              bgcolor: "background.paper",
              px: 2,
              py: 0.5,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
          >
            Hỗ trợ: Office (docx, pptx, xlsx, doc, ppt, xls), PDF, Ảnh (png, jpg, jpeg)
          </Typography>
        </Stack>
      )}
    </Box>
  );
}
