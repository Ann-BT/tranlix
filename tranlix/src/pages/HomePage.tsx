import { Stack, Typography } from "@mui/material";

import { TranslationForm } from "@features/translation";

export function HomePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Dịch tài liệu Office, giữ nguyên format
      </Typography>
      <TranslationForm />
    </Stack>
  );
}
