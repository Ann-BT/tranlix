/**
 * Design tokens — source of truth for colors, spacing, typography.
 * Pure constants, no UI library dependencies.
 */

export const colorTokens = {
  // Crimson Coral Red primary scale (Youthful Modern Red)
  wine50:  '#FFF1F2',
  wine100: '#FFE4E6',
  wine200: '#FECDD3',
  wine300: '#FDA4AF',
  wine400: '#FB7185',
  wine500: '#F43F5E',
  wine600: '#E11D48', // Main Brand Red
  wine700: '#BE123C',
  wine800: '#9F1239',
  wine900: '#881337',

  // Secondary Indigo / Violet scale for non-error balance
  blue50:  '#EEF2FF',
  blue100: '#E0E7FF',
  blue200: '#C7D2FE',
  blue300: '#A5B4FC',
  blue400: '#818CF8',
  blue500: '#6366F1',
  blue600: '#4F46E5',
  blue700: '#4338CA',
  blue800: '#3730A3',
  blue900: '#312E81',

  // Primary Brand scale — Modern Crimson Coral Red (#E11D48)
  brandRed50:  '#FFF1F2',
  brandRed100: '#FFE4E6',
  brandRed500: '#E11D48', // Crisp Coral Red
  brandRed600: '#BE123C',
  brandRed700: '#9F1239',

  // Secondary Brand scale — Deep Slate Navy (#0F172A)
  brandNavy50:  '#F8FAFC',
  brandNavy100: '#F1F5F9',
  brandNavy500: '#1E293B',
  brandNavy800: '#0F172A',
  brandNavy900: '#020617',

  // Accent Gold / Coral Amber scale
  accentGold:      '#F59E0B',
  accentGoldLight: '#FEF3C7',

  // Security Emerald Green scale
  vneidGreen50:  '#ECFDF5',
  vneidGreen100: '#D1FAE5',
  vneidGreen500: '#10B981',
  vneidGreen600: '#059669',
  vneidGreen700: '#047857',

  // Backward-compatibility aliases for legacy code
  policeRed50:  '#FFF1F2',
  policeRed100: '#FFE4E6',
  policeRed500: '#E11D48',
  policeRed600: '#BE123C',
  policeRed700: '#9F1239',

  policeNavy50:  '#F8FAFC',
  policeNavy500: '#1E293B',
  policeNavy800: '#0F172A',
  policeNavy900: '#020617',

  emblemGold:      '#F59E0B',
  emblemGoldLight: '#FEF3C7',

  // Neutral slate scale
  neutral50:  '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#CBD5E1',
  neutral400: '#94A3B8',
  neutral500: '#64748B',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1E293B',
  neutral900: '#0F172A',

  // Semantic aliases
  white: '#FFFFFF',
  black: '#000000',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const typographyTokens = {
  fontFamily: {
    primary: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    display: '"Lexend", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.00rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
  },
} as const;