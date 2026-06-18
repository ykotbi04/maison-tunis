// MAISON TUNIS - Typography System
// Enterprise-grade typography scale following visual hierarchy

export const typography = {
  // Display typography - for hero sections
  display1: {
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  display2: {
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
  },

  // Heading typography
  h1: {
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: '28px',
    fontWeight: '600',
    lineHeight: '1.3',
    letterSpacing: '0em',
  },
  h3: {
    fontSize: '22px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0em',
  },
  h4: {
    fontSize: '18px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0em',
  },
  h5: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '1.5',
    letterSpacing: '0em',
  },
  h6: {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.5',
    letterSpacing: '0em',
  },

  // Body typography
  body: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.6',
    letterSpacing: '0em',
  },
  bodyLarge: {
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '1.6',
    letterSpacing: '0em',
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '1.5',
    letterSpacing: '0em',
  },

  // Label typography
  label: {
    fontSize: '13px',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '0.05em',
  },
  labelLarge: {
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '0.05em',
  },
  labelSmall: {
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '0.05em',
  },

  // Caption/overline typography
  caption: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '0em',
  },
  overline: {
    fontSize: '11px',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },

  // Price typography - for product pricing
  price: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '0em',
  },
  priceLarge: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '0em',
  },
  priceSmall: {
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '0em',
  },
} as const

// Font family tokens
export const fontFamily = {
  sans: 'var(--font-sans), DM Sans, system-ui, sans-serif',
  serif: 'var(--font-serif), Cormorant Garamond, Georgia, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
} as const

// Font weight tokens
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

// Line height tokens
export const lineHeight = {
  tight: '1.1',
  snug: '1.2',
  normal: '1.4',
  relaxed: '1.6',
  loose: '1.8',
} as const

// Letter spacing tokens
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

export type TypographyScale = keyof typeof typography
export type FontFamily = keyof typeof fontFamily
export type FontWeight = keyof typeof fontWeight
