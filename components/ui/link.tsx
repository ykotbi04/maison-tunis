'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const linkVariants = cva(
  'inline-flex items-center gap-2 font-sans transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-1',
  {
    variants: {
      variant: {
        default: 'text-accent hover:text-accent-light',
        primary: 'text-foreground hover:text-accent',
        secondary: 'text-muted hover:text-foreground',
        muted: 'text-muted hover:text-foreground/70',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
      underline: {
        none: 'no-underline',
        hover: 'hover:underline underline-offset-2',
        always: 'underline underline-offset-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      underline: 'hover',
    },
  }
)

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  children: React.ReactNode
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      underline,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        className={cn(
          linkVariants({ variant, size, underline, className })
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)

Link.displayName = 'Link'

export { Link, linkVariants }
