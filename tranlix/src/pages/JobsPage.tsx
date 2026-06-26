import { Stack, Typography } from "@mui/material";

import { JobList } from "@features/jobs";

export function JobsPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Lịch sử dịch
      </Typography>
      <JobList />
    </Stack>
  );
}
