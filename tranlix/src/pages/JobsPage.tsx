import { Container, Stack, Typography } from "@mui/material";
import { JobList } from "@features/jobs";

export function JobsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontFamily: '"Lexend", sans-serif',
            color: "text.primary",
          }}
        >
          Lịch sử hoạt động
        </Typography>
        <JobList />
      </Stack>
    </Container>
  );
}
