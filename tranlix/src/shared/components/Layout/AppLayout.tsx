import { Box, Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

import { Header } from "./Header";

export function AppLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          py: 6,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Tranlix. Bảo lưu mọi quyền. Dịch tài liệu giữ nguyên định dạng gốc.
        </Typography>
      </Box>
    </Box>
  );
}
