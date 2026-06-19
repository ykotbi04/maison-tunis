import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllCategories } from '@/lib/db/categories'
import { Container } from '@/components/layout/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'Collections | MAISON TUNIS',
  description: 'Explore our curated collections - from evening wear and day wear to heritage pieces and limited editions.',
}

export default async function CollectionsPage() {
  const categories = await getAllCategories()

  return (
    <>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections' },
          ]}
        />
      </Container>

      <section className="py-12 md:py-20">
        <Container>
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <p className="text-label text-accent tracking-widest">Curated Selections</p>
            <h1 className="text-display-1">Our Collections</h1>
            <p className="text-body text-foreground-muted max-w-xl mx-auto">
              Discover handpicked pieces across our collections, each telling a unique story of Tunisian craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group block"
              >
                <div className="aspect-[4/5] bg-background-secondary rounded-lg overflow-hidden mb-4 relative">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-background group-hover:from-accent/20 transition-all duration-500">
                    <div className="text-6xl text-accent/50">✦</div>
                  </div>
                </div>
                <h2 className="font-serif text-2xl text-foreground group-hover:text-accent transition-colors tracking-wide">
                  {category.name}
                </h2>
                <p className="text-muted text-sm mt-2 leading-relaxed">
                  {category.description}
                </p>
                <span className="inline-block mt-3 text-accent text-sm font-serif tracking-wider group-hover:opacity-80 transition-opacity">
                  Explore Collection →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
