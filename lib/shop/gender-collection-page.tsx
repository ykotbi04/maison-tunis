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

  return (
    <main className="bg-background">
      <section className="border-b border-border">
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

      <section className="py-12 md:py-20 border-b border-border">
        <Container>
          <div className="max-w-2xl space-y-4">
            <h1 className="text-display-1">{title}</h1>
            <p className="text-body text-foreground-muted">{description}</p>
          </div>
        </Container>
      </section>

      <section className="py-8 border-b border-border bg-background-secondary">
        <Container>
          <div className="flex overflow-x-auto gap-4 pb-4">
            <Link
              href={basePath}
              className={`px-4 py-2 border-b-2 whitespace-nowrap font-serif ${
                !categorySlug
                  ? 'border-accent text-accent'
                  : 'border-transparent hover:border-accent text-foreground hover:text-accent transition-colors'
              }`}
            >
              All {title}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`${basePath}/${cat.slug}`}
                className={`px-4 py-2 border-b-2 whitespace-nowrap ${
                  categorySlug === cat.slug
                    ? 'border-accent text-accent font-serif'
                    : 'border-transparent hover:border-accent text-foreground hover:text-accent transition-colors'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-20">
        <Container>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-2xl text-foreground">No products found</p>
              <Link href="/shop" className="text-accent hover:text-accent-dark">
                Browse all products →
              </Link>
            </div>
          )}
        </Container>
      </section>
    </main>
  )
}
