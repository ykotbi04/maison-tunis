'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { productsApi } from '@/lib/api'
import type { Product } from '@/types/product'
import ProductForm from '@/components/admin/product-form'
import { Button } from '@/components/ui/button'

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const p = await productsApi.getById(id)
        if (!cancelled) setProduct(p)
      } catch {
        if (!cancelled) setError('Product not found')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-muted">Loading product...</div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-[var(--color-error)]">{error || 'Product not found'}</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return <ProductForm mode="edit" product={product} productId={id} />
}
