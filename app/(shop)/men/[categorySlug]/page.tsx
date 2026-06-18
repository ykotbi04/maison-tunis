import { notFound } from 'next/navigation'
import { GenderCollectionPage } from '@/lib/shop/gender-collection-page'
import { getCategoryBySlug } from '@/lib/db/categories'

interface MenCategoryPageProps {
  params: Promise<{ categorySlug: string }>
}

export default async function MenCategoryPage({ params }: MenCategoryPageProps) {
  const { categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  return (
    <GenderCollectionPage
      gender="MEN"
      title="Men"
      description={category.description}
      categorySlug={categorySlug}
    />
  )
}
