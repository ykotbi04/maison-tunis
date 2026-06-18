// MAISON TUNIS - Motion System
// Premium, confident animations with reduced motion support

export const motion = {
  // Duration tokens (in milliseconds)
  duration: {
    instant: '100ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '800ms',
  },

  // Easing functions
  easing: {
    // Linear
    linear: 'linear',
    
    // Standard
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    
    // Custom premium easings
    'ease-out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
    'ease-in-out-quart': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
  },

  // Animation presets
  animation: {
    // Fade animations
    'fade-in': 'fadeIn 200ms ease-out',
    'fade-in-up': 'fadeInUp 300ms ease-out',
    'fade-in-down': 'fadeInDown 300ms ease-out',
    
    // Scale animations
    'scale-in': 'scaleIn 200ms ease-out',
    'scale-up': 'scaleUp 200ms ease-out',
    
    // Slide animations
    'slide-in-right': 'slideInRight 300ms ease-out',
    'slide-in-left': 'slideInLeft 300ms ease-out',
    
    // Shimmer for loading states
    shimmer: 'shimmer 2s linear infinite',
  },
} as const

// Keyframes for CSS animations
export const keyframes = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeInUp: {
    '0%': { opacity: '0', transform: 'translateY(16px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInDown: {
    '0%': { opacity: '0', transform: 'translateY(-16px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  scaleIn: {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  scaleUp: {
    '0%': { transform: 'scale(1)' },
    '100%': { transform: 'scale(1.02)' },
  },
  slideInRight: {
    '0%': { opacity: '0', transform: 'translateX(32px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  slideInLeft: {
    '0%': { opacity: '0', transform: 'translateX(-32px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% center' },
    '100%': { backgroundPosition: '200% center' },
  },
} as const

export type DurationValue = keyof typeof motion.duration
export type EasingValue = keyof typeof motion.easing
export type AnimationValue = keyof typeof motion.animation
