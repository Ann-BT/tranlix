import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface UserGuideDialogProps {
  open: boolean;
  onClose: () => void;
  initialTab?: number;
}

const TRANSLATE_STEPS = [
  { step: "1. Tải tệp lên", text: "Kéo thả hoặc nhấp chọn tài liệu từ máy tính (.docx, .doc, .pptx, .ppt, .xlsx, .xls, .pdf, .png, .jpg, .jpeg)." },
  { step: "2. Chọn ngôn ngữ", text: "Chọn ngôn ngữ đích cần dịch sang và chủ đề tài liệu tương ứng." },
  { step: "3. Chọn bộ thuật ngữ", text: "Lựa chọn từ điển chuyên ngành cá nhân để cố định cách dịch các từ khóa quan trọng." },
  { step: "4. Bắt đầu dịch", text: "Nhấn 'Bắt đầu dịch' để khởi tạo tiến trình và tự động chuyển sang trang Lịch sử hoạt động." },
];

const HISTORY_STEPS = [
  { step: "1. Xem danh sách & Tiến trình", text: "Theo dõi trạng thái nhiệm vụ dịch thuật theo thời gian thực (Đang xử lý %, Hoàn thành, Lỗi)." },
  { step: "2. Đối chiếu song song", text: "Nhấn 'Xem tài liệu' để xem và so sánh trực tiếp trang gốc và trang dịch trong OnlyOffice Viewer." },
  { step: "3. Tải bản dịch về", text: "Nhấn 'Tải về' để lưu tệp bản dịch giữ nguyên cấu trúc và định dạng ban đầu." },
];

const GLOSSARY_STEPS = [
  { step: "1. Tạo bộ thuật ngữ mới", text: "Nhấn 'Tạo bộ thuật ngữ mới', nhập tên từ điển và chọn cặp ngôn ngữ nguồn - đích." },
  { step: "2. Thêm cặp từ chuyên ngành", text: "Mở thẻ từ điển, nhập 'Thuật ngữ gốc' → 'Thuật ngữ dịch' rồi nhấn '+ Thêm'." },
  { step: "3. Lưu bộ từ điển", text: "Nhấn 'Lưu thuật ngữ' để hoàn tất. Dữ liệu sẽ tự động khả dụng khi bạn dịch tài liệu." },
];

export function UserGuideDialog({ open, onClose, initialTab = 0 }: UserGuideDialogProps) {
  const [tabIndex, setTabIndex] = useState(initialTab);

  React.useEffect(() => {
    setTabIndex(initialTab);
  }, [initialTab]);

  const renderSteps = (steps: { step: string; text: string }[]) => (
    <Stack spacing={2} sx={{ mt: 1 }}>
      {steps.map((item, idx) => (
        <Box key={idx}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", fontFamily: '"Lexend", sans-serif', mb: 0.3 }}>
            {item.step}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {item.text}
          </Typography>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
          px: 3,
          fontFamily: '"Lexend", sans-serif',
          fontWeight: 700,
        }}
      >
        Hướng dẫn sử dụng
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <Box sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.88rem",
              fontFamily: '"Lexend", sans-serif',
              minHeight: 44,
            },
          }}
        >
          <Tab label="Dịch tài liệu" />
          <Tab label="Lịch sử hoạt động" />
          <Tab label="Thuật ngữ" />
        </Tabs>
      </Box>

      <DialogContent sx={{ py: 2.5, px: 3 }}>
        {tabIndex === 0 && renderSteps(TRANSLATE_STEPS)}
        {tabIndex === 1 && renderSteps(HISTORY_STEPS)}
        {tabIndex === 2 && renderSteps(GLOSSARY_STEPS)}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{
            borderRadius: 2,
            px: 2.5,
            textTransform: "none",
            fontWeight: 600,
            fontFamily: '"Lexend", sans-serif',
            bgcolor: "#10B981",
            "&:hover": { bgcolor: "#059669" },
          }}
        >
          Đã hiểu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
