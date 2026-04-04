/**
 * Spacing scale based on a 4px grid.
 * Use these values for margins, paddings, and gaps to maintain
 * consistent rhythm throughout the UI.
 */
export const spacing = {
  /** 2px - Hairline gaps, icon padding */
  xxs: 2,
  /** 4px - Tight inner padding */
  xs: 4,
  /** 8px - Small element spacing */
  sm: 8,
  /** 12px - Compact group spacing */
  md: 12,
  /** 16px - Standard padding and gaps */
  lg: 16,
  /** 24px - Section separation */
  xl: 24,
  /** 32px - Large section breaks */
  xxl: 32,
  /** 48px - Major layout divisions */
  xxxl: 48,
} as const;

/**
 * Border radius values.
 */
export const borderRadius = {
  /** 4px - Subtle rounding */
  xs: 4,
  /** 8px - Standard card rounding */
  sm: 8,
  /** 12px - Buttons and interactive elements */
  md: 12,
  /** 16px - Modal and sheet corners */
  lg: 16,
  /** 24px - Pill shapes */
  xl: 24,
  /** 9999px - Full circle / capsule */
  full: 9999,
} as const;

/**
 * Common layout dimensions.
 */
export const layout = {
  /** Bottom tab bar height */
  tabBarHeight: 64,
  /** Standard button height */
  buttonHeight: 48,
  /** Small button height */
  buttonHeightSm: 36,
  /** Header height */
  headerHeight: 56,
  /** Scan controls panel height */
  scanControlsHeight: 120,
  /** Maximum content width for tablets */
  maxContentWidth: 600,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Layout = typeof layout;
