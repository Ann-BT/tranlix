import { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Tooltip, Divider, Button } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ExitToApp, HelpOutlined, ManageAccountsOutlined, LightModeOutlined, DarkModeOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { colorTokens, useColorMode } from "@/shared/styles";
import { useAuth } from "@/shared/context/AuthContext";
import { UserGuideDialog } from "@/shared/components/UserGuide/UserGuideDialog";

export { AuthProvider, useAuth } from "@/shared/context/AuthContext";
export type { AuthUser, AuthContextType } from "@/shared/context/AuthContext";

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const [helpOpen, setHelpOpen] = useState(false);

  let initialGuideTab = 0;
  if (location.pathname.startsWith("/jobs")) initialGuideTab = 1;
  else if (location.pathname.startsWith("/glossary")) initialGuideTab = 2;

  // Avatar menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          backgroundColor: mode === "dark" ? "rgba(11, 19, 43, 0.92)" : "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: mode === "dark" ? "0 4px 25px rgba(0, 0, 0, 0.4)" : "0 2px 15px rgba(0, 0, 0, 0.05)",
          height: "64px",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            minHeight: "64px",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
            {onToggleSidebar && (
              <IconButton
                onClick={onToggleSidebar}
                sx={{
                  mr: 0.5,
                  color: "text.secondary",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                  },
                }}
                aria-label="Toggle sidebar"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                cursor: "pointer",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0.5,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                }}
              >
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Tranlix Logo"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 400,
                    fontFamily: '"Lexend", sans-serif',
                    color: "text.primary",
                    lineHeight: 1.1,
                    fontSize: "1.2rem",
                    letterSpacing: "-0.5px",
                  }}
                >
                  TRANLIX
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    fontFamily: '"Play", sans-serif',
                    fontSize: "0.72rem",
                    fontWeight: 400,
                  }}
                >
                  An toàn và Nguyên vẹn!
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* User Info & Avatar / Theme Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title={mode === "dark" ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}>
              <IconButton
                onClick={toggleColorMode}
                sx={{
                  color: "text.secondary",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    transform: "rotate(15deg)",
                  },
                }}
              >
                {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>
            </Tooltip>
            {isAuthenticated ? (
              <>
                <Tooltip title="Hướng dẫn sử dụng">
                  <IconButton
                    onClick={() => setHelpOpen(true)}
                    sx={{
                      color: "#64748B",
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                      "&:hover": {
                        color: "#B91C1C",
                        backgroundColor: "rgba(185, 28, 28, 0.08)",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <HelpOutlined />
                  </IconButton>
                </Tooltip>
                <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.fullName || "User"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontFamily: "monospace",
                    }}
                  >
                    @{user?.username || "user"}
                  </Typography>
                </Box>
                <Tooltip title="Tài khoản">
                  <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      padding: 0,
                      width: 40,
                      height: 40,
                      transition: "transform 0.15s ease",
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "scale(1.05)",
                      },
                    }}
                    aria-label="account"
                    aria-controls="account-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#10B981",
                        color: "#FFFFFF",
                        fontSize: "1rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        border: "2px solid rgba(16, 185, 129, 0.4)",
                        boxShadow: "0 2px 10px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      {user?.fullName?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>

              {/* Avatar Dropdown Menu (Only rendered when logged in) */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleAvatarClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  mt: 1.5,
                  "& .MuiPaper-root": {
                    minWidth: 220,
                    borderRadius: "6px",
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 10px 30px rgba(0, 0, 0, 0.6)"
                        : "0 8px 24px rgba(0, 0, 0, 0.12)",
                    p: 0.8,
                  },
                }}
              >
                <MenuItem disabled sx={{ fontSize: "0.875rem", py: 1.2, opacity: "1 !important" }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", fontFamily: '"Lexend", sans-serif' }}>
                      {user?.fullName || "User"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace" }}>
                      @{user?.username || "user"}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  component={RouterLink}
                  to="/admin/users"
                  onClick={handleAvatarClose}
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.primary",
                    fontWeight: 600,
                    borderRadius: "4px",
                    py: 1,
                    "&:hover": {
                      backgroundColor: "rgba(16, 185, 129, 0.12)",
                      color: "#10B981",
                    },
                  }}
                >
                  <ManageAccountsOutlined sx={{ fontSize: 20, mr: 1, color: "#10B981" }} />
                  Quản lý tài khoản
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleAvatarClose();
                    logout();
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    color: "error.main",
                    fontWeight: 600,
                    borderRadius: "8px",
                    py: 1,
                    "&:hover": {
                      backgroundColor: "rgba(220, 38, 38, 0.06)",
                    },
                  }}
                >
                  <ExitToApp sx={{ fontSize: 20, mr: 1 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: colorTokens.wine500,
                color: colorTokens.wine500,
                px: 2.5,
                py: 0.8,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 148, 157, 0.04)",
                  borderColor: colorTokens.wine600,
                },
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>

    <UserGuideDialog
      open={helpOpen}
      onClose={() => setHelpOpen(false)}
      initialTab={initialGuideTab}
    />
  </>
  );
}