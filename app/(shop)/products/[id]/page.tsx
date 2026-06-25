import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductById, getRelatedProducts } from '@/lib/db/products'
import { ProductDetail } from '@/components/product/product-detail'
import { ProductCard } from '@/components/product/product-card'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Container } from '@/components/layout/container'
import Link from 'next/link'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | MAISON TUNIS`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
        },
      ],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categorySlug, product.id, 3)

  return (
    <main style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Breadcrumbs */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <Container>
          <div className="py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Collections', href: '/collections' },
                { label: product.category, href: `/categories/${product.categorySlug}` },
                { label: product.name },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Product Detail */}
      <section className="py-12 md:py-20">
        <Container>
          <ProductDetail product={product} />
        </Container>
      </section>

      {/* Related Products Section */}
      <section className="py-12 md:py-20" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
        <Container>
          <div className="space-y-8">
            <div>
              <h2 className="text-display-2" style={{ color: 'var(--fg)' }}>You May Also Like</h2>
              <p className="text-body mt-2" style={{ color: 'var(--fg-muted)' }}>
                Other beautiful pieces from our collection
              </p>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((related) => (
                  <Link key={related.id} href={`/products/${related.id}`}>
                    <ProductCard product={related} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="p-6 space-y-4" style={{ backgroundColor: 'var(--bg)' }}>
                    <div className="aspect-square flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div className="text-5xl" style={{ color: 'var(--accent)', opacity: 0.3 }}>✦</div>
                    </div>
                    <h3 className="text-heading-3" style={{ color: 'var(--fg)' }}>Related Product {idx}</h3>
                    <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Premium piece from MAISON TUNIS</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  )
}
