import { notFound } from 'next/navigation'
import { GenderCollectionPage } from '@/lib/shop/gender-collection-page'
import { getCategoryBySlug } from '@/lib/db/categories'

export const dynamic = 'force-dynamic'

interface WomenCategoryPageProps {
  params: Promise<{ categorySlug: string }>
}

export default async function WomenCategoryPage({ params }: WomenCategoryPageProps) {
  const { categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  return (
    <GenderCollectionPage
      gender="WOMEN"
      title="Women"
      description={category.description}
      categorySlug={categorySlug}
    />
  )
}
