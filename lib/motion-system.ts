// Motion system for MAISON TUNIS - premium, confident animations
export const motionConfig = {
  // Durations
  duration: {
    fast: 0.15,
    base: 0.2,
    slow: 0.3,
    slower: 0.5,
    slowest: 0.8,
  },
  
  // Easing functions (no bounce, no playful)
  easing: {
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    cubic: [0.25, 0.46, 0.45, 0.94],
  },

  // Common animation variants
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -40 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    slideInRight: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 40 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    scaleIn: {
      initial: { scale: 0.9 },
      animate: { scale: 1 },
      exit: { scale: 0.9 },
      transition: { duration: 0.2, ease: 'easeOut' },
    },
  },

  // Stagger container for children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // Hover scales (subtle)
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  },

  // Loading shimmer keyframes
  shimmer: {
    initial: { backgroundPosition: '200% center' },
    animate: {
      backgroundPosition: ['-200% center', '200% center'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
};

// Respect user's motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Safe motion variant that respects user preference
export const safeMotionVariant = (variant: any, reduced: boolean = prefersReducedMotion()) => {
  if (reduced) {
    return {
      initial: variant.animate,
      animate: variant.animate,
      exit: variant.animate,
      transition: { duration: 0 },
    };
  }
  return variant;
};
