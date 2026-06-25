import Link from 'next/link'
import { Container } from '@/components/layout/container'
import { ProductCard } from '@/components/product/product-card'
import { getProductsByGender } from '@/lib/db/products'
import { getAllCategories } from '@/lib/db/categories'
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

  return (
    <main style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
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
                href="/collections"
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

    </main>
  )
}
