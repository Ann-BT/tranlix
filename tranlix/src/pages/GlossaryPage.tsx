import { Stack } from "@mui/material";
import { GlossaryManager } from "@features/glossary";

export function GlossaryPage() {
  return (
    <Stack spacing={4} sx={{ py: 1 }}>
      <GlossaryManager />
    </Stack>
  );
}
