import { MenuItem, TextField } from "@mui/material";

import { TARGET_LANGUAGES } from "../types";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelect({ value, onChange }: Props) {
  return (
    <TextField
      select
      size="small"
      label="Chọn ngôn ngữ"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      sx={{
        "& .MuiInputLabel-root": { color: "text.secondary" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#10B981", fontWeight: 600 },
        "& .MuiOutlinedInput-root": {
          borderRadius: "4px",
          color: "text.primary",
          backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.8)"),
          "& fieldset": { borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.2)" : "rgba(0, 0, 0, 0.15)"), borderRadius: "4px" },
          "&:hover fieldset": { borderColor: "#10B981" },
          "&.Mui-focused fieldset": { borderColor: "#10B981" },
          "& .MuiSvgIcon-root": { color: "text.secondary" },
        },
      }}
    >
      {TARGET_LANGUAGES.map((lang) => (
        <MenuItem key={lang.code} value={lang.code}>
          {lang.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
