import { Box, Container } from "@mui/material";
import { TranslationForm } from "@features/translation";

export function HomePage() {
  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "transparent",
        flexGrow: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 1 }}>
        {/* Translation Studio Component */}
        <Box sx={{ width: "100%", mx: "auto" }}>
          <TranslationForm />
        </Box>
      </Container>
    </Box>
  );
}