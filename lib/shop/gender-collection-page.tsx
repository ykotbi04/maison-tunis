import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { ProductCard } from '@/components/product/product-card'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { getAllCategories } from '@/lib/db/categories'
import { getProductsByGender } from '@/lib/db/products'
import type { Gender } from '@prisma/client'

interface GenderCollectionPageProps {
  gender: Gender
  title: string
  description: string
  categorySlug?: string
}

export async function GenderCollectionPage({
  gender,
  title,
  description,
  categorySlug,
}: GenderCollectionPageProps) {
  const products = await getProductsByGender(gender, categorySlug)
  const categories = await getAllCategories()
  const basePath = gender === 'MEN' ? '/men' : '/women'
  const heroTitle = gender === 'MEN' ? 'HOMME' : 'FEMME'

  return (
    <main style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Breadcrumbs */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div className="py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: title, href: basePath },
                ...(categorySlug
                  ? [
                      {
                        label:
                          categories.find((c) => c.slug === categorySlug)?.name ??
                          categorySlug,
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-secondary)' }} />
        <div className="relative z-10 text-center px-8">
          <h1
            className="font-serif tracking-[0.3em] uppercase"
            style={{
              color: 'var(--fg)',
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              fontWeight: 400,
              letterSpacing: '0.3em',
            }}
          >
            {heroTitle}
          </h1>
          <p
            className="mt-6 text-body max-w-lg mx-auto"
            style={{ color: 'var(--fg-secondary)' }}
          >
            {description}
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-6" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div className="flex overflow-x-auto gap-6 pb-2">
            <Link
              href={basePath}
              className="whitespace-nowrap pb-2 text-overline transition-colors"
              style={{
                color: !categorySlug ? 'var(--accent)' : 'var(--fg-muted)',
                borderBottom: !categorySlug ? '1px solid var(--accent)' : '1px solid transparent',
              }}
            >
              All {title}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`${basePath}/${cat.slug}`}
                className="whitespace-nowrap pb-2 text-overline transition-colors"
                style={{
                  color: categorySlug === cat.slug ? 'var(--accent)' : 'var(--fg-muted)',
                  borderBottom: categorySlug === cat.slug ? '1px solid var(--accent)' : '1px solid transparent',
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-20">
        <Container>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <p className="text-heading-2" style={{ color: 'var(--fg)' }}>No products found</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 text-overline transition-colors"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#0C0A08',
                }}
              >
                Browse All Products
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Editorial Blocks */}
      <section className="py-16 md:py-24" style={{ borderTop: '1px solid var(--border)' }}>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-4">
              <div
                className="aspect-[3/4] flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <span className="text-6xl" style={{ color: 'var(--accent)', opacity: 0.3 }}>✦</span>
              </div>
              <h3 className="text-heading-2" style={{ color: 'var(--fg)' }}>
                {gender === 'MEN' ? 'Bespoke Tailoring' : 'Couture Heritage'}
              </h3>
              <p className="text-body" style={{ color: 'var(--fg-secondary)' }}>
                {gender === 'MEN'
                  ? 'Each suit is meticulously crafted by hand in our Tunisian atelier, combining centuries-old techniques with modern precision.'
                  : 'Our collections draw from generations of Tunisian craftsmanship, reimagined for the contemporary woman.'}
              </p>
            </div>
            <div className="space-y-4">
              <div
                className="aspect-[3/4] flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <span className="text-6xl" style={{ color: 'var(--accent)', opacity: 0.3 }}>✦</span>
              </div>
              <h3 className="text-heading-2" style={{ color: 'var(--fg)' }}>
                {gender === 'MEN' ? 'Tunisian Artistry' : 'Mediterranean Elegance'}
              </h3>
              <p className="text-body" style={{ color: 'var(--fg-secondary)' }}>
                {gender === 'MEN'
                  ? 'Heritage embroidery and hand-finished details speak to a tradition of excellence passed down through generations.'
                  : 'Inspired by the light and colors of the Mediterranean, each piece tells a story of timeless elegance.'}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
