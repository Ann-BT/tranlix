import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  Paper,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  TranslateOutlined,
  ManageHistoryOutlined,
  SpellcheckOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";

import { useColorMode } from "@/shared/styles";

const menuItems = [
  { text: "Dịch tài liệu", icon: <TranslateOutlined />, path: "/" },
  { text: "Lịch sử hoạt động", icon: <ManageHistoryOutlined />, path: "/history" },
  { text: "Thuật ngữ", icon: <SpellcheckOutlined />, path: "/glossary" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const theme = useTheme();
  const { mode } = useColorMode();
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
        borderRight: "1px solid",
        borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
        backgroundColor: mode === "dark" ? "rgba(11, 19, 43, 0.95)" : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        transition: "width 0.3s cubic-bezier(0.2, 0, 0, 1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        willChange: "width",
      }}
    >
      {/* Navigation List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden", py: 2, px: 1.75 }}>
        <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 0.8 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Tooltip key={item.text} title={collapsed ? item.text : ""} placement="right" arrow disableHoverListener={!collapsed}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    borderRadius: "6px",
                    p: 0,
                    height: 44,
                    width: "100%",
                    justifyContent: "flex-start",
                    backgroundColor: active ? "#10B981" : "transparent",
                    color: active ? "#FFFFFF" : mode === "dark" ? "#94A3B8" : "#475569",
                    boxShadow: active ? "0 4px 14px rgba(16, 185, 129, 0.35)" : "none",
                    transition: "background-color 0.2s ease, color 0.2s ease, boxShadow 0.2s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      backgroundColor: active ? "#059669" : "rgba(16, 185, 129, 0.12)",
                      color: active ? "#FFFFFF" : "#10B981",
                      "& .MuiListItemIcon-root": {
                        color: active ? "#FFFFFF" : "#10B981",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    className="MuiListItemIcon-root"
                    sx={{
                      color: active ? "#FFFFFF" : mode === "dark" ? "#94A3B8" : "#475569",
                      minWidth: 44,
                      width: 44,
                      height: 44,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexShrink: 0,
                      transition: "color 0.2s ease",
                      "& .MuiSvgIcon-root": {
                        fontSize: 22,
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: active ? 700 : 600,
                      fontSize: "0.88rem",
                      fontFamily: '"Lexend", sans-serif',
                      whiteSpace: "nowrap",
                      opacity: collapsed ? 0 : 1,
                      transition: "opacity 0.2s cubic-bezier(0.2, 0, 0, 1)",
                      pr: 1.5,
                    }}
                  >
                    {item.text}
                  </Typography>
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* Bottom Collapse Toggle Handle */}
      {onToggleCollapse && (
        <Box
          sx={{
            p: 1.75,
            borderTop: "1px solid",
            borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
            bgcolor: mode === "dark" ? "rgba(3, 7, 18, 0.4)" : "rgba(241, 245, 249, 0.6)",
          }}
        >
          <Tooltip title={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"} placement="right" arrow>
            <IconButton
              onClick={onToggleCollapse}
              sx={{
                width: "100%",
                height: 44,
                borderRadius: "6px",
                color: mode === "dark" ? "#94A3B8" : "#475569",
                border: "1px solid",
                borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
                bgcolor: mode === "dark" ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF",
                transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
                "&:hover": {
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  borderColor: "#10B981",
                },
              }}
            >
              {collapsed ? <ChevronRightOutlined /> : <ChevronLeftOutlined />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
}