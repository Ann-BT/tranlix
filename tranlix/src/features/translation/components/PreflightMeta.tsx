import { Box, FormControlLabel, IconButton, Switch, Tooltip, Typography } from "@mui/material";
import { Close, InfoOutlined } from "@mui/icons-material";

import type { PreflightResponse } from "../types";
import { TopicSelect } from "./TopicSelect";

interface Props {
  preflight: PreflightResponse;
  icon: React.ReactNode;
  color: string;
  onRemove: () => void;
  topics: string[];
  onTopicsChange: (topics: string[]) => void;
  forceOcr: boolean;
  onForceOcrChange: (forceOcr: boolean) => void;
  disabled?: boolean;
}

// Compact preflight metadata display: pages only appears for document
// types, needOCR only for PDF -- both are omitted by the backend for
// types that don't apply.
export function PreflightMeta({
  preflight, icon, color, onRemove, topics, onTopicsChange, forceOcr, onForceOcrChange, disabled,
}: Props) {
  const formatOCR = (val: boolean) => (
    <Typography
      component="span"
      variant="caption"
      sx={{ fontWeight: 700, color: val ? "error.main" : "success.main" }}
    >
      {val ? "Có" : "Không"}
    </Typography>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Row 1: Filename with Icon */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Box sx={{ color, display: "flex", alignItems: "center" }}>
          {icon}
        </Box>
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
          {preflight.fileName}
        </Typography>
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{
            ml: "auto",
            color: "text.secondary",
            "&:hover": { color: "error.main", bgcolor: "rgba(220, 38, 38, 0.04)" }
          }}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Row 2: Metadata Line 1 */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "baseline" }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Loại tệp: <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>{preflight.fileType}</Typography>
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Dung lượng: <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>{preflight.sizeMB.toFixed(2)} MB</Typography>
        </Typography>
        {preflight.pages != null && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Số trang: <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>{preflight.pages}</Typography>
          </Typography>
        )}
      </Box>

      {/* Row 3: Metadata Line 2 */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "baseline" }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Thời gian xử lý: <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>{preflight.estimatedTime}</Typography>
        </Typography>
        {preflight.needOCR != null && (
          <>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Cần OCR:
            </Typography>
            {formatOCR(preflight.needOCR)}
          </>
        )}
      </Box>

      {/* Row 3b: Manual OCR override -- only meaningful for PDF. A PDF can
          have a non-empty but CORRUPTED text layer (old Vietnamese font
          without a proper Unicode map) that "Cần OCR" above doesn't
          reliably flag, since its character-count heuristic still counts
          garbled characters. This lets the user force OCR regardless of
          what that heuristic guessed. */}
      {preflight.fileType === "PDF" && (
        <Box sx={{ mt: 0.5, display: "flex", alignItems: "center" }}>
          <FormControlLabel
            sx={{ ml: 0, mr: 0.5 }}
            control={
              <Switch
                size="small"
                checked={forceOcr}
                disabled={disabled}
                onChange={(e) => onForceOcrChange(e.target.checked)}
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                Dùng chế độ OCR
              </Typography>
            }
          />
          <Tooltip title="Bật khi PDF hiển thị chữ đúng nhưng dịch bị bỏ sót nhiều đoạn (lớp text ẩn trong file bị hỏng, thường do font tiếng Việt kiểu cũ) — hệ thống sẽ đọc chữ trực tiếp từ ảnh trang thay vì lớp text gốc. Chạy chậm hơn và có thể sai một số dấu tiếng Việt.">
            <InfoOutlined sx={{ fontSize: 15, color: "text.secondary" }} />
          </Tooltip>
        </Box>
      )}

      {/* Row 4: This file's own topic selection -- each document can be
          about a different subject, so it's picked per file, not once for
          the whole batch. */}
      <Box sx={{ mt: 1 }}>
        <TopicSelect value={topics} onChange={onTopicsChange} disabled={disabled} />
      </Box>
    </Box>
  );
}
