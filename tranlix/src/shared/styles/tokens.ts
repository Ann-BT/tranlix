/**
 * Design tokens — source of truth for colors, spacing, typography.
 * Pure constants, no UI library dependencies.
 */

export const colorTokens = {
  // Wine scale (primary brand colors — based on #6E2030)
  wine50:  '#FBE9ED',
  wine100: '#F5D1D8',
  wine200: '#EBADBA',
  wine300: '#DD7E91',
  wine400: '#B3324C',
  wine500: '#6E2030',
  wine600: '#5C1927',
  wine700: '#49131E',
  wine800: '#350D15',
  wine900: '#21080D',

  // Blue scale (secondary colors)
  blue50:  '#EAF2F8',
  blue100: '#D0E3F0',
  blue200: '#99C6E1',
  blue300: '#61A9D2',
  blue400: '#2A8CC3',
  blue500: '#1B4B6D',
  blue600: '#163D59',
  blue700: '#102F45',
  blue800: '#0B2131',
  blue900: '#05131D',

  // Neutral scale (backgrounds, surfaces)
  neutral50:  '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#D1D5DB',
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
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#0284C7',
} as const;

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
    display: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
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