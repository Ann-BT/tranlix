import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
      <Typography variant="h5">404 — Không tìm thấy trang</Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Về trang chủ
      </Button>
    </Box>
  );
}
