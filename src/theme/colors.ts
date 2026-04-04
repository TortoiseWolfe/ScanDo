/**
 * Dark theme color palette for ScanDo.
 * Designed for a professional scanning/CAD aesthetic with high contrast
 * on OLED displays.
 */
export const colors = {
  /** Core background colors */
  background: {
    primary: '#0A0A0F',
    secondary: '#14141F',
    tertiary: '#1E1E2E',
    elevated: '#252538',
  },

  /** Surface colors for cards, sheets, modals */
  surface: {
    default: '#1A1A2E',
    hover: '#222240',
    active: '#2A2A4A',
    disabled: '#12121D',
  },

  /** Brand / accent colors */
  accent: {
    primary: '#6C63FF',
    primaryLight: '#8B85FF',
    primaryDark: '#4A42CC',
    secondary: '#00D9FF',
    secondaryLight: '#4DE8FF',
    secondaryDark: '#00A3BF',
  },

  /** Text colors */
  text: {
    primary: '#F0F0F5',
    secondary: '#A0A0B8',
    tertiary: '#6B6B82',
    disabled: '#44445A',
    inverse: '#0A0A0F',
  },

  /** Semantic colors */
  semantic: {
    success: '#34D399',
    successLight: '#6EE7B7',
    warning: '#FBBF24',
    warningLight: '#FCD34D',
    error: '#F87171',
    errorLight: '#FCA5A5',
    info: '#60A5FA',
    infoLight: '#93C5FD',
  },

  /** Border colors */
  border: {
    default: '#2A2A3E',
    light: '#1E1E30',
    focus: '#6C63FF',
    error: '#F87171',
  },

  /** Scanner-specific colors */
  scanner: {
    mesh: '#6C63FF',
    meshWireframe: '#4DE8FF',
    meshFill: 'rgba(108, 99, 255, 0.15)',
    measurementLine: '#00D9FF',
    measurementPoint: '#FBBF24',
    boundingBox: '#34D399',
  },

  /** Subscription badge colors */
  subscription: {
    free: '#6B6B82',
    pro: '#FBBF24',
    proGradientStart: '#F59E0B',
    proGradientEnd: '#D97706',
  },

  /** Overlay and transparency */
  overlay: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.10)',
    dark: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.75)',
  },
} as const;

export type Colors = typeof colors;
