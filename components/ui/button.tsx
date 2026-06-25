'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:bg-[var(--accent-active)] shadow-sm hover:shadow-md',
        secondary:
          'bg-white border border-[#CBD5E1] text-[var(--fg)] hover:bg-[var(--bg-secondary)] active:bg-[var(--bg-muted)]',
        tertiary:
          'bg-transparent text-[var(--fg)] hover:text-[var(--accent)] active:text-[var(--accent-active)]',
        outline:
          'border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
        ghost:
          'bg-transparent text-[var(--fg-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]',
        destructive:
          'bg-[var(--error)] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] shadow-sm',
        success:
          'bg-[var(--success)] text-white hover:bg-[#16A34A] active:bg-[#15803D] shadow-sm',
      },
      size: {
        xs: 'px-3 text-xs h-7',
        sm: 'px-4 text-xs h-9',
        md: 'px-5 text-sm h-11',
        lg: 'px-6 text-sm h-11',
        xl: 'px-8 text-base h-12',
        icon: 'w-11 h-11 p-0',
        'icon-sm': 'w-9 h-9 p-0',
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
