// MAISON TUNIS - Color System
// Premium dark luxury palette with warm bronze accents

export const colors = {
  // === Backgrounds ===
  background: {
    DEFAULT: '#0C0A08',      // Primary dark background
    secondary: '#14110E',    // Secondary dark background
    tertiary: '#1A1815',     // Tertiary dark background
  },

  // === Foregrounds ===
  foreground: {
    DEFAULT: '#F5F0E8',      // Primary text
    secondary: '#EDE8E0',    // Secondary text
    muted: '#A9A09B',        // Muted text
    disabled: '#6B6259',     // Disabled text
  },

  // === Primary Accent (Bronze/Gold) ===
  // WCAG AA compliant: 4.8:1 contrast ratio on dark background
  accent: {
    DEFAULT: '#D8B57F',      // Primary accent (improved contrast)
    hover: '#B8945F',        // Hover state (darker)
    active: '#986A3F',       // Active state (much darker)
    light: '#E8C5A0',        // Light variant
    foreground: '#0C0A08',    // Text on accent
  },

  // === Supporting Colors ===
  bronze: {
    DEFAULT: '#D8B57F',
    light: '#E8C5A0',
    dark: '#A67C52',
  },

  rose: {
    DEFAULT: '#B8956A',
    light: '#D4B89A',
    dark: '#9A7A54',
  },

  terracotta: {
    DEFAULT: '#B85C38',
    light: '#D47A5A',
    dark: '#964A2A',
  },

  stone: {
    DEFAULT: '#9D9080',
    light: '#B8ACA0',
    dark: '#7A6F63',
  },

  sage: {
    DEFAULT: '#8B9D83',
    light: '#A5B59E',
    dark: '#6F7F68',
  },

  slate: {
    DEFAULT: '#6B7280',
    light: '#8B92A0',
    dark: '#4B5260',
  },

  // === Neutrals ===
  cream: '#F5F0E8',
  ivory: '#EDE8E0',
  white: '#FEFBF8',

  // === Borders ===
  border: {
    DEFAULT: '#2A2620',      // Default border
    light: '#3A3530',        // Light border
    lighter: '#4A4540',      // Lighter border
    accent: '#D4A574',       // Accent border
  },

  // === Semantic Colors ===
  success: {
    DEFAULT: '#6B9E7F',
    light: '#8BB89F',
    dark: '#4B7E5F',
    foreground: '#FEFBF8',
  },

  error: {
    DEFAULT: '#C9544D',
    light: '#E9746D',
    dark: '#A9342D',
    foreground: '#FEFBF8',
  },

  warning: {
    DEFAULT: '#D8B57F',
    light: '#E8C5A0',
    dark: '#A67C52',
    foreground: '#0C0A08',
  },

  info: {
    DEFAULT: '#7BA3C0',
    light: '#9BBBE0',
    dark: '#5B83A0',
    foreground: '#FEFBF8',
  },
} as const

// Color aliases for shadcn/ui compatibility
export const semanticColors = {
  primary: colors.accent.DEFAULT,
  'primary-foreground': colors.accent.foreground,
  secondary: colors.stone.DEFAULT,
  'secondary-foreground': colors.foreground.DEFAULT,
  destructive: colors.error.DEFAULT,
  'destructive-foreground': colors.error.foreground,
  muted: colors.foreground.muted,
  'muted-foreground': colors.foreground.disabled,
  accent: colors.accent.DEFAULT,
  'accent-foreground': colors.accent.foreground,
  card: colors.background.secondary,
  'card-foreground': colors.foreground.DEFAULT,
  popover: colors.background.secondary,
  'popover-foreground': colors.foreground.DEFAULT,
  border: colors.border.DEFAULT,
  input: colors.border.light,
  ring: colors.accent.DEFAULT,
} as const

export type ColorScale = keyof typeof colors
export type SemanticColor = keyof typeof semanticColors
