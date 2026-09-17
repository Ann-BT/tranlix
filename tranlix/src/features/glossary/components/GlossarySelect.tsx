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
    <FormControl
      fullWidth
      size="small"
      disabled={disabled}
      sx={{
        "& .MuiInputLabel-root": { color: "text.secondary" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#10B981", fontWeight: 600 },
      }}
    >
      <InputLabel id="glossary-select-label">Thiết lập thuật ngữ chuyên ngành (tùy chọn)</InputLabel>
      <Select
        labelId="glossary-select-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Thiết lập thuật ngữ chuyên ngành (tùy chọn)" sx={{ borderRadius: "4px" }} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((val) => {
              const g = filtered.find((item: any) => item.id === val);
              return <Chip key={val} label={g ? g.name : val} size="small" sx={{ borderRadius: "4px", backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10B981" }} />;
            })}
          </Box>
        )}
        sx={{
          borderRadius: "4px",
          color: "text.primary",
          backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.8)"),
          "& .MuiOutlinedInput-notchedOutline": { borderColor: (theme) => (theme.palette.mode === "dark" ? "rgba(148, 163, 184, 0.2)" : "rgba(0, 0, 0, 0.15)"), borderRadius: "4px" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#10B981" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#10B981" },
          "& .MuiSvgIcon-root": { color: "text.secondary" },
        }}
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
