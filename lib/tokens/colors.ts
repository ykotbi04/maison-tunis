// MAISON TUNIS - Color System
// Professional SaaS palette with clean blue accents

export const colors = {
  // === Backgrounds ===
  background: {
    DEFAULT: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
  },

  // === Foregrounds ===
  foreground: {
    DEFAULT: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    disabled: '#CBD5E1',
  },

  // === Primary Accent (Blue) ===
  accent: {
    DEFAULT: '#2563EB',
    hover: '#1D4ED8',
    active: '#1E40AF',
    light: '#DBEAFE',
    foreground: '#FFFFFF',
  },

  // === Supporting Colors ===
  bronze: {
    DEFAULT: '#2563EB',
    light: '#DBEAFE',
    dark: '#1E40AF',
  },

  rose: {
    DEFAULT: '#E11D48',
    light: '#FEE2E2',
    dark: '#BE123C',
  },

  terracotta: {
    DEFAULT: '#EA580C',
    light: '#FFF7ED',
    dark: '#C2410C',
  },

  stone: {
    DEFAULT: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
  },

  sage: {
    DEFAULT: '#22C55E',
    light: '#DCFCE7',
    dark: '#16A34A',
  },

  slate: {
    DEFAULT: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
  },

  // === Neutrals ===
  cream: '#F8FAFC',
  ivory: '#F1F5F9',
  white: '#FFFFFF',

  // === Borders ===
  border: {
    DEFAULT: '#E2E8F0',
    light: '#F1F5F9',
    lighter: '#F8FAFC',
    accent: '#2563EB',
  },

  // === Semantic Colors ===
  success: {
    DEFAULT: '#22C55E',
    light: '#DCFCE7',
    dark: '#16A34A',
    foreground: '#FFFFFF',
  },

  error: {
    DEFAULT: '#EF4444',
    light: '#FEF2F2',
    dark: '#DC2626',
    foreground: '#FFFFFF',
  },

  warning: {
    DEFAULT: '#F59E0B',
    light: '#FFFBEB',
    dark: '#D97706',
    foreground: '#FFFFFF',
  },

  info: {
    DEFAULT: '#3B82F6',
    light: '#EFF6FF',
    dark: '#2563EB',
    foreground: '#FFFFFF',
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
