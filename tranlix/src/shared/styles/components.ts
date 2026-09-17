/**
 * MUI component style overrides — uses design tokens directly.
 */

import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        padding: '12px 24px',
        borderRadius: '4px',
        fontWeight: 700,
        transition: 'all 200ms ease',
        '&:focus-visible': {
          outline: `3px solid #10B981`,
          outlineOffset: '2px',
        },
        ...(ownerState.variant === 'contained' &&
          ownerState.color === 'primary' && {
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#059669',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            },
          }),
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(11, 19, 43, 0.95)' : '#FFFFFF',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(30,58,138,0.3)'
            : '0 10px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
        borderRadius: '6px',
        padding: '24px',
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          color: theme.palette.text.primary,
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)',
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.15)',
          },
          '&:hover fieldset': {
            borderColor: '#10B981',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#10B981',
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#10B981',
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
        padding: '12px 16px',
        color: theme.palette.text.primary,
      }),
      head: ({ theme }) => ({
        fontWeight: 700,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(241, 245, 249, 0.95)',
        borderBottom: `2px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#0B132B' : '#FFFFFF',
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '6px',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 12px 32px rgba(0, 0, 0, 0.6)'
            : '0 8px 24px rgba(0, 0, 0, 0.12)',
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.primary,
        fontSize: '0.9rem',
        '&:hover': {
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
        },
        '&.Mui-selected': {
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          '&:hover': {
            backgroundColor: 'rgba(16, 185, 129, 0.35)',
          },
        },
      }),
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
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: theme.palette.mode === 'dark' ? '#0B132B' : '#FFFFFF',
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.secondary,
        transition: 'all 150ms ease',
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          color: theme.palette.text.primary,
        },
      }),
    },
  },
};