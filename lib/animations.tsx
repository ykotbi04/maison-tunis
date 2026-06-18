'use client'

import { ReactNode } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { motionConfig, prefersReducedMotion } from './motion-system'

// Fade in animation wrapper
export function FadeIn({
  children,
  delay = 0,
  duration = 0.3,
  className,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Fade in with slide up
export function FadeInUp({
  children,
  delay = 0,
  duration = 0.3,
  className,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      initial={
        reducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 20 }
      }
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for children animations
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={
        reducedMotion
          ? {}
          : {
              animate: {
                transition: {
                  staggerChildren: staggerDelay,
                },
              },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale animation wrapper
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.2,
  className,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? { scale: 1 } : { scale: 0.95 }}
      animate={reducedMotion ? { scale: 1 } : { scale: 1 }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll reveal animation
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reducedMotion = prefersReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
      whileInView={
        reducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0 }
      }
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hover scale effect
export function HoverScale({
  children,
  scale = 1.02,
  className,
  ...props
}: {
  children: ReactNode
  scale?: number
  className?: string
} & MotionProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
