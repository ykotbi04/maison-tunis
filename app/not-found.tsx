import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="bg-[var(--bg)]">
      <Container>
        <div className="text-center py-32 space-y-6">
          <div className="w-16 h-16 bg-[var(--bg-muted)] rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-[var(--fg-muted)]">404</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--fg)] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-[var(--fg-muted)] max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/">
            <Button variant="primary" size="lg">
              Return Home
            </Button>
          </Link>
        </div>
      </Container>
    </main>
  )
}
