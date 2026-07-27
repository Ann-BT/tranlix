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
      <InputLabel id="topic-select-label">Chủ đề tài liệu (tùy chọn)</InputLabel>
      <Select
        labelId="topic-select-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Chủ đề tài liệu (tùy chọn)" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((val) => {
              const topic = TOPICS.find((t) => t.value === val);
              return <Chip key={val} label={topic ? topic.label : val} size="small" />;
            })}
          </Box>
        )}
        sx={{ borderRadius: 2 }}
      >
        {TOPICS.map((topic) => (
          <MenuItem key={topic.value} value={topic.value}>
            <Checkbox checked={value.indexOf(topic.value) > -1} />
            <ListItemText primary={topic.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
