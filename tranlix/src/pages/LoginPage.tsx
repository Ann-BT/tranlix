import { useState, useRef, useCallback, useEffect } from "react";
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
  Grid,
  Container,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  PersonOutlined,
  LockOutlined,
  CompareArrowsOutlined,
  VerifiedUserOutlined,
  DescriptionOutlined,
  SpeedOutlined,
  ShieldOutlined,
  AutoAwesomeOutlined,
  TranslateOutlined,
  StorageOutlined,
  PictureAsPdfOutlined,
  InsertDriveFileOutlined,
  TableChartOutlined,
  SlideshowOutlined,
  ImageOutlined,
  LightModeOutlined,
  DarkModeOutlined,
} from "@mui/icons-material";
import { useAuth } from "@/shared/context/AuthContext";
import { useColorMode } from "@/shared/styles";


export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Optimized Slogan Typewriter effect (Zero-Lag Closure Loop)
  const SLOGAN_PHRASES = ["An toàn và Nguyên vẹn!", "Protected and Preserved!"];
  const [typedSlogan, setTypedSlogan] = useState("An toàn và Nguyên vẹn!");

  useEffect(() => {
    let phraseIdx = 0;
    let charIdx = SLOGAN_PHRASES[0].length;
    let isDeleting = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const step = () => {
      const currentPhrase = SLOGAN_PHRASES[phraseIdx];

      if (isDeleting) {
        if (charIdx > 0) {
          charIdx--;
          setTypedSlogan(currentPhrase.substring(0, charIdx));
          timeoutId = setTimeout(step, 35);
        } else {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % SLOGAN_PHRASES.length;
          timeoutId = setTimeout(step, 350);
        }
      } else {
        if (charIdx < currentPhrase.length) {
          charIdx++;
          setTypedSlogan(currentPhrase.substring(0, charIdx));
          timeoutId = setTimeout(step, 70);
        } else {
          isDeleting = true;
          timeoutId = setTimeout(step, 2400); // Pause on completed text
        }
      }
    };

    timeoutId = setTimeout(step, 2400);
    return () => clearTimeout(timeoutId);
  }, []);

  const [activeSection, setActiveSection] = useState(0);
  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  const handleContainerScroll = () => {
    if (mainContainerRef.current) {
      const scrollTop = mainContainerRef.current.scrollTop;
      const clientHeight = mainContainerRef.current.clientHeight;
      if (scrollTop > clientHeight * 0.35) {
        setActiveSection(1);
        setIsScrolled(true);
      } else {
        setActiveSection(0);
        setIsScrolled(false);
      }
    }
  };

  const scrollToSection = (index: number) => {
    if (mainContainerRef.current) {
      const targetY = index * mainContainerRef.current.clientHeight;
      mainContainerRef.current.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  // Interactive Document Slider Refs & Direct DOM Manipulation (Zero React Re-renders during drag)
  const isDraggingDocRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vietSheetRef = useRef<HTMLDivElement | null>(null);
  const sliderHandleRef = useRef<HTMLDivElement | null>(null);

  const updateSliderUI = useCallback((posPercentage: number) => {
    if (vietSheetRef.current) {
      vietSheetRef.current.style.clipPath = `polygon(0 0, 100% 0, 100% ${posPercentage}%, 0 ${posPercentage}%)`;
    }
    if (sliderHandleRef.current) {
      sliderHandleRef.current.style.top = `${posPercentage}%`;
    }
  }, []);

  // Smooth slow laser scanning animation across entire document (10% to 90%)
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const animateSlider = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      if (!isDraggingDocRef.current) {
        const elapsed = (timestamp - startTime) / 1000;
        // Ultra-smooth 0.35 speed sine wave (scans slowly from top 10% to bottom 90% without lag)
        const pos = 50 + Math.sin(elapsed * 0.35) * 40;
        updateSliderUI(pos);
      }
      animationFrameId = requestAnimationFrame(animateSlider);
    };

    animationFrameId = requestAnimationFrame(animateSlider);
    return () => cancelAnimationFrame(animationFrameId);
  }, [updateSliderUI]);

  const handleSliderMove = useCallback((clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const percentage = Math.max(5, Math.min(95, (y / rect.height) * 100));
    updateSliderUI(percentage);
  }, [updateSliderUI]);

  const handleDocMouseDown = (e: React.MouseEvent) => {
    isDraggingDocRef.current = true;
    handleSliderMove(e.clientY);
  };

  const handleDocMouseMove = (e: React.MouseEvent) => {
    if (isDraggingDocRef.current) {
      handleSliderMove(e.clientY);
    }
  };

  const handleDocMouseUp = () => {
    isDraggingDocRef.current = false;
  };

  const handleDocTouchStart = (e: React.TouchEvent) => {
    isDraggingDocRef.current = true;
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientY);
    }
  };

  const handleDocTouchMove = (e: React.TouchEvent) => {
    if (isDraggingDocRef.current && e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientY);
    }
  };

  const handleDocTouchEnd = () => {
    isDraggingDocRef.current = false;
  };

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
      setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
    setLoading(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Design Tokens
  const isDark = mode === "dark";
  const canvasColor = isDark ? "#020C1B" : "#F4F7FB";
  const surfaceColor = isDark ? "#071428" : "#FFFFFF";
  const borderColor = isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(0, 0, 0, 0.09)";
  const greenAccent = isDark ? "#10B981" : "#059669";
  const textPrimary = isDark ? "#E8F4FF" : "#0A1929";
  const textSecondary = isDark ? "#6B8EB0" : "#4A6080";

  return (
    <Box
      ref={mainContainerRef}
      onScroll={handleContainerScroll}
      onMouseUp={handleDocMouseUp}
      onMouseLeave={handleDocMouseUp}
      sx={{
        height: "100vh",
        width: "100%",
        backgroundColor: canvasColor,
        color: textPrimary,
        position: "relative",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": { display: "none" },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {/* Floating 2-Section Page Navigation Indicator Dots */}
      <Box sx={{
        position: "fixed",
        right: { xs: 12, md: 24 },
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 95,
        display: "flex",
        flexDirection: "column",
        gap: 1.6,
        p: 1.2,
        borderRadius: "20px",
        backgroundColor: isDark ? "rgba(7, 20, 40, 0.45)" : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${borderColor}`,
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 15px rgba(0,0,0,0.06)",
      }}>
        <Tooltip title="Trang chủ & Đăng nhập" placement="left">
          <Box
            onClick={() => scrollToSection(0)}
            sx={{
              width: 10,
              height: activeSection === 0 ? 26 : 10,
              borderRadius: "10px",
              backgroundColor: activeSection === 0 ? greenAccent : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"),
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: activeSection === 0 ? `0 0 12px ${greenAccent}` : "none",
              "&:hover": {
                backgroundColor: greenAccent,
                transform: "scale(1.2)",
              },
            }}
          />
        </Tooltip>
        <Tooltip title="Tính năng chính" placement="left">
          <Box
            onClick={() => scrollToSection(1)}
            sx={{
              width: 10,
              height: activeSection === 1 ? 26 : 10,
              borderRadius: "10px",
              backgroundColor: activeSection === 1 ? greenAccent : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"),
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: activeSection === 1 ? `0 0 12px ${greenAccent}` : "none",
              "&:hover": {
                backgroundColor: greenAccent,
                transform: "scale(1.2)",
              },
            }}
          />
        </Tooltip>
      </Box>
      {/* Top Floating Theme Toggle Button */}
      <Box sx={{ position: "absolute", top: 16, right: 24, zIndex: 90 }}>
        <Tooltip title={isDark ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}>
          <IconButton
            onClick={toggleColorMode}
            sx={{
              color: textPrimary,
              bgcolor: surfaceColor,
              backdropFilter: "blur(8px)",
              border: "1px solid",
              borderColor: borderColor,
              boxShadow: isDark ? "0 4px 14px rgba(0, 0, 0, 0.3)" : "0 4px 14px rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                color: greenAccent,
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(5, 150, 105, 0.1)",
                borderColor: greenAccent,
                transform: "rotate(15deg)",
              },
            }}
          >
            {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Dynamic Navigation Header (Only visible when scrolled down) */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: isDark ? "rgba(7, 20, 40, 0.92)" : "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: borderColor,
          px: { xs: 3, md: 6 },
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          boxShadow: isDark ? "0 4px 25px rgba(0, 0, 0, 0.4)" : "0 2px 15px rgba(0, 0, 0, 0.05)",
          transform: isScrolled ? "translateY(0)" : "translateY(-100%)",
          opacity: isScrolled ? 1 : 0,
          visibility: isScrolled ? "visible" : "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Left Brand Identity */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
              variant="h5"
              sx={{
                fontWeight: 400,
                fontFamily: '"Lexend", sans-serif',
                color: textPrimary,
                lineHeight: 1,
                fontSize: "1.35rem",
                letterSpacing: "-0.5px",
              }}
            >
              TRANLIX
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: textSecondary,
                fontFamily: '"Play", sans-serif',
                fontSize: "0.74rem",
                fontWeight: 400,
                display: "block",
                mt: 0.2,
              }}
            >
              {typedSlogan}
            </Typography>
          </Box>
        </Box>

        {/* Right Action: Light/Dark Mode Toggle & Login Trigger Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title={isDark ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}>
            <IconButton
              onClick={toggleColorMode}
              sx={{
                color: textSecondary,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: greenAccent,
                  backgroundColor: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(5, 150, 105, 0.1)",
                  transform: "rotate(15deg)",
                },
              }}
            >
              {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            onClick={() => scrollToSection(0)}
            sx={{
              py: 0.8,
              px: 2.8,
              borderRadius: "4px",
              fontFamily: '"Lexend", sans-serif',
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "none",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              "&:hover": {
                backgroundColor: "#059669",
              },
            }}
          >
            Đăng nhập
          </Button>
        </Box>
      </Box>

      {/* SECTION 1: HERO LANDING & LOGIN (100VH SNAP) */}
      <Box
        sx={{
          height: "100vh",
          minHeight: "100vh",
          maxHeight: "100vh",
          width: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          py: { xs: 2, md: 1 },
          boxSizing: "border-box",
          overflow: "hidden",
          backgroundColor: isDark ? "#020C1B" : "#F4F8FC",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          flexShrink: 0,
        }}
      >
        {/* Organic Bottom-Left Fluid Mint Wave Gradient */}
        <Box sx={{
          position: "absolute",
          bottom: "-20%",
          left: "-15%",
          width: "60vw",
          height: "50vw",
          maxWidth: "900px",
          maxHeight: "800px",
          zIndex: 0,
          pointerEvents: "none",
          background: isDark
            ? "radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.22) 0%, rgba(20, 184, 166, 0.12) 35%, rgba(14, 116, 144, 0.05) 65%, transparent 85%)"
            : "radial-gradient(ellipse at bottom left, rgba(16, 185, 129, 0.24) 0%, rgba(45, 212, 191, 0.20) 35%, rgba(186, 230, 253, 0.45) 65%, transparent 85%)",
          filter: "blur(40px)",
        }} />

        {/* Secondary Organic Wave SVG Paths */}
        <Box component="svg" sx={{
          position: "absolute",
          bottom: 0, left: 0, width: "45vw", height: "35vh",
          zIndex: 0, pointerEvents: "none", opacity: isDark ? 0.2 : 0.45
        }} viewBox="0 0 500 300" fill="none">
          <path d="M -50 350 C 120 270, 260 310, 460 170 C 530 120, 590 70, 660 -30" stroke={isDark ? "#10B981" : "#2DD4BF"} strokeWidth="2.5" strokeDasharray="6 6" />
          <path d="M -20 380 C 150 240, 310 270, 520 110" stroke={isDark ? "#0EA5E9" : "#38BDF8"} strokeWidth="1.5" />
        </Box>

        {/* Connecting Radial Dotted Arch Circle behind hero center */}
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "78vw",
          height: "78vw",
          maxWidth: "1150px",
          maxHeight: "1150px",
          borderRadius: "50%",
          border: `1.5px dashed ${isDark ? "rgba(16, 185, 129, 0.14)" : "rgba(16, 185, 129, 0.22)"}`,
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* Animated Aurora Glow 1 - Top Right */}
        <Box sx={{
          position: "absolute", width: "45vw", height: "45vw", borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(7,36,92,0.6) 0%, rgba(14,60,150,0.2) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(186,220,255,0.7) 0%, rgba(150,200,255,0.18) 50%, transparent 70%)",
          top: "-10%", right: "-5%", zIndex: 0, pointerEvents: "none",
          animation: "auroraBlob2 15s ease-in-out infinite",
          "@keyframes auroraBlob2": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(-3vw, 4vh) scale(1.1)" },
          },
        }} />

        {/* Fine Dot Grid Pattern Overlay */}
        <Box sx={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(16,185,129,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        {/* FLOATING DECORATION 1: Top-Left DOCX Card */}
        <Box sx={{
          position: "absolute",
          top: { lg: "16%", xl: "18%" },
          left: { lg: "2.5%", xl: "4%" },
          zIndex: 0,
          pointerEvents: "none",
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          gap: 1.5,
          opacity: isDark ? 0.55 : 0.75,
          transform: "rotate(-6deg)",
          transition: "all 0.5s ease",
        }}>
          <Box sx={{
            width: 72, height: 92,
            borderRadius: "14px",
            border: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
            backgroundColor: isDark ? "rgba(7,20,40,0.5)" : "rgba(255,255,255,0.85)",
            boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,60,120,0.06)",
            backdropFilter: "blur(6px)",
            p: 1.4, position: "relative",
          }}>
            <Box sx={{
              position: "absolute", top: 0, right: 0, width: 18, height: 18,
              borderBottom: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
              borderLeft: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
              backgroundColor: isDark ? "#0A1929" : "#EAF2F8",
              borderBottomLeftRadius: "5px",
            }} />
            <Box sx={{ width: "65%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.2)" : "#B0CFE3", mb: 1.2, mt: 0.5 }} />
            <Box sx={{ width: "88%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE", mb: 1.2 }} />
            <Box sx={{ width: "75%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE", mb: 1.2 }} />
            <Box sx={{ width: "50%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE" }} />
          </Box>
          <Box sx={{
            px: 1.4, py: 0.6, borderRadius: "10px",
            border: `1.5px solid ${isDark ? "rgba(16,185,129,0.4)" : "#BCE0ED"}`,
            backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "#FFFFFF",
            color: isDark ? "#10B981" : "#5192B0",
            fontSize: "0.82rem", fontWeight: 700,
            fontFamily: '"Lexend", sans-serif',
            boxShadow: "0 4px 14px rgba(0,60,120,0.05)",
          }}>
            DOCX
          </Box>
        </Box>

        {/* FLOATING DECORATION 2: Bottom-Left XLSX & PDF Card */}
        <Box sx={{
          position: "absolute",
          bottom: { lg: "16%", xl: "18%" },
          left: { lg: "2.5%", xl: "4%" },
          zIndex: 0,
          pointerEvents: "none",
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          gap: 1.5,
          opacity: isDark ? 0.55 : 0.75,
          transform: "rotate(5deg)",
          transition: "all 0.5s ease",
        }}>
          <Box sx={{
            width: 72, height: 92,
            borderRadius: "14px",
            border: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
            backgroundColor: isDark ? "rgba(7,20,40,0.5)" : "rgba(255,255,255,0.85)",
            boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,60,120,0.06)",
            backdropFilter: "blur(6px)",
            p: 1.4, position: "relative",
          }}>
            <Box sx={{
              position: "absolute", top: 0, right: 0, width: 18, height: 18,
              borderBottom: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
              borderLeft: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
              backgroundColor: isDark ? "#0A1929" : "#EAF2F8",
              borderBottomLeftRadius: "5px",
            }} />
            <Box sx={{ width: "65%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.2)" : "#B0CFE3", mb: 1.2, mt: 0.5 }} />
            <Box sx={{ width: "88%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE", mb: 1.2 }} />
            <Box sx={{ width: "75%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE", mb: 1.2 }} />
            <Box sx={{ width: "50%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE" }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.9 }}>
            <Box sx={{
              px: 1.4, py: 0.5, borderRadius: "10px",
              border: `1.5px solid ${isDark ? "rgba(16,185,129,0.4)" : "#BCE0ED"}`,
              backgroundColor: isDark ? "rgba(16,185,129,0.12)" : "#FFFFFF",
              color: isDark ? "#10B981" : "#5192B0",
              fontSize: "0.8rem", fontWeight: 700,
              fontFamily: '"Lexend", sans-serif',
              boxShadow: "0 4px 14px rgba(0,60,120,0.05)",
            }}>
              XLSX
            </Box>
            <Box sx={{
              px: 1.4, py: 0.5, borderRadius: "10px",
              border: `1.5px solid ${isDark ? "rgba(16,185,129,0.4)" : "#D2E0EC"}`,
              backgroundColor: isDark ? "rgba(16,185,129,0.06)" : "#FFFFFF",
              color: isDark ? "#6B8EB0" : "#86A8C2",
              fontSize: "0.8rem", fontWeight: 700,
              fontFamily: '"Lexend", sans-serif',
              boxShadow: "0 4px 14px rgba(0,60,120,0.05)",
            }}>
              PDF
            </Box>
          </Box>
        </Box>

        {/* FLOATING DECORATION 3: Top-Right Translation Character Icon Card */}
        <Box sx={{
          position: "absolute",
          top: { lg: "15%", xl: "17%" },
          right: { lg: "2.5%", xl: "3.5%" },
          zIndex: 0,
          pointerEvents: "none",
          display: { xs: "none", lg: "flex" },
          alignItems: "center",
          justifyContent: "center",
          width: 76, height: 76,
          borderRadius: "18px",
          border: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
          backgroundColor: isDark ? "rgba(7,20,40,0.5)" : "rgba(255,255,255,0.85)",
          boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,60,120,0.06)",
          backdropFilter: "blur(6px)",
          opacity: isDark ? 0.55 : 0.75,
          transform: "rotate(8deg)",
          transition: "all 0.5s ease",
        }}>
          <Box sx={{
            display: "flex", gap: 0.5, alignItems: "center",
            fontFamily: '"Lexend", sans-serif',
            fontWeight: 600,
          }}>
            <Typography component="span" sx={{ fontSize: "1.15rem", color: isDark ? "#94A3B8" : "#8AA9C1", fontFamily: '"Lexend", sans-serif' }}>A</Typography>
            <Typography component="span" sx={{ fontSize: "1.3rem", color: isDark ? "#10B981" : "#5192B0", fontWeight: 700 }}>文</Typography>
          </Box>
        </Box>

        {/* FLOATING DECORATION 4: Middle-Right Document Card */}
        <Box sx={{
          position: "absolute",
          top: { lg: "45%", xl: "47%" },
          right: { lg: "2.5%", xl: "3.5%" },
          zIndex: 0,
          pointerEvents: "none",
          display: { xs: "none", lg: "flex" },
          width: 68, height: 88,
          borderRadius: "14px",
          border: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
          backgroundColor: isDark ? "rgba(7,20,40,0.5)" : "rgba(255,255,255,0.85)",
          boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,60,120,0.06)",
          backdropFilter: "blur(6px)",
          p: 1.4,
          opacity: isDark ? 0.55 : 0.75,
          transform: "rotate(-4deg)",
          transition: "all 0.5s ease",
        }}>
          <Box sx={{
            position: "absolute", top: 0, right: 0, width: 16, height: 16,
            borderBottom: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
            borderLeft: `2px solid ${isDark ? "rgba(16,185,129,0.3)" : "#D1E2EE"}`,
            backgroundColor: isDark ? "#0A1929" : "#EAF2F8",
            borderBottomLeftRadius: "5px",
          }} />
          <Box sx={{ width: "65%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.2)" : "#B0CFE3", mb: 1.2, mt: 0.5 }} />
          <Box sx={{ width: "88%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE", mb: 1.2 }} />
          <Box sx={{ width: "75%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE", mb: 1.2 }} />
          <Box sx={{ width: "50%", height: 3.5, borderRadius: 2, bgcolor: isDark ? "rgba(255,255,255,0.15)" : "#D0E2EE" }} />
        </Box>

        {/* FLOATING DECORATION 5: Bottom-Right Cursive Handwriting & Underline */}
        <Box sx={{
          position: "absolute",
          bottom: { lg: "14%", xl: "16%" },
          right: { lg: "2.2%", xl: "3.5%" },
          zIndex: 0,
          pointerEvents: "none",
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          alignItems: "flex-start",
          opacity: isDark ? 0.65 : 0.8,
          transform: "rotate(-6deg)",
          transition: "all 0.5s ease",
        }}>
          <Typography sx={{
            fontFamily: '"Patrick Hand", "Itim", cursive',
            fontSize: "1.45rem",
            fontWeight: 400,
            color: isDark ? "#6B8EB0" : "#85A6C0",
            lineHeight: 1.35,
            letterSpacing: "0.5px",
          }}>
            Dịch thuật<br />
            Nhanh chóng<br />
            Chính xác<br />
            Bảo mật
          </Typography>
          {/* Organic Green Underline Gesture */}
          <Box component="svg" width="105" height="14" viewBox="0 0 105 14" fill="none" sx={{ mt: 0.4 }}>
            <path
              d="M 4 9 C 28 2, 68 11, 101 4"
              stroke="#10B981"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.85"
            />
          </Box>
        </Box>

        <Container maxWidth="xl" sx={{ zIndex: 1, position: "relative" }}>
          {/* Hero Main Grid Layout: Login (Left) & Document Compare Demo (Right) */}
          <Grid container spacing={{ xs: 3, md: 4, lg: 5 }} sx={{ alignItems: "center", justifyContent: "center" }}>
            {/* Left Column: Direct Login Form with Brand Header above it */}
            <Grid size={{ xs: 12, md: 5, lg: 4.8 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "420px",
                  mx: "auto",
                }}
              >
                {/* Brand Header & Slogan ABOVE the Login Card */}
                <Box
                  sx={{
                    textAlign: "center",
                    mb: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 54 },
                      height: { xs: 48, sm: 54 },
                      borderRadius: "12px",
                      bgcolor: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 0.8,
                      mb: 0.8,
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08)",
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
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 400,
                      fontFamily: '"Lexend", sans-serif',
                      fontSize: { xs: "1.8rem", sm: "2.1rem" },
                      color: textPrimary,
                      lineHeight: 1.1,
                      letterSpacing: "-0.5px",
                      display: "inline-block",
                      mb: 0.2,
                      textShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "none",
                    }}
                  >
                    TRANLIX
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 400,
                      fontFamily: '"Play", sans-serif',
                      color: textSecondary,
                      fontSize: { xs: "1.1rem", sm: "1.3rem" },
                      letterSpacing: "0.5px",
                      minHeight: "2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {typedSlogan}
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        width: "2px",
                        height: "1em",
                        backgroundColor: greenAccent,
                        ml: 0.5,
                        animation: "blink 0.8s infinite",
                        "@keyframes blink": {
                          "0%, 100%": { opacity: 1 },
                          "50%": { opacity: 0 },
                        },
                      }}
                    />
                  </Typography>
                </Box>

                {/* Login Card Wrapper Box */}
                <Box sx={{ position: "relative", width: "100%" }}>
                  {/* Login Form Paper */}
                  <Paper
                    elevation={0}
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      p: { xs: 2.5, sm: 3 },
                      borderRadius: "10px",
                      backgroundColor: isDark ? "rgba(10, 20, 45, 0.92)" : "rgba(255,255,255,0.97)",
                      backdropFilter: "blur(20px)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                      boxShadow: isDark
                        ? "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.08)"
                        : "0 20px 48px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Box>
                      <Box sx={{ mb: 1.8, textAlign: "left" }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: textPrimary,
                            fontFamily: '"Lexend", sans-serif',
                            fontSize: "1.25rem",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          Đăng nhập
                        </Typography>
                      </Box>

                      {error && (
                        <Alert
                          severity="error"
                          sx={{
                            mb: 3,
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            py: 0.5,
                          }}
                        >
                          {error}
                        </Alert>
                      )}

                      <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2.5}>
                          <TextField
                            fullWidth
                            size="medium"
                            id="username"
                            label="Tên đăng nhập"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start" sx={{ mr: 1 }}>
                                    <PersonOutlined sx={{ color: greenAccent, fontSize: 20 }} />
                                  </InputAdornment>
                                ),
                                style: { borderRadius: "6px", color: textPrimary, height: "46px" },
                              },
                            }}
                            sx={{
                              "& .MuiInputLabel-root": { color: textSecondary, fontSize: "0.9rem" },
                              "& .MuiInputLabel-root.Mui-focused": { color: greenAccent, fontWeight: 600 },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                                "& fieldset": { borderColor: borderColor },
                                "&:hover fieldset": { borderColor: greenAccent },
                                "&.Mui-focused fieldset": { borderColor: greenAccent },
                              },
                            }}
                          />

                          <TextField
                            fullWidth
                            size="medium"
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
                                startAdornment: (
                                  <InputAdornment position="start" sx={{ mr: 1 }}>
                                    <LockOutlined sx={{ color: greenAccent, fontSize: 20 }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="Ẩn/hiện mật khẩu"
                                      onClick={handleTogglePasswordVisibility}
                                      edge="end"
                                      size="small"
                                      sx={{ color: textSecondary }}
                                    >
                                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                                style: { borderRadius: "6px", color: textPrimary, height: "46px" },
                              },
                            }}
                            sx={{
                              "& .MuiInputLabel-root": { color: textSecondary, fontSize: "0.9rem" },
                              "& .MuiInputLabel-root.Mui-focused": { color: greenAccent, fontWeight: 600 },
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                                "& fieldset": { borderColor: borderColor },
                                "&:hover fieldset": { borderColor: greenAccent },
                                "&.Mui-focused fieldset": { borderColor: greenAccent },
                              },
                            }}
                          />

                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                              py: 1.4,
                              mt: 0.5,
                              fontFamily: '"Lexend", sans-serif',
                              fontWeight: 700,
                              fontSize: "0.98rem",
                              borderRadius: "6px",
                              textTransform: "none",
                              color: "#FFFFFF",
                              backgroundColor: "#10B981",
                              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.4)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                backgroundColor: "#059669",
                                boxShadow: "0 6px 24px rgba(16, 185, 129, 0.5)",
                              },
                            }}
                          >
                            {loading ? <CircularProgress size={22} sx={{ color: "#FFFFFF" }} /> : "Đăng nhập ngay →"}
                          </Button>
                        </Stack>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Interactive Document Compare Slider Demo */}
            <Grid size={{ xs: 12, md: 7, lg: 7.2 }}>
              <Paper
                ref={containerRef}
                onMouseDown={handleDocMouseDown}
                onMouseMove={handleDocMouseMove}
                onMouseUp={handleDocMouseUp}
                onMouseLeave={handleDocMouseUp}
                onTouchStart={handleDocTouchStart}
                onTouchMove={handleDocTouchMove}
                onTouchEnd={handleDocTouchEnd}
                elevation={0}
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: "100%", sm: "480px", md: "520px", lg: "560px" },
                  maxHeight: { md: "calc(100vh - 40px)" },
                  aspectRatio: "1 / 1.36",
                  mx: "auto",
                  borderRadius: "8px",
                  overflow: "visible",
                  userSelect: "none",
                  cursor: "row-resize",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.25)" : "1px solid rgba(0, 0, 0, 0.12)",
                  boxShadow: isDark
                    ? "0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(16,185,129,0.15)"
                    : "0 15px 40px rgba(0,0,0,0.10), 0 0 20px rgba(5,150,105,0.10)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                  {/* Base Layer: English Document Sheet */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      p: { xs: 2.2, md: 2.8 },
                      backgroundColor: "#FFFFFF",
                      color: "#0F172A",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      fontFamily: '"Times New Roman", Times, serif',
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Box>
                      <Box sx={{ textAlign: "center", mb: 1, pb: 0.6, borderBottom: `2px solid #0F172A` }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            color: "#0F172A",
                            display: "block",
                            fontFamily: '"Times New Roman", serif',
                            fontSize: "0.82rem",
                            lineHeight: 1.2,
                          }}
                        >
                          SOCIALIST REPUBLIC OF VIETNAM
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: "#334155", display: "block", fontSize: "0.72rem", lineHeight: 1.2, mt: 0.2 }}
                        >
                          Independence - Freedom - Happiness
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, color: "#475569", fontFamily: '"Lexend", sans-serif', fontSize: "0.72rem" }}
                        >
                          🇬🇧 ORIGINAL DOCUMENT • REF: TRX-2026/EN
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748B", fontFamily: '"Lexend", sans-serif', fontWeight: 600, fontSize: "0.72rem" }}
                        >
                          DATE: 2026-09-12
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          textAlign: "center",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "#0F172A",
                          fontSize: "0.95rem",
                          my: 1.2,
                          lineHeight: 1.2,
                        }}
                      >
                        INTERNAL TRANSLATION PROCESS NOTICE
                      </Typography>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Article 1 (Scope & Format Support):</strong> The system supports direct translation processing for Microsoft Office (.DOCX, .XLSX, .PPTX) and PDF files.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Article 2 (Layout & Formatting):</strong> Core layout features attempt to preserve table grids, font sizes, text alignments, and embedded image positions.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Article 3 (Infrastructure Security):</strong> Data processing operates within dedicated On-Premise network architecture using standard AES-256 encryption.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Article 4 (Terminology Glossaries):</strong> Organization glossaries allow custom term mapping for technical vocabulary across document sets.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Article 5 (Dual Document Verification):</strong> Synchronized visual review panels enable side-by-side comparison between original and translated output.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Article 6 (Batch File Execution):</strong> Automated queueing processes multiple file requests sequentially with individual status tracking.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Article 7 (Translation History):</strong> Central storage maintains operational log records and downloadable converted files for department audits.
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          border: `1px solid #CBD5E1`,
                          borderRadius: "2px",
                          overflow: "hidden",
                          my: 1,
                          fontSize: "0.72rem",
                          fontFamily: '"Lexend", sans-serif',
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            backgroundColor: "#F1F5F9",
                            p: 0.6,
                            fontWeight: 700,
                            borderBottom: `1px solid #CBD5E1`,
                            color: "#0F172A",
                          }}
                        >
                          <Box sx={{ flex: 1.2 }}>Feature Module</Box>
                          <Box sx={{ flex: 1 }}>Technical Specification</Box>
                          <Box sx={{ flex: 1 }}>Deployment Mode</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6, borderBottom: "1px solid #E2E8F0" }}>
                          <Box sx={{ flex: 1.2 }}>File Parsing</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>.DOCX / .XLSX / .PPTX / .PDF</Box>
                          <Box sx={{ flex: 1 }}>Local Processing</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6, borderBottom: "1px solid #E2E8F0" }}>
                          <Box sx={{ flex: 1.2 }}>Custom Glossary</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>Domain Terminology</Box>
                          <Box sx={{ flex: 1 }}>AES-256 Storage</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6, borderBottom: "1px solid #E2E8F0" }}>
                          <Box sx={{ flex: 1.2 }}>Viewer Integration</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>Side-by-Side Mode</Box>
                          <Box sx={{ flex: 1 }}>Web Client Only</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6 }}>
                          <Box sx={{ flex: 1.2 }}>Data History</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>Audit Logs & Archive</Box>
                          <Box sx={{ flex: 1 }}>On-Premise Network</Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 0.8,
                        borderTop: `1px dashed #CBD5E1`,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "#64748B", fontWeight: 600, fontFamily: '"Lexend", sans-serif', fontSize: "0.7rem" }}
                        >
                          AUTHORIZED SIGNATURE
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontStyle: "italic", fontWeight: 700, color: "#0F172A", fontSize: "0.82rem" }}
                        >
                          Executive Director
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          border: `2px double #10B981`,
                          color: "#10B981",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: "rotate(-12deg)",
                          opacity: 0.9,
                        }}
                      >
                        <VerifiedUserOutlined sx={{ fontSize: 16 }} />
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.48rem", fontWeight: 800, textAlign: "center", lineHeight: 1 }}
                        >
                          OFFICIAL SEAL
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Top Layer: Vietnamese Document Sheet (Vertical Clip) */}
                  <Box
                    ref={vietSheetRef}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      p: { xs: 2.2, md: 2.8 },
                      backgroundColor: "#FFFFFF",
                      color: "#0F172A",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      fontFamily: '"Times New Roman", Times, serif',
                      clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                      willChange: "clip-path",
                      borderBottom: "2px solid #E11D48",
                      transform: "translateZ(0)",
                    }}
                  >
                    <Box>
                      <Box sx={{ textAlign: "center", mb: 1, pb: 0.6, borderBottom: `2px solid #0F172A` }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            color: "#0F172A",
                            display: "block",
                            fontFamily: '"Times New Roman", serif',
                            fontSize: "0.82rem",
                            lineHeight: 1.2,
                          }}
                        >
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 600, color: "#334155", display: "block", fontSize: "0.72rem", lineHeight: 1.2, mt: 0.2 }}
                        >
                          Độc lập - Tự do - Hạnh phúc
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, color: "#475569", fontFamily: '"Lexend", sans-serif', fontSize: "0.72rem" }}
                        >
                          🇻🇳 BẢN DỊCH TIẾNG VIỆT • REF: TRX-2026/VN
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748B", fontFamily: '"Lexend", sans-serif', fontWeight: 600, fontSize: "0.72rem" }}
                        >
                          DATE: 2026-09-12
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          textAlign: "center",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          color: "#0F172A",
                          fontSize: "0.95rem",
                          my: 1.2,
                          lineHeight: 1.2,
                        }}
                      >
                        THÔNG BÁO QUY TRÌNH DỊCH THUẬT NỘI BỘ
                      </Typography>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Điều 1 (Phạm vi & Định dạng):</strong> Hệ thống hỗ trợ xử lý dịch thuật trực tiếp trên các định dạng Microsoft Office (.DOCX, .XLSX, .PPTX) và tài liệu .PDF.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Điều 2 (Bố cục & Định dạng):</strong> Tính năng cốt lõi duy trì cấu trúc khung bảng, cỡ chữ, căn lề và vị trí hình ảnh chèn trong tài liệu gốc.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Điều 3 (Bảo mật Hạ tầng):</strong> Quá trình xử lý văn bản vận hành trong hạ tầng On-Premise nội bộ kết hợp chuẩn mã hóa dữ liệu AES-256.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Điều 4 (Bộ Từ điển Thuật ngữ):</strong> Cho phép tùy chỉnh và áp dụng nhất quán danh mục từ vựng chuyên ngành cho từng nhóm tài liệu tổ chức.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Điều 5 (Đối chiếu Trực quan):</strong> Giao diện xem song song hỗ trợ kiểm tra và đối chiếu nhanh giữa tài liệu gốc và kết quả bản dịch.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Điều 6 (Xử lý Hàng loạt):</strong> Cơ chế hàng đợi tự động tiếp nhận và xử lý danh sách tài liệu theo thứ tự kèm trạng thái tiến độ trực tiếp.
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 0.9 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: "0.78rem", color: "#334155" }}>
                          <strong>Điều 7 (Lịch sử & Lưu trữ):</strong> Kho dữ liệu lưu trữ nhật ký thao tác và cho phép tải xuống các file đã hoàn thành phục vụ kiểm tra nội bộ.
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          border: `1px solid #CBD5E1`,
                          borderRadius: "2px",
                          overflow: "hidden",
                          my: 1,
                          fontSize: "0.72rem",
                          fontFamily: '"Lexend", sans-serif',
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            backgroundColor: "#F1F5F9",
                            p: 0.6,
                            fontWeight: 700,
                            borderBottom: `1px solid #CBD5E1`,
                            color: "#0F172A",
                          }}
                        >
                          <Box sx={{ flex: 1.2 }}>Phân hệ Tính năng</Box>
                          <Box sx={{ flex: 1 }}>Thông số Kỹ thuật</Box>
                          <Box sx={{ flex: 1 }}>Môi trường Triển khai</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6, borderBottom: "1px solid #E2E8F0" }}>
                          <Box sx={{ flex: 1.2 }}>Phân tích Định dạng</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>.DOCX / .XLSX / .PPTX / .PDF</Box>
                          <Box sx={{ flex: 1 }}>Xử lý Nội bộ</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6, borderBottom: "1px solid #E2E8F0" }}>
                          <Box sx={{ flex: 1.2 }}>Từ điển Thuật ngữ</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>Quản lý Danh mục</Box>
                          <Box sx={{ flex: 1 }}>Lưu trữ AES-256</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6, borderBottom: "1px solid #E2E8F0" }}>
                          <Box sx={{ flex: 1.2 }}>Trình xem Đối chiếu</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>Chế độ Song song</Box>
                          <Box sx={{ flex: 1 }}>Giao diện Web Client</Box>
                        </Box>
                        <Box sx={{ display: "flex", p: 0.6 }}>
                          <Box sx={{ flex: 1.2 }}>Lưu trữ Nhật ký</Box>
                          <Box sx={{ flex: 1, color: "#10B981", fontWeight: 700 }}>Nhật ký Thao tác & File</Box>
                          <Box sx={{ flex: 1 }}>Mạng Nội bộ On-Premise</Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 0.8,
                        borderTop: `1px dashed #CBD5E1`,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", color: "#64748B", fontWeight: 600, fontFamily: '"Lexend", sans-serif', fontSize: "0.7rem" }}
                        >
                          CHỮ KÝ XÁC NHẬN
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontStyle: "italic", fontWeight: 700, color: "#0F172A", fontSize: "0.82rem" }}
                        >
                          Giám đốc Điều hành
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          border: `2px double #10B981`,
                          color: "#10B981",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: "rotate(-12deg)",
                          opacity: 0.9,
                        }}
                      >
                        <VerifiedUserOutlined sx={{ fontSize: 16 }} />
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.48rem", fontWeight: 800, textAlign: "center", lineHeight: 1 }}
                        >
                          ĐÃ PHÊ DUYỆT
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Active Laser Scanner Line & Outer Scanner Machine Head Assembly */}
                  <Box
                    ref={sliderHandleRef}
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: "50%",
                      height: "3px",
                      background: "linear-gradient(90deg, #10B981 0%, #6EE7B7 30%, #10B981 70%, rgba(16,185,129,0.4) 100%)",
                      boxShadow: "0 0 14px #10B981, 0 0 28px rgba(16, 185, 129, 0.75), 0 0 2px #FFFFFF",
                      transform: "translateY(-50%) translateZ(0)",
                      zIndex: 30,
                      pointerEvents: "none",
                      willChange: "top",
                    }}
                  >
                    {/* Top & Bottom Laser Light Beam Wash */}
                    <Box sx={{
                      position: "absolute",
                      top: -10, left: 0, right: 0, height: 10,
                      background: "linear-gradient(to top, rgba(16, 185, 129, 0.18), transparent)",
                      pointerEvents: "none",
                    }} />
                    <Box sx={{
                      position: "absolute",
                      bottom: -10, left: 0, right: 0, height: 10,
                      background: "linear-gradient(to bottom, rgba(16, 185, 129, 0.18), transparent)",
                      pointerEvents: "none",
                    }} />

                    {/* Outer Theme-Aware Scanner Machine Head (Positioned OUTSIDE on the left side of document) */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: -116,
                        transform: "translateY(-50%)",
                        width: 116,
                        height: 38,
                        borderRadius: "8px 0 0 8px",
                        background: isDark
                          ? "linear-gradient(135deg, #0D1F3C 0%, #071428 100%)"
                          : "linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)",
                        border: `1.5px solid ${greenAccent}`,
                        borderRight: "none",
                        boxShadow: isDark
                          ? "-6px 0 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.35)"
                          : "-4px 0 15px rgba(16, 185, 129, 0.25), 0 4px 15px rgba(0, 0, 0, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.2,
                        boxSizing: "border-box",
                        transition: "background 0.3s ease, border-color 0.3s ease",
                      }}
                    >
                      {/* Left: Pulsing LED Lens & "Kéo để dịch ↕" Text */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <Box sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: greenAccent,
                          boxShadow: `0 0 8px ${greenAccent}, 0 0 12px ${greenAccent}`,
                          animation: "scannerLedPulse 1.5s ease-in-out infinite",
                          "@keyframes scannerLedPulse": {
                            "0%, 100%": { opacity: 1, transform: "scale(1)" },
                            "50%": { opacity: 0.5, transform: "scale(0.85)" },
                          },
                        }} />
                        <Typography sx={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          fontFamily: '"Lexend", sans-serif',
                          color: textPrimary,
                          letterSpacing: "0.2px",
                          whiteSpace: "nowrap",
                        }}>
                          Kéo để dịch ↕
                        </Typography>
                      </Box>

                      {/* Right: Laser Emitter Lens Aperture */}
                      <Box sx={{
                        width: 3.5,
                        height: 24,
                        borderRadius: "2px",
                        backgroundColor: greenAccent,
                        boxShadow: `0 0 8px ${greenAccent}`,
                      }} />
                    </Box>

                    {/* Center Scanner Control Knob */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        backgroundColor: "#071428",
                        border: "2px solid #10B981",
                        boxShadow: "0 0 16px rgba(16, 185, 129, 0.6), inset 0 0 8px rgba(16, 185, 129, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#10B981",
                      }}
                    >
                      <CompareArrowsOutlined sx={{ fontSize: 20, color: "#10B981", transform: "rotate(90deg)" }} />
                    </Box>
                  </Box>
                </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION 2: BENTO FEATURES GRID (100VH SNAP) */}
      <Box
        sx={{
          height: "100vh",
          minHeight: "100vh",
          maxHeight: "100vh",
          width: "100%",
          backgroundColor: isDark ? "#04101F" : "#F0F5FF",
          borderTop: `1px solid ${borderColor}`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          flexShrink: 0,
          pt: { xs: 8, md: 7 },
          pb: { xs: 3, md: 4 },
        }}
      >
        {/* Subtle background texture */}
        <Box sx={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(10,40,100,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, my: "auto" }}>
          {/* Section heading with accent indicator bar */}
          <Box sx={{ mb: 2.8, display: "flex", alignItems: "center", gap: 1.8 }}>
            <Box sx={{ width: 4, height: 26, borderRadius: "2px", backgroundColor: greenAccent }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontFamily: '"Lexend", sans-serif',
                color: textPrimary,
                fontSize: { xs: "1.5rem", md: "2.1rem" },
                mb: 0,
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
              }}
            >
              Tính năng chính
            </Typography>
          </Box>

          {/* BENTO GRID */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: { xs: 1.5, md: 2 } }}>

            {/* Card 1 — WIDE: Translation Engine */}
            <Box sx={{
              gridColumn: { md: "span 2" },
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "#071428" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
              position: "relative",
              overflow: "hidden",
            }}>
              <Box sx={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%",
                background: isDark ? "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" : "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              {/* 2-col internal layout: text left, language grid right */}
              <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start", flexWrap: { xs: "wrap", md: "nowrap" } }}>
                <Box sx={{ flex: "1 1 220px" }}>
                  <TranslateOutlined sx={{ fontSize: 26, color: greenAccent, mb: 1.5, display: "block" }} />
                  <Typography sx={{ fontWeight: 700, fontFamily: '"Lexend", sans-serif', color: textPrimary, fontSize: "1.1rem", mb: 0.8 }}>
                    Dịch thuật đa ngôn ngữ
                  </Typography>
                  <Typography sx={{ color: textSecondary, fontFamily: '"Lexend", sans-serif', fontSize: "0.88rem", lineHeight: 1.55 }}>
                    Tối ưu cho văn bản hành chính, pháp lý và kỹ thuật chuyên ngành.
                  </Typography>
                </Box>
                <Box sx={{ flex: "1 1 200px", display: "flex", flexWrap: "wrap", gap: 0.9, alignContent: "flex-start", pt: { md: 0.5 } }}>
                  {[
                    "Tiếng Việt", "Tiếng Anh", "Tiếng Trung", "Tiếng Nhật",
                    "Tiếng Hàn", "Tiếng Pháp", "Tiếng Tây Ban Nha", "Tiếng Nga",
                  ].map(lang => (
                    <Box key={lang} sx={{
                      px: 1.4, py: 0.4, borderRadius: "6px", fontSize: "0.76rem",
                      fontFamily: '"Lexend", sans-serif',
                      color: greenAccent,
                      border: `1px solid ${isDark ? "rgba(16,185,129,0.3)" : "rgba(5,150,105,0.25)"}`,
                      backgroundColor: isDark ? "rgba(16,185,129,0.07)" : "rgba(5,150,105,0.05)",
                      whiteSpace: "nowrap",
                    }}>
                      {lang}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Card 2 — TALL: Security — adapts to theme */}
            <Box sx={{
              gridRow: { md: "span 2" },
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "#061020" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>
              <Box sx={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <ShieldOutlined sx={{ fontSize: 26, color: greenAccent, mb: 1.5, display: "block" }} />
              <Typography sx={{ fontWeight: 700, fontFamily: '"Lexend", sans-serif', color: textPrimary, fontSize: "1.1rem", mb: 0.8 }}>
                Bảo mật On-Premise
              </Typography>
              <Typography sx={{ color: textSecondary, fontFamily: '"Lexend", sans-serif', fontSize: "0.88rem", lineHeight: 1.55 }}>
                Vận hành hoàn toàn trong hạ tầng nội bộ.
              </Typography>
              <Box sx={{ mt: "auto", pt: 3 }}>
                {["Mã hóa AES-256", "Không phụ thuộc đám mây", "Ghi nhật ký mọi thao tác", "Phân quyền theo vai trò"].map(t => (
                  <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.2 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: greenAccent, flexShrink: 0 }} />
                    <Typography sx={{ color: textSecondary, fontSize: "0.83rem", fontFamily: '"Lexend", sans-serif' }}>{t}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Card 3 — Layout Preservation — spans 2 cols to fill gap beside Security card row 2 */}
            <Box sx={{
              gridColumn: { md: "span 2" },
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "#071428" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
            }}>
              <DescriptionOutlined sx={{ fontSize: 26, color: greenAccent, mb: 1.5, display: "block" }} />
              <Typography sx={{ fontWeight: 700, fontFamily: '"Lexend", sans-serif', color: textPrimary, fontSize: "1.08rem", mb: 0.8 }}>
                Bảo toàn phông chữ & bố cục
              </Typography>
              <Typography sx={{ color: textSecondary, fontFamily: '"Lexend", sans-serif', fontSize: "0.88rem", lineHeight: 1.55 }}>
                Giữ nguyên bảng biểu, hình ảnh, lề trang và định dạng cột của tài liệu gốc.
              </Typography>
            </Box>

            {/* Card 4 — Format Support — WIDE */}
            <Box sx={{
              gridColumn: { md: "span 2" },
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "#071428" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
            }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontFamily: '"Lexend", sans-serif', color: textPrimary, fontSize: "1.08rem" }}>
                  Hỗ trợ toàn diện định dạng văn bản
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" }, gap: 2 }}>
                {[
                  { icon: InsertDriveFileOutlined, name: "Word", ext: ".DOCX / .DOC", color: "#2B6CB0" },
                  { icon: TableChartOutlined, name: "Excel", ext: ".XLSX / .XLS", color: "#276749" },
                  { icon: SlideshowOutlined, name: "PowerPoint", ext: ".PPTX / .PPT", color: "#C05621" },
                  { icon: PictureAsPdfOutlined, name: "PDF", ext: ".PDF", color: "#C53030" },
                  { icon: ImageOutlined, name: "Ảnh", ext: ".PNG / .JPG / .JPEG", color: "#8B5CF6" },
                ].map(f => {
                  const IC = f.icon;
                  return (
                    <Box key={f.name} sx={{ textAlign: "center" }}>
                      <Box sx={{
                        width: 44, height: 44, mx: "auto", mb: 0.8,
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                        borderRadius: "10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                      }}>
                        <IC sx={{ fontSize: 22, color: f.color }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: textPrimary, fontSize: "0.8rem", fontFamily: '"Lexend", sans-serif' }}>{f.name}</Typography>
                      <Typography sx={{ color: greenAccent, fontSize: "0.68rem", fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>{f.ext}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Card 5 — Glossary */}
            <Box sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "#071428" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <Box>
                <AutoAwesomeOutlined sx={{ fontSize: 26, color: greenAccent, mb: 1.5, display: "block" }} />
                <Typography sx={{ fontWeight: 700, fontFamily: '"Lexend", sans-serif', color: textPrimary, fontSize: "1.08rem", mb: 0.8 }}>
                  Thuật ngữ chuyên ngành
                </Typography>
                <Typography sx={{ color: textSecondary, fontFamily: '"Lexend", sans-serif', fontSize: "0.88rem", lineHeight: 1.55 }}>
                  Quản lý và áp dụng nhất quán từ vựng chuyên ngành cho từng phòng ban.
                </Typography>
              </Box>
            </Box>

            {/* Card 6 — Batch processing */}
            <Box sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "#071428" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <Box>
                <SpeedOutlined sx={{ fontSize: 26, color: greenAccent, mb: 1.5, display: "block" }} />
                <Typography sx={{ fontWeight: 700, fontFamily: '"Lexend", sans-serif', color: textPrimary, fontSize: "1.08rem", mb: 0.8 }}>
                  Xử lý hàng loạt
                </Typography>
                <Typography sx={{ color: textSecondary, fontFamily: '"Lexend", sans-serif', fontSize: "0.88rem", lineHeight: 1.55 }}>
                  Tải lên song song nhiều tài liệu, theo dõi tiến độ theo thời gian thực.
                </Typography>
              </Box>
            </Box>

            {/* Card 7 — Storage */}
            <Box sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "#071428" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <Box>
                <StorageOutlined sx={{ fontSize: 26, color: greenAccent, mb: 1.5, display: "block" }} />
                <Typography sx={{ fontWeight: 700, fontFamily: '"Lexend", sans-serif', color: textPrimary, fontSize: "1.08rem", mb: 0.8 }}>
                  Kho lịch sử tập trung
                </Typography>
                <Typography sx={{ color: textSecondary, fontFamily: '"Lexend", sans-serif', fontSize: "0.88rem", lineHeight: 1.55 }}>
                  Lưu trữ và tải xuống tất cả bản dịch đã hoàn thành bất cứ lúc nào.
                </Typography>
              </Box>
            </Box>

            {/* Card 8 — And More Teaser Card */}
            <Box sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: "16px",
              backgroundColor: isDark ? "rgba(7, 20, 40, 0.5)" : "rgba(255, 255, 255, 0.6)",
              border: `1px dashed ${borderColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: greenAccent,
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.05)" : "rgba(5, 150, 105, 0.04)",
              },
            }}>
              <Typography sx={{
                fontWeight: 800,
                fontFamily: '"Lexend", sans-serif',
                color: greenAccent,
                fontSize: "1.6rem",
                letterSpacing: "4px",
                lineHeight: 1,
                mb: 0.8,
              }}>
                ...
              </Typography>
              <Typography sx={{
                color: textSecondary,
                fontFamily: '"Lexend", sans-serif',
                fontSize: "0.88rem",
                fontWeight: 600,
              }}>
                Và nhiều hơn nữa
              </Typography>
            </Box>

          </Box>
        </Container>
      </Box>


    </Box>
  );
}