import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

// Extend MUI theme types with custom status and alert tokens
declare module '@mui/material/styles' {
  interface Palette {
    status: {
      completed: string;
      pending: string;
      processing: string;
      error: string;
      reviewNeeded: string;
    };
    alert: {
      critical: string;
      warning: string;
      monitor: string;
      safe: string;
    };
    spoofing: {
      natural: string;
      replay: string;
      uncertain: string;
    };
  }
  interface PaletteOptions {
    status?: {
      completed?: string;
      pending?: string;
      processing?: string;
      error?: string;
      reviewNeeded?: string;
    };
    alert?: {
      critical?: string;
      warning?: string;
      monitor?: string;
      safe?: string;
    };
    spoofing?: {
      natural?: string;
      replay?: string;
      uncertain?: string;
    };
  }
}

// Design colors from promt/theme.md and the SOBEK specs
export const colors = {
  primary: '#00949D',
  primaryHover: '#007B82',
  primaryActive: '#00676D',
  primaryLight: '#E6F6F7',
  secondary: '#1B4B6D',
  secondaryHover: '#163D59',
  secondaryLight: '#EAF2F8',
  background: '#FFFFFF',
  backgroundSec: '#F8FAFC',
  backgroundTert: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textDisabled: '#94A3B8',
  border: '#D1E5E7',
  borderFocus: '#00949D',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#0284C7',
};

export const getMuiTheme = (): Theme => {
  const mode = 'light';
  const t = colors;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.primary,
        light: t.primaryLight,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: t.secondary,
        light: t.secondaryLight,
        contrastText: '#FFFFFF',
      },
      background: {
        default: t.background,
        paper: t.backgroundSec,
      },
      text: {
        primary: t.textPrimary,
        secondary: t.textSecondary,
        disabled: t.textDisabled,
      },
      divider: t.border,
      success: { main: t.success },
      warning: { main: t.warning },
      error: { main: t.error },
      info: { main: t.info },
      status: {
        completed: t.success,
        pending: t.warning,
        processing: t.info,
        error: t.error,
        reviewNeeded: t.secondary,
      },
      alert: {
        critical: t.error,
        warning: t.warning,
        monitor: t.info,
        safe: t.success,
      },
      spoofing: {
        natural: t.success,
        replay: t.error,
        uncertain: t.warning,
      }
    },
    typography: {
      fontFamily: '"Source Sans 3", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Lexend", sans-serif',
        fontSize: '2.00rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Lexend", sans-serif',
        fontSize: '1.50rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: '"Lexend", sans-serif',
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      subtitle1: {
        fontFamily: '"Source Sans 3", sans-serif',
        fontSize: '1.00rem',
        fontWeight: 600,
      },
      body1: {
        fontFamily: '"Source Sans 3", sans-serif',
        fontSize: '1.00rem',
        lineHeight: 1.5,
      },
      body2: {
        fontFamily: '"Source Sans 3", sans-serif',
        fontSize: '0.875rem',
        color: t.textSecondary,
      },
      caption: {
        fontFamily: '"Source Sans 3", sans-serif',
        fontSize: '0.75rem',
        fontWeight: 500,
      },
      button: {
        fontFamily: '"Lexend", sans-serif',
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            padding: '8px 20px',
            borderRadius: '6px',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:focus-visible': {
              outline: `3px solid ${t.borderFocus}`,
              outlineOffset: '2px',
            },
            ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
              backgroundColor: t.primary,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: t.primaryHover,
              },
              '&:active': {
                backgroundColor: t.primaryActive,
              },
            }),
            ...(ownerState.variant === 'outlined' && ownerState.color === 'secondary' && {
              borderColor: t.secondary,
              color: t.secondary,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? t.secondaryLight : 'rgba(255,255,255,0.05)',
                borderColor: t.secondaryHover,
              },
            }),
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: t.backgroundSec,
            border: `1px solid ${t.border}`,
            boxShadow: mode === 'light' ? '0px 4px 10px rgba(27, 75, 109, 0.08)' : 'none',
            borderRadius: '12px',
            padding: '24px',
            transition: 'transform 200ms ease, box-shadow 200ms ease',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: t.border,
              },
              '&:hover fieldset': {
                borderColor: t.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: t.primary,
                borderWidth: '2px',
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: t.border,
            padding: '12px 16px',
            fontFamily: '"Source Sans 3", sans-serif',
          },
          head: {
            fontFamily: '"Lexend", sans-serif',
            fontWeight: 600,
            color: t.textPrimary,
            backgroundColor: mode === 'light' ? t.backgroundTert : '#111C40',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: '4px',
            height: '24px',
          },
        },
      },
    },
  });
};
