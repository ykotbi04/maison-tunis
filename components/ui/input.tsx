'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'w-full px-4 py-2 rounded-md font-sans text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-background-secondary border border-border text-foreground placeholder:text-muted focus:border-accent',
        outline: 'bg-transparent border-2 border-border text-foreground placeholder:text-muted focus:border-accent',
      },
      size: {
        sm: 'h-8 text-xs px-3',
        md: 'h-10 text-sm px-4',
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
          <label className="block text-sm font-medium text-foreground mb-2 tracking-wide">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            inputVariants({ variant, size, className }),
            error && 'border-error focus:ring-error focus:border-error'
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
