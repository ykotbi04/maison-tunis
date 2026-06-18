import { Container } from '@/components/layout/container'
import { ProductCardSkeleton } from '@/components/ui/skeleton'

export default function MenCategoryLoading() {
  return (
    <main className="bg-background">
      <section className="border-b border-border">
        <Container>
          <div className="py-4">
            <div className="h-4 w-48 bg-background-secondary animate-pulse rounded" />
          </div>
        </Container>
      </section>
      <section className="py-12 md:py-20 border-b border-border">
        <Container>
          <div className="max-w-2xl space-y-4">
            <div className="h-10 w-24 bg-background-secondary animate-pulse rounded" />
            <div className="h-5 w-96 bg-background-secondary animate-pulse rounded" />
          </div>
        </Container>
      </section>
      <section className="py-8 border-b border-border bg-background-secondary">
        <Container>
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-32 bg-background-secondary animate-pulse rounded" />
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
