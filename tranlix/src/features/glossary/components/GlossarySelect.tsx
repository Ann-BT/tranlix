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
import { useGlossaries } from "../hooks/useGlossaries";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  targetLang?: string;
  disabled?: boolean;
}

export function GlossarySelect({ value, onChange, targetLang, disabled }: Props) {
  const { data: rawGlossaries } = useGlossaries();

  // The API already scopes glossaries to the current user; no client-side filtering needed.
  const glossariesList = Array.isArray(rawGlossaries) ? rawGlossaries : (rawGlossaries as any)?.items || [];

  const filtered = targetLang
    ? glossariesList.filter((g: any) => !g.target_lang || g.target_lang === targetLang)
    : glossariesList;

  const handleChange = (e: SelectChangeEvent<string[]>) => {
    onChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value);
  };

  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel id="glossary-select-label">Bảng thuật ngữ (tùy chọn)</InputLabel>
      <Select
        labelId="glossary-select-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Bảng thuật ngữ (tùy chọn)" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((val) => {
              const g = filtered.find((item: any) => item.id === val);
              return <Chip key={val} label={g ? g.name : val} size="small" />;
            })}
          </Box>
        )}
        sx={{ borderRadius: 2 }}
      >
        {filtered.map((g: any) => (
          <MenuItem key={g.id} value={g.id}>
            <Checkbox checked={value.indexOf(g.id) > -1} />
            <ListItemText primary={g.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
