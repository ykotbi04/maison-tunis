'use client'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="bg-background">
      <Container>
        <div className="text-center py-32 space-y-8">
          <div className="text-6xl text-accent">◆</div>
          <h1 className="font-serif text-5xl text-foreground tracking-widest">
            Something went wrong
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto">
            We encountered an unexpected error. Please try again.
          </p>
          <Button variant="primary" size="lg" onClick={reset}>
            Try Again
          </Button>
        </div>
      </Container>
    </main>
  )
}
