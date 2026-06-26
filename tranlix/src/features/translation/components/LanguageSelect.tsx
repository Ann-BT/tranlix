import { MenuItem, TextField } from "@mui/material";

import { TARGET_LANGUAGES } from "../types";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelect({ value, onChange }: Props) {
  return (
    <TextField
      select label="Dịch sang" value={value}
      onChange={(e) => onChange(e.target.value)} fullWidth
    >
      {TARGET_LANGUAGES.map((lang) => (
        <MenuItem key={lang.code} value={lang.code}>
          {lang.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
