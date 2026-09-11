import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import tranlixLogo from "@/core/assets/tranlix.svg";
import { useAuth } from "@/shared/components/Layout/Header";
import { colorTokens } from "@/shared/styles/tokens";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(formData.username, formData.password);
    if (success) {
      navigate("/");
    } else {
      setError("Sai tên đăng nhập hoặc mật khẩu.");
    }
    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: colorTokens.neutral50,
      }}
    >
      {/* Left Panel: Brand Showcase (Hidden on Mobile) */}
      <Box
        sx={{
          flex: 1.2,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          p: 6,
          color: colorTokens.white,
          backgroundImage: `linear-gradient(135deg, ${colorTokens.blue500} 0%, ${colorTokens.wine500} 100%)`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-20%",
            left: "-20%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: "rgba(230, 246, 247, 0.15)",
            filter: "blur(80px)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background: "rgba(0, 148, 157, 0.2)",
            filter: "blur(100px)",
          },
        }}
      >
        {/* Header Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, zIndex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: '"Lexend", sans-serif',
              letterSpacing: "-0.5px",
            }}
          >
            Tranlix
          </Typography>
        </Box>

        {/* Feature Highlights */}
        <Box sx={{ zIndex: 1, my: "auto", maxWidth: "560px" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
              fontFamily: '"Lexend", sans-serif',
            }}
          >
            Hệ thống dịch tài liệu đa ngôn ngữ
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.85)",
              mb: 5,
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Giữ nguyên cấu trúc tài liệu gốc, xử lý tài liệu nhanh chóng, chính xác và bảo mật.
          </Typography>

        </Box>

        {/* Footer Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            pt: 3,
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} Tranlix.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            Công ty TNHH Phát triển và Đầu tư Việt An
          </Typography>
        </Box>
      </Box>

      {/* Right Panel: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "420px" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: "20px",
              backgroundColor: colorTokens.white,
              border: `1px solid ${colorTokens.neutral200}`,
              boxShadow: "0 10px 30px rgba(27, 75, 109, 0.04)",
            }}
          >
            {/* Greeting with Logo */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                mb: 4,
              }}
            >
              <img
                src={tranlixLogo}
                alt="Tranlix Logo"
                style={{
                  height: "44px",
                  width: "auto",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: colorTokens.neutral800,
                  fontFamily: '"Lexend", sans-serif',
                }}
              >
                Tranlix
              </Typography>
            </Box>


            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: "12px",
                  "& .MuiAlert-icon": {
                    alignItems: "center",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  id="username"
                  label="Tên đăng nhập"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  autoFocus
                  slotProps={{
                    input: {
                      style: { borderRadius: "10px" },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  slotProps={{
                    input: {
                      style: { borderRadius: "10px" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Ẩn/hiện mật khẩu"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            sx={{ color: colorTokens.neutral500 }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.6,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    borderRadius: "10px",
                    textTransform: "none",
                    boxShadow: `0 4px 14px rgba(0, 148, 157, 0.25)`,
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: `0 6px 20px rgba(0, 148, 157, 0.35)`,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: colorTokens.white,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </Stack>
            </Box>
          </Paper>

        </Box>
      </Box>
    </Box>
  );
}