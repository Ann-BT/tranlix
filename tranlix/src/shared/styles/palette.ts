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
  mode: 'light',

  primary: {
    main: colorTokens.wine500,
    light: colorTokens.wine50,
    dark: colorTokens.wine700,
    contrastText: colorTokens.white,
  },

  secondary: {
    main: colorTokens.blue500,
    light: colorTokens.blue50,
    dark: colorTokens.blue600,
    contrastText: colorTokens.white,
  },

  background: {
    default: colorTokens.neutral50,
    paper: colorTokens.white,
  },

  text: {
    primary: colorTokens.neutral900,
    secondary: colorTokens.neutral700,
    disabled: colorTokens.neutral400,
  },

  divider: colorTokens.neutral200,

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
    reviewNeeded: colorTokens.blue500,
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