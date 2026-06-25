import { GenderCollectionPage } from '@/lib/shop/gender-collection-page'

export const dynamic = 'force-dynamic'

export default function WomenPage() {
  return (
    <GenderCollectionPage
      gender="WOMEN"
      title="Women"
      description="Elegant womenswear and accessories from our ateliers in Tunis."
    />
  )
}
