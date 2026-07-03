import { Box, Typography, List, ListItemButton, ListItemIcon, Paper, useTheme, useMediaQuery } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Language, History, Translate } from "@mui/icons-material";
import { colorTokens } from "@/shared/styles/tokens";

const menuItems = [
  { text: "Dịch tài liệu", icon: <Translate />, path: "/" },
  { text: "Lịch sử dịch", icon: <History />, path: "/history" },
  { text: "Thuật ngữ", icon: <Language />, path: "/glossary" },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  if (isMobile) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: collapsed ? 72 : 240,
        height: "100%",
        borderRadius: 0,
        borderRight: `1px solid ${colorTokens.neutral200}`,
        backgroundColor: colorTokens.white,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Navigation Menu */}
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 1.5, pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <List sx={{ p: 0, mt: 1 }}>
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <ListItemButton
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      mx: 0.5,
                      borderRadius: "8px",
                      mb: 0.8,
                      px: collapsed ? 0 : 2,
                      py: 1.2,
                      justifyContent: collapsed ? "center" : "flex-start",
                      backgroundColor: active ? colorTokens.teal500 : "transparent",
                      border: "1px solid",
                      borderColor: active ? colorTokens.teal500 : "transparent",
                      color: active ? colorTokens.white : colorTokens.neutral700,
                      boxShadow: active ? "0 4px 12px rgba(0, 148, 157, 0.2)" : "none",
                      transition: "all 150ms ease",
                      "&:hover": {
                        backgroundColor: active ? colorTokens.teal600 : colorTokens.neutral100,
                        color: active ? colorTokens.white : colorTokens.neutral900,
                        "& .MuiListItemIcon-root": {
                          color: active ? colorTokens.white : colorTokens.neutral800,
                        }
                      },
                    }}
                  >
                    <ListItemIcon
                      className="MuiListItemIcon-root"
                      sx={{
                        color: active ? colorTokens.white : colorTokens.neutral600,
                        minWidth: collapsed ? 0 : 32,
                        display: "flex",
                        justifyContent: collapsed ? "center" : "flex-start",
                        transition: "color 150ms ease",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: active ? 600 : 500,
                          fontSize: "0.875rem",
                          fontFamily: '"Source Sans 3", sans-serif',
                        }}
                      >
                        {item.text}
                      </Typography>
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}