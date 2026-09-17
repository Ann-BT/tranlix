import { Stack, Typography } from "@mui/material";

import type { UploadFile } from "../types";
import { UploadFileCard } from "./UploadFileCard";

interface Props {
  files: UploadFile[];
  onRemove: (id: string) => void;
  onTopicsChange: (id: string, topics: string[]) => void;
  onForceOcrChange: (id: string, forceOcr: boolean) => void;
  disabled?: boolean;
}

export function UploadFileList({ files, onRemove, onTopicsChange, onForceOcrChange, disabled }: Props) {
  if (files.length === 0) return null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Tài liệu đã chọn ({files.length})
      </Typography>
      {files.map((item) => (
        <UploadFileCard
          key={item.id}
          item={item}
          onRemove={() => onRemove(item.id)}
          onTopicsChange={(topics) => onTopicsChange(item.id, topics)}
          onForceOcrChange={(forceOcr) => onForceOcrChange(item.id, forceOcr)}
          disabled={disabled}
        />
      ))}
    </Stack>
  );
}
