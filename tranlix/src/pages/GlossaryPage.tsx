import { Container, Stack } from "@mui/material";
import { GlossaryManager } from "@features/glossary";

export function GlossaryPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={2}>
        <GlossaryManager />
      </Stack>
    </Container>
  );
}

