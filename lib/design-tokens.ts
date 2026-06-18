// Design tokens for MAISON TUNIS luxury system
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '96px',
} as const;

export const typography = {
  heading1: {
    fontSize: '48px',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    letterSpacing: '0.3em',
    lineHeight: '1.2',
  },
  heading2: {
    fontSize: '36px',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    letterSpacing: '0.25em',
    lineHeight: '1.25',
  },
  heading3: {
    fontSize: '28px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
    letterSpacing: '0.2em',
    lineHeight: '1.3',
  },
  heading4: {
    fontSize: '24px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
    letterSpacing: '0.15em',
    lineHeight: '1.35',
  },
  body: {
    fontSize: '16px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '400',
    letterSpacing: '0.05em',
    lineHeight: '1.6',
  },
  small: {
    fontSize: '14px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '400',
    letterSpacing: '0.05em',
    lineHeight: '1.5',
  },
  label: {
    fontSize: '12px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
    letterSpacing: '0.1em',
    lineHeight: '1.4',
  },
  overline: {
    fontSize: '11px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    lineHeight: '1.4',
  },
} as const;

export const shadows = {
  subtle: '0 2px 4px rgba(0, 0, 0, 0.1)',
  medium: '0 8px 16px rgba(0, 0, 0, 0.15)',
  large: '0 16px 32px rgba(0, 0, 0, 0.2)',
  elevation: '0 24px 48px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
} as const;

export const borderRadius = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

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
} as const;
