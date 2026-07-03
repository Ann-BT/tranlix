import { Box, Typography } from "@mui/material";
import { TranslationForm } from "@features/translation";
import { colorTokens } from "@/shared/styles/tokens";

export function HomePage() {
  return (
    <Box 
      sx={{ 
        py: { xs: 4, md: 6 }, 
        px: { xs: 2, sm: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hero Header */}
      <Box sx={{ textAlign: "center", mb: 5, zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: colorTokens.neutral800,
            fontFamily: '"Lexend", sans-serif',
            mb: 2,
            letterSpacing: "-0.5px",
            fontSize: { xs: "2rem", md: "2.75rem" },
          }}
        >
          Hệ thống dịch thuật tài liệu thông minh
        </Typography>
      </Box>

      {/* Translation Form Wrapper */}
      <Box sx={{ maxWidth: "1000px", width: "100%", mx: "auto", zIndex: 1 }}>
        <TranslationForm />
      </Box>
    </Box>
  );
}