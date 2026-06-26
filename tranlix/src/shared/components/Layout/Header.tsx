import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import TranslateIcon from "@mui/icons-material/Translate";
import HistoryIcon from "@mui/icons-material/History";

export function Header() {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isJobs = location.pathname.startsWith("/jobs");

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      elevation={0}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: "64px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexGrow: 1 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 4px 10px rgba(0, 148, 157, 0.25)",
              }}
            >
              <TranslateIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Lexend", sans-serif',
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "secondary.main",
                letterSpacing: "-0.03em",
                m: 0,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              component={RouterLink}
              to="/"
              style={{ textDecoration: "none" }}
            >
              Tranlix
              <Box component="span" sx={{ color: "primary.main", ml: 0.2 }}>
                .
              </Box>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={RouterLink}
              to="/"
              variant="text"
              startIcon={<TranslateIcon />}
              sx={{
                fontFamily: '"Lexend", sans-serif',
                color: isHome ? "primary.main" : "text.secondary",
                position: "relative",
                borderRadius: "6px",
                px: 2,
                py: 1,
                fontWeight: 600,
                transition: "all 0.2s",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(0, 148, 157, 0.05)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-2px",
                  left: "15%",
                  width: "70%",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: "primary.main",
                  transform: isHome ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              Dịch mới
            </Button>
            <Button
              component={RouterLink}
              to="/jobs"
              variant="text"
              startIcon={<HistoryIcon />}
              sx={{
                fontFamily: '"Lexend", sans-serif',
                color: isJobs ? "primary.main" : "text.secondary",
                position: "relative",
                borderRadius: "6px",
                px: 2,
                py: 1,
                fontWeight: 600,
                transition: "all 0.2s",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(0, 148, 157, 0.05)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-2px",
                  left: "15%",
                  width: "70%",
                  height: "3px",
                  borderRadius: "2px",
                  backgroundColor: "primary.main",
                  transform: isJobs ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform 0.2s ease-in-out",
                },
              }}
            >
              Lịch sử
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
