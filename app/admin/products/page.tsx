'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminApi, type AdminProduct } from '@/lib/api'
import { formatTND } from '@/lib/formatters'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const limit = 10

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const result = await adminApi.getProducts({
        page,
        limit,
        search: search || undefined,
        gender: genderFilter || undefined,
        inStock: stockFilter || undefined,
      })
      setProducts(result.data)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [page, search, genderFilter, stockFilter])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await adminApi.deleteProduct(deleteId)
      setDeleteId(null)
      fetchProducts()
    } catch {
      // silent
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground tracking-wider">Products</h1>
          <p className="text-sm text-muted mt-1">{total} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">+ New Product</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <select
          value={genderFilter}
          onChange={(e) => { setGenderFilter(e.target.value); setPage(1) }}
          className="h-10 px-4 bg-background-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-label="Filter by gender"
        >
          <option value="">All Genders</option>
          <option value="MEN">Men</option>
          <option value="WOMEN">Women</option>
          <option value="UNISEX">Unisex</option>
        </select>
        <select
          value={stockFilter}
          onChange={(e) => { setStockFilter(e.target.value); setPage(1) }}
          className="h-10 px-4 bg-background-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-label="Filter by stock status"
        >
          <option value="">All Stock</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-background-secondary rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-background overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{product.category}</td>
                    <td className="px-4 py-3 text-foreground capitalize">{product.gender.toLowerCase()}</td>
                    <td className="px-4 py-3 font-medium text-[var(--color-accent)]">{formatTND(product.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded ${
                          product.inStock
                            ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                            : 'bg-[var(--color-error)]/15 text-[var(--color-error)]'
                        }`}
                        role="status"
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                          className="text-xs text-muted hover:text-[var(--color-accent)] transition-colors px-2 py-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-xs text-muted hover:text-[var(--color-error)] transition-colors px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="xs"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="xs"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background-secondary rounded-lg border border-border p-6 max-w-sm w-full space-y-4">
            <h3 className="font-serif text-xl text-foreground">Delete Product</h3>
            <p className="text-sm text-muted">
              This action cannot be undone. The product will be permanently removed from your catalog.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                isLoading={deleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
