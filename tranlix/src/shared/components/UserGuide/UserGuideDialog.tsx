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
  { step: "1. Tải tệp lên", text: "Kéo thả hoặc nhấp chọn tối đa 3 tài liệu từ máy tính (.docx, .doc, .pptx, .ppt, .xlsx, .xls, .pdf, .png, .jpg, .jpeg)." },
  { step: "2. Chọn ngôn ngữ & thuật ngữ", text: "Chọn ngôn ngữ đích cần dịch sang và chọn bộ thuật ngữ chuyên ngành (nếu có)." },
  { step: "3. Tùy chỉnh tệp dịch", text: "Có thể chọn chủ đề tài liệu cho từng tệp hoặc bật chế độ 'Ép dùng OCR' nếu tệp dạng ảnh/scan." },
  { step: "4. Bắt đầu dịch", text: "Nhấn 'Dịch ngay' để khởi tạo tiến trình dịch thuật." },
];

const HISTORY_STEPS = [
  { step: "1. Quản lý & Lọc danh sách", text: "Tìm kiếm theo tên tệp, lọc theo trạng thái (Hoàn thành, Đang xử lý, Thất bại), ngôn ngữ hoặc chọn ngày." },
  { step: "2. So sánh bản dịch", text: "Nhấn 'So sánh' đối với tệp đã hoàn thành để xem giao diện đối chiếu tài liệu." },
  { step: "3. Tải bản dịch về", text: "Nhấn nút 'Tải về' để lưu tệp bản dịch giữ nguyên cấu trúc ban đầu." },
];

const GLOSSARY_STEPS = [
  { step: "1. Tạo bộ thuật ngữ mới", text: "Nhấn 'Tạo bộ thuật ngữ mới', nhập tên và chọn cặp ngôn ngữ nguồn - đích." },
  { step: "2. Thêm các cặp từ", text: "Trong bộ thuật ngữ đã chọn, nhập 'Thuật ngữ nguồn' và 'Thuật ngữ đích' rồi nhấn 'Thêm'." },
  { step: "3. Áp dụng khi dịch", text: "Các bộ thuật ngữ được lưu sẽ xuất hiện ở mục chọn thuật ngữ khi khởi tạo lượt dịch mới." },
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
