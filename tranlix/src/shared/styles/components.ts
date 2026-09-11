/**
 * MUI component style overrides — uses design tokens directly.
 */

import type { Components } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { colorTokens } from './tokens';

export const components: Components<Theme> = {
  MuiButton: {
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        padding: '12px 24px',
        borderRadius: '8px',
        fontWeight: 600,
        transition: 'all 200ms ease',
        '&:focus-visible': {
          outline: `3px solid ${colorTokens.wine500}`,
          outlineOffset: '2px',
        },
        ...(ownerState.variant === 'contained' &&
          ownerState.color === 'primary' && {
            backgroundColor: colorTokens.wine500,
            color: colorTokens.white,
            '&:hover': {
              backgroundColor: colorTokens.wine600,
              opacity: 0.9,
              transform: 'translateY(-1px)',
            },
            '&:active': {
              backgroundColor: colorTokens.wine700,
              opacity: 0.8,
            },
          }),
        ...(ownerState.variant === 'outlined' &&
          ownerState.color === 'secondary' && {
            borderColor: colorTokens.blue500,
            color: colorTokens.blue500,
            borderWidth: '2px',
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? colorTokens.blue50
                  : 'rgba(255,255,255,0.05)',
              borderColor: colorTokens.blue600,
              borderWidth: '2px',
            },
          }),
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        border: '1px solid',
        borderColor: theme.palette.divider,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        borderRadius: '12px',
        padding: '24px',
        transition: 'all 200ms ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transform: 'translateY(-1px)',
        },
      }),
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '& fieldset': {
            borderColor: colorTokens.neutral200,
          },
          '&:hover fieldset': {
            borderColor: colorTokens.wine500,
          },
          '&.Mui-focused fieldset': {
            borderColor: colorTokens.wine500,
            borderWidth: '2px',
          },
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: colorTokens.neutral200,
        padding: '12px 16px',
        fontFamily: '"Plus Jakarta Sans", sans-serif',
      },
      head: {
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        color: colorTokens.wine800,
        backgroundColor: 'rgba(110, 32, 48, 0.04)',
        borderBottom: `2px solid rgba(110, 32, 48, 0.1)`,
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
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 150ms ease',
        '&:hover': {
          backgroundColor: colorTokens.neutral100,
        },
        '&:focus-visible': {
          outline: `3px solid ${colorTokens.wine500}`,
          outlineOffset: '2px',
        },
      },
    },
  },
};