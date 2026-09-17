/**
 * MUI palette configuration — maps design tokens → MUI palette.
 * Type augmentation for custom palette properties lives here.
 */

import type { PaletteOptions } from '@mui/material/styles';
import { colorTokens } from './tokens';

// ------------------------------------------------------------------
// Type augmentation for custom palette properties
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// Palette definition — uses scale-named tokens, not semantic aliases
// ------------------------------------------------------------------

export const palette: PaletteOptions = {
  mode: 'dark',

  primary: {
    main: '#10B981', // Emerald green accent
    light: '#34D399',
    dark: '#059669',
    contrastText: colorTokens.white,
  },

  secondary: {
    main: '#F59E0B', // Warm Amber Accent
    light: '#FEF3C7',
    dark: '#D97706',
    contrastText: colorTokens.white,
  },

  background: {
    default: '#030712',
    paper: '#0B132B',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    disabled: '#64748B',
  },

  divider: 'rgba(255, 255, 255, 0.12)',

  // Standard status colors
  success: { main: colorTokens.success },
  warning: { main: colorTokens.warning },
  error: { main: colorTokens.error },
  info: { main: colorTokens.info },

  // Custom status tokens
  status: {
    completed: colorTokens.success,
    pending: colorTokens.warning,
    processing: colorTokens.info,
    error: colorTokens.error,
    reviewNeeded: colorTokens.wine500,
  },

  // Custom alert tokens
  alert: {
    critical: colorTokens.error,
    warning: colorTokens.warning,
    monitor: colorTokens.info,
    safe: colorTokens.success,
  },

  // Custom spoofing tokens
  spoofing: {
    natural: colorTokens.success,
    replay: colorTokens.error,
    uncertain: colorTokens.warning,
  },
};

// ------------------------------------------------------------------
// Exported type for consumption in components / hooks
// ------------------------------------------------------------------

export type AppPalette = typeof palette;