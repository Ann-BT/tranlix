import { useState } from "react";
import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
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
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        {/* Scrollable Right Content Panel with Tactile Caro Paper Grid & Noise Texture */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            position: "relative",
            overflowX: "hidden",
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#070B12" : "#FAF8F5"),
            backgroundImage: (theme) =>
              theme.palette.mode === "dark"
                ? `
                  linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
                  radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 65%),
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")
                `
                : `
                  linear-gradient(to right, rgba(0, 0, 0, 0.045) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.045) 1px, transparent 1px),
                  radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.95) 0%, transparent 75%),
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.045'/%3E%3C/svg%3E")
                `,
            backgroundSize: "24px 24px, 24px 24px, 100% 100%, 180px 180px",
            color: "text.primary",
          }}
        >
          {/* Main Content Area - Full width & height flexible canvas */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              minHeight: 0,
              pb: 4,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}