import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Box,
  Chip,
  Checkbox,
  ListItemText,
  type SelectChangeEvent,
  type Theme,
} from "@mui/material";

import { TOPICS } from "../types";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

// Fixed list (see TOPICS in ../types), unlike GlossarySelect which fetches
// from the API -- no query needed here. Left unselected, the backend
// auto-detects the document's topic(s) from its own content instead.
export function TopicSelect({ value, onChange, disabled }: Props) {
  const handleChange = (e: SelectChangeEvent<string[]>) => {
    onChange(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value);
  };

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel id="topic-select-label" sx={{ fontFamily: '"Lexend", sans-serif', fontSize: "0.82rem" }}>
        Chủ đề tài liệu (tùy chọn)
      </InputLabel>
      <Select
        labelId="topic-select-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Chủ đề tài liệu (tùy chọn)" sx={{ borderRadius: "8px" }} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((val) => {
              const topic = TOPICS.find((t) => t.value === val);
              return (
                <Chip
                  key={val}
                  label={topic ? topic.label : val}
                  size="small"
                  sx={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    height: 22,
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5",
                    color: (theme: Theme) => (theme.palette.mode === "dark" ? "#34D399" : "#047857"),
                    borderColor: "rgba(16, 185, 129, 0.3)",
                  }}
                />
              );
            })}
          </Box>
        )}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                maxHeight: 260,
                borderRadius: "10px",
                boxShadow: (theme: Theme) =>
                  theme.palette.mode === "dark"
                    ? "0 10px 30px rgba(0, 0, 0, 0.6)"
                    : "0 8px 24px rgba(0, 0, 0, 0.12)",
                border: "1px solid",
                borderColor: "divider",
                mt: 0.5,
                p: 0.5,
                "& .MuiMenuItem-root": {
                  py: 0.6,
                  px: 1.2,
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontFamily: '"Lexend", sans-serif',
                  transition: "all 150ms ease",
                  "&:hover": {
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9",
                  },
                  "&.Mui-selected": {
                    bgcolor: (theme: Theme) =>
                      theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
                    color: (theme: Theme) => (theme.palette.mode === "dark" ? "#34D399" : "#047857"),
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: (theme: Theme) =>
                        theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.22)" : "#D1FAE5",
                    },
                  },
                },
              },
            },
          },
        }}
        sx={{
          borderRadius: "8px",
          fontFamily: '"Lexend", sans-serif',
          fontSize: "0.85rem",
          "& .MuiOutlinedInput-notchedOutline": { borderRadius: "8px" },
        }}
      >
        {TOPICS.map((topic) => {
          const isSelected = value.indexOf(topic.value) > -1;
          return (
            <MenuItem key={topic.value} value={topic.value}>
              <Checkbox
                size="small"
                checked={isSelected}
                sx={{
                  p: 0.5,
                  mr: 1,
                  color: (theme: Theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"),
                  "&.Mui-checked": {
                    color: "#10B981",
                  },
                }}
              />
              <ListItemText
                primary={topic.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.85rem",
                      fontWeight: isSelected ? 700 : 500,
                      fontFamily: '"Lexend", sans-serif',
                    },
                  },
                }}
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
