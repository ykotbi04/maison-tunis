// MAISON TUNIS - Shadow System
// Premium shadow scale for depth and elevation

export const shadows = {
  // Subtle shadows for cards and small elements
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  
  // Medium shadows for standard elements
  md: '0 4px 8px rgba(0, 0, 0, 0.12)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
  
  // Large shadows for elevated elements
  xl: '0 16px 32px rgba(0, 0, 0, 0.2)',
  '2xl': '0 24px 48px rgba(0, 0, 0, 0.25)',
  
  // Inner shadows
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  innerLg: 'inset 0 4px 8px rgba(0, 0, 0, 0.15)',
  
  // Colored shadows for accent elements
  accent: '0 4px 16px rgba(212, 165, 116, 0.25)',
  accentLg: '0 8px 32px rgba(212, 165, 116, 0.35)',
} as const

export type ShadowValue = keyof typeof shadows
