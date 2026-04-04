import { Platform } from 'react-native';

/**
 * Font families. Uses SF Pro on iOS (system default) with monospace
 * fallback for measurement readouts.
 */
export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    default: 'System',
  }) as string,
  mono: Platform.select({
    ios: 'Menlo',
    default: 'monospace',
  }) as string,
};

/**
 * Font size scale.
 */
export const fontSize = {
  /** 10px - Fine print, badges */
  xxs: 10,
  /** 12px - Captions, metadata */
  xs: 12,
  /** 14px - Body small, secondary text */
  sm: 14,
  /** 16px - Body default */
  md: 16,
  /** 18px - Body large, emphasis */
  lg: 18,
  /** 20px - Subheading */
  xl: 20,
  /** 24px - Section heading */
  xxl: 24,
  /** 32px - Page title */
  xxxl: 32,
  /** 40px - Hero display */
  display: 40,
} as const;

/**
 * Font weight values for React Native.
 */
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

/**
 * Line height multipliers relative to font size.
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Pre-composed text style presets.
 */
export const textStyles = {
  /** Large page title */
  displayLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.display * lineHeight.tight,
  },

  /** Page title */
  h1: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.tight,
  },

  /** Section heading */
  h2: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },

  /** Subheading */
  h3: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl * lineHeight.normal,
  },

  /** Body large */
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.lg * lineHeight.normal,
  },

  /** Body default */
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  },

  /** Body small */
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },

  /** Caption */
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.xs * lineHeight.normal,
  },

  /** Fine print */
  overline: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xxs * lineHeight.normal,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },

  /** Monospace for measurements and numeric readouts */
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.md * lineHeight.normal,
  },

  /** Large monospace for measurement displays */
  monoLarge: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },

  /** Button text */
  button: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.md * lineHeight.tight,
  },

  /** Small button text */
  buttonSmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.sm * lineHeight.tight,
  },
} as const;

export type TextStyles = typeof textStyles;
export type FontSize = typeof fontSize;
