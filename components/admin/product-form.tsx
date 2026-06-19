'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminApi, categoriesApi, type AdminCategory } from '@/lib/api'
import type { Product } from '@/types/product'

interface ProductFormProps {
  mode: 'create' | 'edit'
  product?: Product
  productId?: string
}

const GENDERS = ['MEN', 'WOMEN', 'UNISEX'] as const

export default function ProductForm({ mode, product, productId }: ProductFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: product?.name || '',
    categorySlug: product?.categorySlug || '',
    gender: (product?.gender || 'MEN') as string,
    price: product?.price?.toString() || '',
    description: product?.description || '',
    longDescription: product?.longDescription || '',
    image: product?.image || '',
    images: product?.images?.join(', ') || '',
    color: product?.color || '',
    colors: product?.colors?.join(', ') || '',
    size: product?.size || '',
    sizes: product?.sizes?.join(', ') || '',
    material: product?.material || '',
    care: product?.care || '',
    inStock: product?.inStock ?? true,
    stock: product?.stock?.toString() || '',
    isNew: product?.isNew ?? false,
    isLimited: product?.isLimited ?? false,
    limitedQty: product?.limitedQty?.toString() || '',
    sku: product?.sku || '',
    heritage: product?.heritage || '',
  })

  useEffect(() => {
    categoriesApi.getAll().then((cats) => {
      setCategories(cats as unknown as AdminCategory[])
    })
  }, [])

  const set = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = {
        id: product?.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: form.name,
        categorySlug: form.categorySlug,
        gender: form.gender as 'MEN' | 'WOMEN' | 'UNISEX',
        price: parseFloat(form.price),
        description: form.description,
        longDescription: form.longDescription,
        image: form.image,
        images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [form.image],
        color: form.color,
        colors: form.colors ? form.colors.split(',').map((s) => s.trim()).filter(Boolean) : [form.color],
        size: form.size,
        sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [form.size],
        material: form.material,
        care: form.care,
        inStock: form.inStock,
        stock: form.stock ? parseInt(form.stock) : undefined,
        isNew: form.isNew,
        isLimited: form.isLimited,
        limitedQty: form.limitedQty ? parseInt(form.limitedQty) : undefined,
        rating: product?.rating || 0,
        reviews: product?.reviews || 0,
        sku: form.sku,
        heritage: form.heritage || undefined,
      }

      if (mode === 'create') {
        await adminApi.createProduct(data)
      } else if (productId) {
        await adminApi.updateProduct(productId, data)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed to save product'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl text-foreground tracking-wider mb-8">
        {mode === 'create' ? 'New Product' : 'Edit Product'}
      </h1>

      {error && (
        <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground tracking-wide mb-2">Basic Information</h2>

          <Input
            label="Product Name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
            aria-required="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                value={form.categorySlug}
                onChange={(e) => set('categorySlug', e.target.value)}
                required
                className="w-full h-10 px-4 bg-background-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                aria-required="true"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => set('gender', e.target.value)}
                className="w-full h-10 px-4 bg-background-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g.charAt(0) + g.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price (TND)"
              type="number"
              step="0.001"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
              aria-required="true"
            />
            <Input
              label="SKU"
              value={form.sku}
              onChange={(e) => set('sku', e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Short Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              required
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              aria-required="true"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Description</label>
            <textarea
              value={form.longDescription}
              onChange={(e) => set('longDescription', e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2 bg-background-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              aria-required="true"
            />
          </div>
        </div>

        {/* Media */}
        <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground tracking-wide mb-2">Media</h2>
          <Input
            label="Main Image URL"
            value={form.image}
            onChange={(e) => set('image', e.target.value)}
            required
            placeholder="/images/products/..."
            aria-required="true"
          />
          <Input
            label="Additional Image URLs (comma-separated)"
            value={form.images}
            onChange={(e) => set('images', e.target.value)}
            placeholder="/images/products/alt1.jpg, /images/products/alt2.jpg"
          />
        </div>

        {/* Variants */}
        <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground tracking-wide mb-2">Variants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Color"
              value={form.color}
              onChange={(e) => set('color', e.target.value)}
              required
              aria-required="true"
            />
            <Input
              label="All Colors (comma-separated)"
              value={form.colors}
              onChange={(e) => set('colors', e.target.value)}
              placeholder="Ivory, Black, Navy"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Size"
              value={form.size}
              onChange={(e) => set('size', e.target.value)}
              required
              aria-required="true"
            />
            <Input
              label="All Sizes (comma-separated)"
              value={form.sizes}
              onChange={(e) => set('sizes', e.target.value)}
              placeholder="XS, S, M, L, XL"
            />
          </div>
        </div>

        {/* Details */}
        <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground tracking-wide mb-2">Details</h2>
          <Input
            label="Material"
            value={form.material}
            onChange={(e) => set('material', e.target.value)}
            required
            aria-required="true"
          />
          <Input
            label="Care Instructions"
            value={form.care}
            onChange={(e) => set('care', e.target.value)}
            required
            aria-required="true"
          />
          <Input
            label="Heritage / Story"
            value={form.heritage}
            onChange={(e) => set('heritage', e.target.value)}
          />
        </div>

        {/* Inventory & Status */}
        <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground tracking-wide mb-2">Inventory & Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Stock Quantity (optional)"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set('stock', e.target.value)}
            />
            <Input
              label="Limited Quantity (optional)"
              type="number"
              min="0"
              value={form.limitedQty}
              onChange={(e) => set('limitedQty', e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => set('inStock', e.target.checked)}
                className="w-4 h-4 rounded border-border bg-background-secondary text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
              <span className="text-sm text-foreground">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => set('isNew', e.target.checked)}
                className="w-4 h-4 rounded border-border bg-background-secondary text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
              <span className="text-sm text-foreground">Mark as New</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isLimited}
                onChange={(e) => set('isLimited', e.target.checked)}
                className="w-4 h-4 rounded border-border bg-background-secondary text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
              <span className="text-sm text-foreground">Limited Edition</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={loading}>
            {mode === 'create' ? 'Create Product' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
