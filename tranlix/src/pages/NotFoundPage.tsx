import { Box, Button, Typography, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { colorTokens } from "@/shared/styles/tokens";
import { WarningAmber } from "@mui/icons-material";

export function NotFoundPage() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          borderRadius: "20px",
          border: `1px solid ${colorTokens.neutral200}`,
          boxShadow: "0 10px 30px rgba(27, 75, 109, 0.03)",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: `${colorTokens.warning}15`,
            mb: 3,
          }}
        >
          <WarningAmber sx={{ fontSize: 36, color: colorTokens.warning }} />
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontFamily: '"Lexend", sans-serif',
            color: colorTokens.neutral800,
            mb: 1.5,
          }}
        >
          404
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontFamily: '"Lexend", sans-serif',
            color: colorTokens.neutral700,
            mb: 2,
          }}
        >
          Không tìm thấy trang
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral500,
            fontFamily: '"Lexend", sans-serif',
            mb: 4,
            lineHeight: 1.5,
          }}
        >
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang một đường dẫn khác.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: "10px",
            fontFamily: '"Lexend", sans-serif',
            fontWeight: 600,
            fontSize: "0.95rem",
            textTransform: "none",
            backgroundColor: colorTokens.wine500,
            boxShadow: `0 4px 12px rgba(0, 148, 157, 0.2)`,
            "&:hover": {
              backgroundColor: colorTokens.wine600,
              boxShadow: `0 6px 16px rgba(0, 148, 157, 0.3)`,
            },
          }}
        >
          Về trang chủ
        </Button>
      </Paper>
    </Box>
  );
}
