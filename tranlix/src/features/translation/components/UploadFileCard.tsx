import { Box, Card, CircularProgress, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

import type { UploadFile } from "../types";
import { getFileIconAndColor } from "../lib/fileIcon";
import { PreflightMeta } from "./PreflightMeta";

interface Props {
  item: UploadFile;
  onRemove: () => void;
  onTopicsChange: (topics: string[]) => void;
  onForceOcrChange: (forceOcr: boolean) => void;
  disabled?: boolean;
}

// One file's card in the upload list: shows an analyzing spinner, an error,
// or the preflight metadata, depending on where that file's own analysis
// currently stands.
export function UploadFileCard({ item, onRemove, onTopicsChange, onForceOcrChange, disabled }: Props) {
  const { icon, color } = getFileIconAndColor(item.file.name);

  return (
    <Card
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
      <Box sx={{ p: 1.5 }}>
        {item.isAnalyzing ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ color, display: "flex", alignItems: "center" }}>
              {icon}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CircularProgress size={12} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                {item.file.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Đang phân tích...
              </Typography>
            </Box>
          </Box>
        ) : item.error ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 0.5 }}>
            <Box sx={{ color: "error.main", display: "flex", alignItems: "center" }}>
              <Close sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "error.main" }}>
              {item.error}
            </Typography>
          </Box>
        ) : item.preflight ? (
          <PreflightMeta
            preflight={item.preflight}
            icon={icon}
            color={color}
            onRemove={onRemove}
            topics={item.topics}
            onTopicsChange={onTopicsChange}
            forceOcr={item.forceOcr}
            onForceOcrChange={onForceOcrChange}
            disabled={disabled}
          />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ color, display: "flex", alignItems: "center" }}>
              {icon}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {item.file.name}
            </Typography>
            <IconButton size="small" onClick={onRemove} sx={{ ml: "auto" }}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Card>
  );
}
