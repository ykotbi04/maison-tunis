import type { Config } from 'tailwindcss'
import { colors, spacing, radius, shadows, typography, fontFamily, fontWeight, lineHeight, letterSpacing } from './lib/tokens'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        foreground: colors.foreground,
        accent: colors.accent,
        bronze: colors.bronze,
        rose: colors.rose,
        terracotta: colors.terracotta,
        stone: colors.stone,
        sage: colors.sage,
        slate: colors.slate,
        cream: colors.cream,
        ivory: colors.ivory,
        white: colors.white,
        border: colors.border,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
      },
      spacing: {
        ...spacing,
      },
      borderRadius: {
        ...radius,
      },
      boxShadow: {
        ...shadows,
      },
      fontSize: {
        // Display
        'display-1': [typography.display1.fontSize, {
          fontWeight: typography.display1.fontWeight,
          lineHeight: typography.display1.lineHeight,
          letterSpacing: typography.display1.letterSpacing,
        }],
        'display-2': [typography.display2.fontSize, {
          fontWeight: typography.display2.fontWeight,
          lineHeight: typography.display2.lineHeight,
          letterSpacing: typography.display2.letterSpacing,
        }],
        // Headings
        'h1': [typography.h1.fontSize, {
          fontWeight: typography.h1.fontWeight,
          lineHeight: typography.h1.lineHeight,
          letterSpacing: typography.h1.letterSpacing,
        }],
        'h2': [typography.h2.fontSize, {
          fontWeight: typography.h2.fontWeight,
          lineHeight: typography.h2.lineHeight,
          letterSpacing: typography.h2.letterSpacing,
        }],
        'h3': [typography.h3.fontSize, {
          fontWeight: typography.h3.fontWeight,
          lineHeight: typography.h3.lineHeight,
          letterSpacing: typography.h3.letterSpacing,
        }],
        'h4': [typography.h4.fontSize, {
          fontWeight: typography.h4.fontWeight,
          lineHeight: typography.h4.lineHeight,
          letterSpacing: typography.h4.letterSpacing,
        }],
        'h5': [typography.h5.fontSize, {
          fontWeight: typography.h5.fontWeight,
          lineHeight: typography.h5.lineHeight,
          letterSpacing: typography.h5.letterSpacing,
        }],
        'h6': [typography.h6.fontSize, {
          fontWeight: typography.h6.fontWeight,
          lineHeight: typography.h6.lineHeight,
          letterSpacing: typography.h6.letterSpacing,
        }],
        // Body
        'body': [typography.body.fontSize, {
          fontWeight: typography.body.fontWeight,
          lineHeight: typography.body.lineHeight,
          letterSpacing: typography.body.letterSpacing,
        }],
        'body-lg': [typography.bodyLarge.fontSize, {
          fontWeight: typography.bodyLarge.fontWeight,
          lineHeight: typography.bodyLarge.lineHeight,
          letterSpacing: typography.bodyLarge.letterSpacing,
        }],
        'body-sm': [typography.bodySmall.fontSize, {
          fontWeight: typography.bodySmall.fontWeight,
          lineHeight: typography.bodySmall.lineHeight,
          letterSpacing: typography.bodySmall.letterSpacing,
        }],
        // Labels
        'label': [typography.label.fontSize, {
          fontWeight: typography.label.fontWeight,
          lineHeight: typography.label.lineHeight,
          letterSpacing: typography.label.letterSpacing,
        }],
        'label-lg': [typography.labelLarge.fontSize, {
          fontWeight: typography.labelLarge.fontWeight,
          lineHeight: typography.labelLarge.lineHeight,
          letterSpacing: typography.labelLarge.letterSpacing,
        }],
        'label-sm': [typography.labelSmall.fontSize, {
          fontWeight: typography.labelSmall.fontWeight,
          lineHeight: typography.labelSmall.lineHeight,
          letterSpacing: typography.labelSmall.letterSpacing,
        }],
        // Caption
        'caption': [typography.caption.fontSize, {
          fontWeight: typography.caption.fontWeight,
          lineHeight: typography.caption.lineHeight,
          letterSpacing: typography.caption.letterSpacing,
        }],
        'overline': [typography.overline.fontSize, {
          fontWeight: typography.overline.fontWeight,
          lineHeight: typography.overline.lineHeight,
          letterSpacing: typography.overline.letterSpacing,
          textTransform: typography.overline.textTransform,
        }],
        // Price
        'price': [typography.price.fontSize, {
          fontWeight: typography.price.fontWeight,
          lineHeight: typography.price.lineHeight,
          letterSpacing: typography.price.letterSpacing,
        }],
        'price-lg': [typography.priceLarge.fontSize, {
          fontWeight: typography.priceLarge.fontWeight,
          lineHeight: typography.priceLarge.lineHeight,
          letterSpacing: typography.priceLarge.letterSpacing,
        }],
        'price-sm': [typography.priceSmall.fontSize, {
          fontWeight: typography.priceSmall.fontWeight,
          lineHeight: typography.priceSmall.lineHeight,
          letterSpacing: typography.priceSmall.letterSpacing,
        }],
      },
      fontFamily: {
        sans: fontFamily.sans,
        serif: fontFamily.serif,
        mono: fontFamily.mono,
      },
      fontWeight: {
        ...fontWeight,
      },
      lineHeight: {
        ...lineHeight,
      },
      letterSpacing: {
        ...letterSpacing,
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-in-up': 'fadeInUp 300ms ease-out',
        'fade-in-down': 'fadeInDown 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-up': 'scaleUp 200ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
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
      },
    },
  },
  plugins: [],
}

export default config
