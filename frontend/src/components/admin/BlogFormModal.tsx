'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Plus, Minus } from 'lucide-react'
import { useCreateBlogPost, useUpdateBlogPost } from '@/hooks'
import type { BlogPost } from '@/types'
import { z } from 'zod'

const blogSchema = z.object({
  title: z.string().min(3, 'Titre trop court'),
  slug: z.string().min(3, 'Slug trop court'),
  excerpt: z.string().min(10, 'Résumé trop court'),
  content: z.string().min(20, 'Contenu trop court'),
  coverImage: z.string().url('URL invalide').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  published: z.boolean(),
})

interface Props { post?: BlogPost; onClose: () => void }

export default function BlogFormModal({ post, onClose }: Props) {
  const create = useCreateBlogPost()
  const update = useUpdateBlogPost()
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: [''], published: false })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (post) setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, coverImage: post.coverImage ?? '', tags: post.tags.length ? post.tags : [''], published: post.published })
  }, [post])

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const payload = { ...form, tags: form.tags.filter(Boolean) }
    const result = blogSchema.safeParse(payload)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    
    onClose()
    if (post) update.mutate({ id: post.id, ...payload })
    else create.mutate(payload)
  }

  const isLoading = create.isPending || update.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">{post ? 'Modifier l\'article' : 'Nouvel article'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titre *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} required className={`w-full px-3 py-2.5 rounded-xl border ${errors.title ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30`} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug</label>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl border ${errors.slug ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30`} />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image de couverture</label>
              <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://…" className={`w-full px-3 py-2.5 rounded-xl border ${errors.coverImage ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30`} />
              {errors.coverImage && <p className="text-red-500 text-xs mt-1">{errors.coverImage}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Résumé *</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} required className={`w-full px-3 py-2.5 rounded-xl border ${errors.excerpt ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none`} />
            {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contenu *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} required className={`w-full px-3 py-2.5 rounded-xl border ${errors.content ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none`} placeholder="HTML ou Markdown…" />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <div className="space-y-2">
              {form.tags.map((tag, i) => (
                <div key={i} className="flex gap-2">
                  <input value={tag} onChange={e => { const t = [...form.tags]; t[i] = e.target.value; setForm({ ...form, tags: t }) }} placeholder="Next.js, TypeScript…" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                  <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter((_, idx) => idx !== i) })} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400"><Minus size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, tags: [...form.tags, ''] })} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600"><Plus size={14} /> Ajouter un tag</button>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm({ ...form, published: !form.published })} className={`relative w-10 h-6 rounded-full transition-colors ${form.published ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Publier immédiatement</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {isLoading ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</> : post ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
