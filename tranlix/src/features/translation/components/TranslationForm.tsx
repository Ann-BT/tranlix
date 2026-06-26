import { Alert, Button, Card, FormControlLabel, IconButton, Popover, Stack, Switch, Typography } from "@mui/material";
import { useState } from "react";
import HelpIcon from "@mui/icons-material/Help";

import { useCreateTranslation } from "../hooks/useCreateTranslation";
import { LanguageSelect } from "./LanguageSelect";
import { UploadDropzone } from "./UploadDropzone";

export function TranslationForm() {
  const [file, setFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState("English");
  const [inlineMode, setInlineMode] = useState(false);
  const create = useCreateTranslation();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpenHelp = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseHelp = () => {
    setAnchorEl(null);
  };

  const openHelp = Boolean(anchorEl);
  const helpId = openHelp ? "inline-mode-help-popover" : undefined;

  return (
    <Card elevation={0}>
      <Stack spacing={3.5}>
        <UploadDropzone file={file} onFile={setFile} />
        
        <LanguageSelect value={targetLang} onChange={setTargetLang} />
        
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <FormControlLabel
            control={
              <Switch 
                checked={inlineMode} 
                onChange={(e) => setInlineMode(e.target.checked)} 
                color="primary"
              />
            }
            label="Giữ định dạng inline (đậm, nghiêng, màu sắc...)"
            sx={{
              marginRight: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "text.primary",
              }
            }}
          />
          <IconButton 
            size="small" 
            onClick={handleOpenHelp} 
            sx={{ 
              color: "text.secondary",
              "&:hover": { color: "primary.main" }
            }}
          >
            <HelpIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Popover
            id={helpId}
            open={openHelp}
            anchorEl={anchorEl}
            onClose={handleCloseHelp}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            slotProps={{
              paper: {
                sx: {
                  p: 2.5,
                  maxWidth: 340,
                  borderRadius: "12px",
                  boxShadow: "0px 8px 30px rgba(27, 75, 109, 0.12)",
                  border: "1px solid",
                  borderColor: "divider",
                }
              }
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontFamily: '"Lexend", sans-serif', 
                fontWeight: 600,
                color: "secondary.main", 
                mb: 1 
              }}
            >
              Chế độ dịch tài liệu
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.6, color: "text.primary" }}>
              <strong>Merge Mode (Tắt - Mặc định):</strong> Gộp cả đoạn văn bản để dịch cùng lúc. Đảm bảo cấu trúc văn bản/ảnh/bảng ổn định nhất, cấu trúc ngữ nghĩa mượt mà nhưng có thể làm mất phong cách định dạng của từ cụ thể trong câu.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6, color: "text.primary" }}>
              <strong>Inline Mode (Bật):</strong> Chèn mã ranh giới vào giữa các từ định dạng (đậm, nghiêng, màu sắc) để gửi đi dịch. Thích hợp cho các tài liệu kỹ thuật có nhiều từ khóa định dạng xen kẽ.
            </Typography>
          </Popover>
        </Stack>

        {create.isError && (
          <Alert severity="error" sx={{ borderRadius: "8px" }}>
            {create.error.message}
          </Alert>
        )}
        
        {create.isSuccess && (
          <Alert severity="success" sx={{ borderRadius: "8px" }}>
            Đã tải lên và tạo yêu cầu dịch thành công! Hãy theo dõi tiến trình trong tab Lịch sử.
          </Alert>
        )}

        <Button
          variant="contained" 
          size="large"
          color="primary"
          disabled={!file || create.isPending}
          onClick={() => file && create.mutate({ file, targetLang, inlineMode })}
          sx={{
            py: 1.5,
            fontFamily: '"Lexend", sans-serif',
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 148, 157, 0.2)",
          }}
        >
          {create.isPending ? "Đang tải lên và xử lý..." : "Bắt đầu dịch"}
        </Button>
      </Stack>
    </Card>
  );
}
