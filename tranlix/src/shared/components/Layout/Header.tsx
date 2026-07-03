import { useState, createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { AppBar, Box, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Tooltip, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import tranlixLogo from "@/core/assets/tranlix.svg";
import { ExitToApp, HelpOutlined } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { apiClient } from "@/shared/api/client";
import { colorTokens } from "@/shared/styles/tokens";

// Auth context for user state
export interface AuthUser {
  fullName: string;
  username: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => { },
});

// Custom hook for auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: AuthUser | null;
  }>({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      apiClient.get("/users/me")
        .then((res) => {
          setAuthState({
            isAuthenticated: true,
            user: { fullName: res.data.full_name, username: res.data.username },
          });
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          setAuthState({ isAuthenticated: false, user: null });
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { username, password });
      const { access_token } = response.data;
      localStorage.setItem("access_token", access_token);

      const userResponse = await apiClient.get("/users/me");
      const userData = userResponse.data;

      setAuthState({
        isAuthenticated: true,
        user: { fullName: userData.full_name, username: userData.username },
      });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [helpOpen, setHelpOpen] = useState(false);

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
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colorTokens.neutral200}`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: "none",
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
                color: colorTokens.neutral600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: colorTokens.teal500,
                  backgroundColor: "rgba(0, 148, 157, 0.04)",
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
            <img
              src={tranlixLogo}
              alt="Tranlix Logo"
              style={{
                height: "38px",
                width: "auto",
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontFamily: '"Lexend", sans-serif',
                  color: colorTokens.teal500,
                  lineHeight: 1.2,
                  fontSize: "1rem",
                }}
              >
                Tranlix
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: colorTokens.neutral500,
                  fontFamily: '"Source Sans 3", sans-serif',
                  fontSize: "0.75rem",
                }}
              >
                Hệ thống dịch tài liệu đa ngôn ngữ
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* User Info & Avatar / Login Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isAuthenticated ? (
            <>
              <Tooltip title="Hướng dẫn sử dụng">
                <IconButton
                  onClick={() => setHelpOpen(true)}
                  sx={{
                    color: colorTokens.neutral600,
                    cursor: "pointer",
                    "&:hover": {
                      color: colorTokens.teal500,
                      backgroundColor: "rgba(0, 148, 157, 0.04)",
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
                    fontWeight: 600,
                    color: colorTokens.neutral800,
                    lineHeight: 1.2,
                  }}
                >
                  {user?.fullName || "User"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.neutral500,
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
                    transition: "transform 0.2s ease",
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
                      bgcolor: colorTokens.teal500,
                      color: colorTokens.white,
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      border: "2px solid",
                      borderColor: colorTokens.teal100,
                      boxShadow: "0 2px 8px rgba(0, 148, 157, 0.15)",
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
                    minWidth: 200,
                    borderRadius: "16px",
                    border: `1px solid ${colorTokens.neutral200}`,
                    boxShadow: "0 10px 40px rgba(27, 75, 109, 0.08)",
                    p: 0.5,
                  },
                }}
              >
                <MenuItem disabled sx={{ fontSize: "0.875rem", py: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colorTokens.neutral800 }}>
                      {user?.fullName || "User"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colorTokens.neutral500 }}>
                      @{user?.username || "user"}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 0.5, borderColor: colorTokens.neutral100 }} />
                <MenuItem
                  onClick={() => {
                    handleAvatarClose();
                    logout();
                  }}
                  sx={{
                    fontSize: "0.875rem",
                    color: "error.main",
                    borderRadius: "8px",
                    py: 1,
                    "&:hover": {
                      backgroundColor: "rgba(220, 38, 38, 0.04)",
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
                borderColor: colorTokens.teal500,
                color: colorTokens.teal500,
                px: 2.5,
                py: 0.8,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 148, 157, 0.04)",
                  borderColor: colorTokens.teal600,
                },
              }}
            >
              Đăng nhập
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>

    <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
        Hướng dẫn sử dụng hệ thống dịch thuật Tranlix
      </DialogTitle>
      <DialogContent dividers sx={{ pb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colorTokens.neutral800 }}>
          1. Tải lên tài liệu
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          Nhấn nút <strong>"Tải lên tài liệu"</strong> ở trang chủ để chọn một hoặc nhiều tệp cần dịch (hỗ trợ .docx, .doc, .pptx, .ppt, .xlsx, .xls, .pdf, .png, .jpg, .jpeg). Bạn có thể tải lên tối đa 3 tệp cùng một lúc.
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colorTokens.neutral800 }}>
          2. Cấu hình ngôn ngữ và thuật ngữ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          Chọn ngôn ngữ đích cần dịch sang. Ngoài ra, bạn có thể chọn một hoặc nhiều bảng thuật ngữ để đảm bảo các từ khóa chuyên ngành được dịch chính xác theo ý muốn.
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colorTokens.neutral800 }}>
          3. Theo dõi tiến trình và Tải về
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
          Sau khi nhấn <strong>"Bắt đầu dịch"</strong>, hệ thống sẽ tự động điều hướng sang tab <strong>"Lịch sử dịch"</strong>. Tại đây, bạn có thể kiểm tra trạng thái dịch của từng tệp, mở tài liệu để đối chiếu song song thông qua OnlyOffice, hoặc tải trực tiếp bản dịch về máy.
        </Typography>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: colorTokens.neutral800 }}>
          4. Quản lý Thuật ngữ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Sử dụng tab <strong>"Thuật ngữ"</strong> trên thanh menu để tạo mới các bộ từ điển cá nhân, thêm các cặp từ gốc - từ dịch tương ứng và lưu trữ phục vụ cho các lần dịch sau.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => setHelpOpen(false)} variant="contained" color="primary" sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}>
          Đã hiểu
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
}