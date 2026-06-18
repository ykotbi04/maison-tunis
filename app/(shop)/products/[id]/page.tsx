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
    <main className="bg-background">
      {/* Breadcrumbs */}
      <section className="border-b border-border">
        <Container>
          <div className="py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
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
      <section className="border-t border-border py-12 md:py-20 bg-background-secondary">
        <Container>
          <div className="space-y-8">
            <div>
              <h2 className="text-display-2">You May Also Like</h2>
              <p className="text-body text-foreground-muted mt-2">
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
                  <div key={idx} className="bg-background rounded-lg p-6 space-y-4">
                    <div className="aspect-square bg-background-secondary rounded flex items-center justify-center">
                      <div className="text-5xl text-accent/30">✦</div>
                    </div>
                    <h3 className="text-heading-3">Related Product {idx}</h3>
                    <p className="text-muted text-sm">Premium piece from MAISON TUNIS</p>
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
