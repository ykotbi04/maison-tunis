'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { ScrollReveal, FadeInUp } from '@/lib/animations'

interface HeroBannerProps {
  title: string
  subtitle?: string
  description?: string
  image?: string
  primaryCTA?: {
    label: string
    href: string
  }
  secondaryCTA?: {
    label: string
    href: string
  }
  layout?: 'full' | 'split'
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  layout = 'full',
}) => {
  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-background to-background-secondary overflow-hidden">
      {/* Decorative element */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <Container className="relative h-full py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Content */}
          <FadeInUp delay={0.1}>
            <div>
              {subtitle && (
                <p className="font-sans text-xs md:text-sm text-accent tracking-widest mb-4 uppercase">
                  {subtitle}
                </p>
              )}
              <h1 className="font-serif text-5xl md:text-7xl text-foreground mb-6 tracking-widest font-light">
                {title}
              </h1>
              {description && (
                <p className="font-sans text-lg md:text-xl text-muted mb-8 max-w-md leading-relaxed">
                  {description}
                </p>
              )}
              {(primaryCTA || secondaryCTA) && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {primaryCTA && (
                    <Link href={primaryCTA.href}>
                      <Button
                        variant="primary"
                        size="lg"
                        className="font-medium tracking-wide"
                      >
                        {primaryCTA.label}
                      </Button>
                    </Link>
                  )}
                  {secondaryCTA && (
                    <Link href={secondaryCTA.href}>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="font-medium tracking-wide"
                      >
                        {secondaryCTA.label}
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </FadeInUp>

          {/* Visual */}
          <FadeInUp delay={0.3}>
            <div className="aspect-square rounded-lg bg-background-secondary flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl text-accent mb-4">◆</p>
                <p className="text-muted text-sm font-serif">Featured Image</p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </Container>
    </div>
  )
}

interface FeatureGridProps {
  title?: string
  features: Array<{
    icon?: string
    title: string
    description: string
  }>
  columns?: 2 | 3 | 4
  variant?: 'default' | 'dark'
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  title,
  features,
  columns = 3,
  variant = 'default',
}) => {
  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={variant === 'dark' ? 'bg-background-secondary' : 'bg-background'}>
      <Container className="py-16 md:py-24">
        {title && (
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4 tracking-wider">
              {title}
            </h2>
          </div>
        )}

        <div className={cn('grid gap-8 md:gap-12', columnClasses[columns])}>
          {features.map((feature, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="text-center">
                {feature.icon && (
                  <div className="text-5xl mb-4">{feature.icon}</div>
                )}
                <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 tracking-wide">
                  {feature.title}
                </h3>
                <p className="font-sans text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </div>
  )
}

export { HeroBanner, FeatureGrid }
