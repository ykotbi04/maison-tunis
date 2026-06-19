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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground tracking-wider">Categories</h1>
          <p className="text-sm text-muted mt-1">{categories.length} categories</p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>+ New Category</Button>
      </div>

      {error && (
        <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg p-4">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-background-secondary rounded-lg border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground tracking-wide">
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
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 bg-background-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </div>
            <Input
              label="Image URL"
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="/images/categories/..."
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="primary" type="submit" isLoading={saving}>
                {editingId ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-background-secondary rounded-lg border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted">No categories yet</div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-background/50 transition-colors">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted">/{cat.slug} &middot; {cat.productCount} product{cat.productCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-xs text-muted hover:text-[var(--color-accent)] transition-colors px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="text-xs text-muted hover:text-[var(--color-error)] transition-colors px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background-secondary rounded-lg border border-border p-6 max-w-sm w-full space-y-4">
            <h3 className="font-serif text-xl text-foreground">Delete Category</h3>
            <p className="text-sm text-muted">
              This will only work if the category has no products. Otherwise, you must reassign products first.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" size="sm" isLoading={deleting} onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
