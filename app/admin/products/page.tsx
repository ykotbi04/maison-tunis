'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Products</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{total} products total</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Product
          </Button>
        </Link>
      </div>

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
          className="h-11 px-4 bg-white border border-[var(--border)] rounded-xl text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
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
          className="h-11 px-4 bg-white border border-[var(--border)] rounded-xl text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          aria-label="Filter by stock status"
        >
          <option value="">All Stock</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--fg-muted)]">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-10 h-10 text-[var(--fg-muted)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-sm text-[var(--fg-muted)] mb-2">No products found</p>
            <p className="text-xs text-[var(--fg-muted)]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider hidden md:table-cell">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-muted)] overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--fg)] truncate">{product.name}</p>
                          <p className="text-xs text-[var(--fg-muted)]">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--fg-secondary)] hidden sm:table-cell">{product.category}</td>
                    <td className="px-4 py-3 text-[var(--fg-secondary)] capitalize hidden md:table-cell">{product.gender.toLowerCase()}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--fg)]">{formatTND(product.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          product.inStock
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                        role="status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                          className="text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--accent)]/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--error)] transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
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

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between bg-[var(--bg-secondary)]">
            <p className="text-xs text-[var(--fg-muted)]">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[var(--border)] p-6 max-w-sm w-full space-y-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--fg)]">Delete Product</h3>
                <p className="text-xs text-[var(--fg-muted)]">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-[var(--fg-secondary)]">
              The product will be permanently removed from your catalog.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>
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
