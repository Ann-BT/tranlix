import { Stack, Typography } from "@mui/material";
import { JobList } from "@features/jobs";
import { colorTokens } from "@/shared/styles/tokens";

export function JobsPage() {
  return (
    <Stack spacing={4} sx={{ py: 1 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          fontFamily: '"Lexend", sans-serif',
          color: colorTokens.neutral800,
        }}
      >
        Lịch sử dịch
      </Typography>
      <JobList />
    </Stack>
  );
}
