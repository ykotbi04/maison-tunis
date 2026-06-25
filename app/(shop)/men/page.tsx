import { GenderCollectionPage } from '@/lib/shop/gender-collection-page'

export const dynamic = 'force-dynamic'

export default function MenPage() {
  return (
    <GenderCollectionPage
      gender="MEN"
      title="Men"
      description="Refined menswear and accessories crafted with Tunisian artistry."
    />
  )
}
