'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-sans font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        // Primary: solid gold button
        primary:
          'bg-accent text-accent-foreground hover:bg-accent-dark active:scale-95 border border-accent',
        
        // Secondary: outline style
        secondary:
          'bg-transparent border-2 border-accent text-accent hover:bg-accent/10 active:bg-accent/20',
        
        // Tertiary: minimal style
        tertiary:
          'bg-transparent text-foreground hover:text-accent active:text-accent-dark',
        
        // Outline: border only
        outline:
          'border border-border text-foreground hover:border-accent hover:text-accent',
        
        // Ghost: no background
        ghost:
          'bg-transparent text-foreground hover:bg-background-secondary',
        
        // Destructive: error styling
        destructive:
          'bg-error text-white hover:bg-error/90 active:scale-95',
        
        // Success: success styling
        success:
          'bg-success text-white hover:bg-success/90 active:scale-95',
      },
      size: {
        // Extra small
        xs: 'px-2 py-1 text-xs h-7',
        
        // Small
        sm: 'px-3 py-1.5 text-sm h-8',
        
        // Medium (default)
        md: 'px-4 py-2 text-sm h-10',
        
        // Large
        lg: 'px-6 py-3 text-base h-12',
        
        // Extra large
        xl: 'px-8 py-4 text-lg h-14',
        
        // Icon button
        icon: 'w-10 h-10 p-0',
        'icon-sm': 'w-8 h-8 p-0',
        'icon-lg': 'w-12 h-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
      loading: {
        true: 'pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            loading: isLoading,
            className,
          })
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
