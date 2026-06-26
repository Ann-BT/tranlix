import { Chip } from "@mui/material";

import type { JobStatus } from "../types";

const COLOR: Record<JobStatus, "warning" | "info" | "success" | "error"> = {
  pending: "warning",
  processing: "info",
  completed: "success",
  failed: "error",
};

const LABEL: Record<JobStatus, string> = {
  pending: "Chờ xử lý",
  processing: "Đang dịch",
  completed: "Hoàn thành",
  failed: "Thất bại",
};

export function JobStatusChip({ status }: { status: JobStatus }) {
  return (
    <Chip
      size="small"
      color={COLOR[status]}
      label={LABEL[status]}
      sx={{
        fontWeight: 600,
        borderRadius: "4px",
        height: "24px",
      }}
    />
  );
}
