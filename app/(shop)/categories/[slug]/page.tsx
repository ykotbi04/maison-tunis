import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug, getAllCategories } from '@/lib/db/categories'
import { getAllProducts } from '@/lib/db/products'
import { Container } from '@/components/layout/container'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { ProductCard } from '@/components/product/product-card'
import { formatTND } from '@/lib/formatters'

export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | MAISON TUNIS`,
    description: category.description,
    openGraph: {
      title: category.name,
      description: category.description,
      images: [
        {
          url: category.image,
          width: 1200,
          height: 675,
        },
      ],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const allProducts = await getAllProducts({ categorySlug: slug })
  const products = Array.isArray(allProducts) ? allProducts : allProducts.data
  const categories = await getAllCategories()

  return (
    <main className="bg-background">
      {/* Breadcrumbs */}
      <section className="border-b border-border">
        <Container>
          <div className="py-4">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Collections', href: '/collections' },
                { label: category.name },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Category Hero */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <Container>
          <div className="relative h-full flex flex-col justify-center">
            <h1 className="text-display-1 text-white">{category.name}</h1>
            <p className="text-body text-cream max-w-2xl mt-4">
              {category.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Category Info */}
      <section className="py-12 md:py-16 bg-background-secondary border-b border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-label">Total Items</p>
              <p className="text-4xl font-serif text-accent">{products.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-label">Price Range</p>
              <p className="text-body">
                {formatTND(Math.min(...products.map((p) => p.price)))} -{' '}
                {formatTND(Math.max(...products.map((p) => p.price)))}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-label">Availability</p>
              <p className="text-body">
                {products.filter((p) => p.inStock).length} in stock
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Products Grid */}
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
              <p className="text-2xl text-foreground">No products in this category yet</p>
               <Link href="/collections" className="text-accent hover:text-accent-dark">
                Browse all products →
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* Other Categories */}
      <section className="py-12 md:py-20 border-t border-border bg-background-secondary">
        <Container>
          <div className="space-y-8">
            <h2 className="text-display-2">Explore Other Collections</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories
                .filter((cat) => cat.slug !== slug)
                .map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="group"
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-heading-3 group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-muted text-sm mt-1">{cat.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
