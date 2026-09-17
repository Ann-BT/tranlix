import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { colorTokens } from "./tokens";
import { typography } from "./typography";
import { components } from "./components";

interface ColorModeContextType {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: "dark",
  toggleColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("app_theme_mode");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("app_theme_mode", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#10B981",
            light: "#34D399",
            dark: "#059669",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#F59E0B",
            light: "#FEF3C7",
            dark: "#D97706",
            contrastText: "#FFFFFF",
          },
          background: {
            default: mode === "dark" ? "#030712" : "#F8FAFC",
            paper: mode === "dark" ? "#0B132B" : "#FFFFFF",
          },
          text: {
            primary: mode === "dark" ? "#FFFFFF" : "#0F172A",
            secondary: mode === "dark" ? "#94A3B8" : "#475569",
            disabled: mode === "dark" ? "#64748B" : "#94A3B8",
          },
          divider: mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
          success: { main: colorTokens.success },
          warning: { main: colorTokens.warning },
          error: { main: colorTokens.error },
          info: { main: colorTokens.info },
        },
        typography,
        shape: { borderRadius: 8 },
        components: {
          ...components,
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
