/**
 * Typography scale — Roboto font family for all text elements.
 */

import { typographyTokens } from './tokens';

export const typography = {
  fontFamily: typographyTokens.fontFamily.primary,

  h1: {
    fontFamily: typographyTokens.fontFamily.display,
    fontSize: typographyTokens.fontSize['4xl'],
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.25,
  },

  h2: {
    fontFamily: typographyTokens.fontFamily.display,
    fontSize: typographyTokens.fontSize['2xl'],
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.25,
  },

  h3: {
    fontFamily: typographyTokens.fontFamily.display,
    fontSize: typographyTokens.fontSize.xl,
    fontWeight: 600,
    lineHeight: 1.5,
  },

  subtitle1: {
    fontFamily: typographyTokens.fontFamily.primary,
    fontSize: typographyTokens.fontSize.md,
    fontWeight: 600,
    lineHeight: 1.5,
  },

  body1: {
    fontFamily: typographyTokens.fontFamily.primary,
    fontSize: typographyTokens.fontSize.md,
    lineHeight: 1.5,
  },

  body2: {
    fontFamily: typographyTokens.fontFamily.primary,
    fontSize: typographyTokens.fontSize.sm,
    color: 'text.secondary',
    lineHeight: 1.5,
  },

  subtitle2: {
    fontFamily: typographyTokens.fontFamily.primary,
    fontSize: typographyTokens.fontSize.sm,
    fontWeight: 500,
    lineHeight: 1.5,
  },

  button: {
    fontFamily: typographyTokens.fontFamily.primary,
    fontWeight: 600,
    textTransform: 'none',
    lineHeight: 1.5,
  },

  caption: {
    fontFamily: typographyTokens.fontFamily.primary,
    fontSize: typographyTokens.fontSize.xs,
    fontWeight: 500,
    lineHeight: 1.75,
  },

  overline: {
    fontFamily: typographyTokens.fontFamily.primary,
    fontSize: typographyTokens.fontSize.xs,
    fontWeight: 600,
    letterSpacing: '0',
    textTransform: 'uppercase',
  },
};
