'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  variant?: 'default' | 'dark' | 'light'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, children, variant = 'default', spacing = 'lg', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-background',
      dark: 'bg-background-secondary',
      light: 'bg-background-secondary/50',
    }

    const spacingClasses = {
      sm: 'py-8 md:py-12',
      md: 'py-12 md:py-16',
      lg: 'py-16 md:py-24',
      xl: 'py-24 md:py-32',
    }

    return (
      <section
        ref={ref}
        className={cn(variantClasses[variant], spacingClasses[spacing], className)}
        {...props}
      >
        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'

export { Section }
