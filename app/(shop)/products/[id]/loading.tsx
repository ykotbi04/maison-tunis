import { Container } from '@/components/layout/container'
import { ProductDetailSkeleton } from '@/components/ui/skeleton'

export default function ProductLoading() {
  return (
    <main className="bg-background">
      <Container>
        <div className="py-4">
          <div className="h-4 w-64 bg-background-secondary animate-pulse rounded" />
        </div>
      </Container>
      <section className="py-12 md:py-20">
        <Container>
          <ProductDetailSkeleton />
        </Container>
      </section>
    </main>
  )
}
