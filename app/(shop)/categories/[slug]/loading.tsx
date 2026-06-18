import { Container } from '@/components/layout/container'
import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function CategoryLoading() {
  return (
    <main className="bg-background">
      <section className="border-b border-border">
        <Container>
          <div className="py-4">
            <div className="h-4 w-48 bg-background-secondary animate-pulse rounded" />
          </div>
        </Container>
      </section>
      <section className="relative h-64 md:h-96">
        <div className="absolute inset-0 bg-background-secondary animate-pulse" />
      </section>
      <section className="py-12 md:py-16 bg-background-secondary border-b border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-background animate-pulse rounded" />
                <div className="h-8 w-16 bg-background animate-pulse rounded" />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
