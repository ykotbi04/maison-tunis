import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="bg-background">
      <Container>
        <div className="text-center py-32 space-y-8">
          <div className="text-6xl text-accent">◆</div>
          <h1 className="font-serif text-5xl text-foreground tracking-widest">
            Page Not Found
          </h1>
          <p className="text-muted text-lg max-w-md mx-auto">
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
