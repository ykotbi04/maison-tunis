// MAISON TUNIS - Design Tokens Index
// Single source of truth for all design tokens

export * from './spacing'
export * from './typography'
export * from './colors'
export * from './radius'
export * from './shadows'
export * from './motion'

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdropSticky: 1040,
  offcanvas: 1050,
  backdropOffcanvas: 1040,
  modal: 1060,
  backdropModal: 1050,
  popover: 1070,
  tooltip: 1080,
} as const

// Breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export type ZIndexValue = keyof typeof zIndex
export type BreakpointValue = keyof typeof breakpoints
