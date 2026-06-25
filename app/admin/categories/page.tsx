'use client'

import { useEffect, useState } from 'react'
import { adminApi, type AdminCategory } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', image: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = async () => {
    try {
      const data = await adminApi.getCategories()
      setCategories(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm({ name: '', slug: '', description: '', image: '' })
    setShowForm(true)
    setError(null)
  }

  const openEdit = (cat: AdminCategory) => {
    setEditingId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image })
    setShowForm(true)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, form)
      } else {
        await adminApi.createCategory(form)
      }
      setShowForm(false)
      fetchCategories()
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await adminApi.deleteCategory(deleteId)
      setDeleteId(null)
      fetchCategories()
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? (err as { message: string }).message : 'Failed'
      setError(msg)
      setDeleteId(null)
    } finally {
      setDeleting(false)
    }
  }

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Categories</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{categories.length} categories</p>
        </div>
        <Button variant="primary" size="md" onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Category
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[var(--fg)]">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => {
                  setForm((p) => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) }))
                }}
                required
                aria-required="true"
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                required
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              />
            </div>
            <Input
              label="Image URL"
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="/images/categories/..."
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="primary" type="submit" isLoading={saving}>
                {editingId ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--fg-muted)]">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-10 h-10 text-[var(--fg-muted)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" />
            </svg>
            <p className="text-sm text-[var(--fg-muted)] mb-2">No categories yet</p>
            <p className="text-xs text-[var(--fg-muted)]">Create your first category to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="min-w-0">
                  <p className="font-medium text-[var(--fg)]">{cat.name}</p>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">/{cat.slug} &middot; {cat.productCount} product{cat.productCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--accent)]/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--error)] transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
                <h3 className="text-base font-semibold text-[var(--fg)]">Delete Category</h3>
                <p className="text-xs text-[var(--fg-muted)]">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-[var(--fg-secondary)]">
              This will only work if the category has no products. Otherwise, you must reassign products first.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" size="sm" isLoading={deleting} onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
