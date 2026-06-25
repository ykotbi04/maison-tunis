'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'w-full px-4 font-sans text-sm transition-all duration-150 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-[var(--fg-muted)]',
  {
    variants: {
      variant: {
        default:
          'bg-white border border-[var(--border)] text-[var(--fg)] focus:border-[var(--accent)] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]',
        outline:
          'bg-transparent border-2 border-[var(--border)] text-[var(--fg)] focus:border-[var(--accent)] focus:ring-0',
      },
      size: {
        sm: 'h-9 text-xs px-3',
        md: 'h-11 text-sm px-4',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      label,
      error,
      helperText,
      type = 'text',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            inputVariants({ variant, size, className }),
            error && 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-[var(--error)] font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-[var(--fg-muted)]">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
