'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks'
import type { Category } from '@/types'

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const createCat = useCreateCategory()
  const updateCat = useUpdateCategory()
  const deleteCat = useDeleteCategory()

  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState<Category | undefined>()
  const [form, setForm] = useState({ name: '', slug: '' })

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s]+/g, '-')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editCat) await updateCat.mutateAsync({ id: editCat.id, ...form })
    else await createCat.mutateAsync(form)
    setShowForm(false); setEditCat(undefined); setForm({ name: '', slug: '' })
  }

  const handleEdit = (cat: Category) => {
    setEditCat(cat); setForm({ name: cat.name, slug: cat.slug }); setShowForm(true)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Catégories</h1><p className="text-gray-500 text-sm mt-1">{(categories ?? []).length} catégorie(s)</p></div>
        <button onClick={() => { setEditCat(undefined); setForm({ name: '', slug: '' }); setShowForm(true) }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Nouvelle catégorie</button>
      </div>

      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">{editCat ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h3>
            <button onClick={() => { setShowForm(false); setEditCat(undefined) }} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1">
              <input value={form.name} onChange={e => setForm({ name: e.target.value, slug: slugify(e.target.value) })} placeholder="Nom de la catégorie" required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
            <div className="flex-1">
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="slug" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
            <button type="submit" disabled={createCat.isPending || updateCat.isPending} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {(createCat.isPending || updateCat.isPending) ? <Loader2 size={15} className="animate-spin" /> : editCat ? 'Modifier' : 'Créer'}
            </button>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
        ) : (categories ?? []).length === 0 ? (
          <div className="p-12 text-center text-gray-400">Aucune catégorie. Créez-en une !</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Projets</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {(categories ?? []).map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{cat._count?.projects ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => handleEdit(cat)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => { if (confirm('Supprimer ?')) deleteCat.mutate(cat.id) }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
