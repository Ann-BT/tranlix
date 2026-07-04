import { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import vietanLogo from "@/core/assets/vietan_logo.png";
import { Header, useAuth } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("access_token");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      {/* Main Content Area with Sidebar */}
      <Box sx={{ display: "flex", flexGrow: 1, height: "calc(100vh - 64px)", overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} />
        
        {/* Scrollable Right Content Panel */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            position: "relative",
            overflowX: "hidden",
          }}
        >
          {/* Decorative background color blobs */}
          <Box
            sx={{
              position: "absolute",
              top: "-150px",
              right: "-150px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0, 148, 157, 0.05) 0%, rgba(0, 148, 157, 0) 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "150px",
              left: "-150px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(27, 75, 109, 0.03) 0%, rgba(27, 75, 109, 0) 70%)",
              filter: "blur(50px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Main Content */}
          <Container
            component="main"
            maxWidth="xl"
            sx={{
              flexGrow: 1,
              py: 4,
              px: { xs: 2, sm: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              zIndex: 1,
            }}
          >
            {/* Page Outlet */}
            <Box sx={{ flexGrow: 1 }}>
              <Outlet />
            </Box>
          </Container>
          
          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 2.5,
              px: { xs: 3, md: 4 },
              backgroundColor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
              mt: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                textAlign: "center",
              }}
            >
              {/* Copyright & Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  component="img"
                  src={vietanLogo}
                  alt="Vietan Logo"
                  sx={{
                    height: 22,
                    filter: "grayscale(20%)",
                    opacity: 0.85,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  © 2026 TRANLIX - Công ty TNHH Phát triển và Đầu tư Việt An
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}