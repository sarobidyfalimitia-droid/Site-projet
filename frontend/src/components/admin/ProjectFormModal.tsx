'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Plus, Minus } from 'lucide-react'
import { useCreateProject, useUpdateProject, useCategories } from '@/hooks'
import type { Project } from '@/types'

interface Props {
  project?: Project
  onClose: () => void
}

export default function ProjectFormModal({ project, onClose }: Props) {
  const { data: categories } = useCategories()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    description: '',
    coverImage: '',
    liveUrl: '',
    githubUrl: '',
    technologies: [''],
    published: false,
    featured: false,
    realizedAt: new Date().toISOString().split('T')[0],
    categoryId: 0,
  })

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title,
        slug: project.slug,
        excerpt: project.excerpt,
        description: project.description,
        coverImage: project.coverImage ?? '',
        liveUrl: project.liveUrl ?? '',
        githubUrl: project.githubUrl ?? '',
        technologies: project.technologies.length ? project.technologies : [''],
        published: project.published,
        featured: project.featured,
        realizedAt: project.realizedAt?.split('T')[0] ?? '',
        categoryId: project.categoryId,
      })
    }
  }, [project])

  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, technologies: form.technologies.filter(Boolean) }
    if (project) {
      await updateProject.mutateAsync({ id: project.id, ...payload })
    } else {
      await createProject.mutateAsync(payload)
    }
    onClose()
  }

  const updateTech = (i: number, val: string) => {
    const techs = [...form.technologies]
    techs[i] = val
    setForm({ ...form, technologies: techs })
  }

  const isLoading = createProject.isPending || updateProject.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">
            {project ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titre *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catégorie</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              >
                <option value={0}>Sélectionner…</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Résumé *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (HTML)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image de couverture (URL)</label>
              <input
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://…"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date de réalisation</label>
              <input
                type="date"
                value={form.realizedAt}
                onChange={(e) => setForm({ ...form, realizedAt: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL démo</label>
              <input
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://…"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL GitHub</label>
              <input
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                placeholder="https://github.com/…"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technologies</label>
            <div className="space-y-2">
              {form.technologies.map((tech, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={tech}
                    onChange={(e) => updateTech(i, e.target.value)}
                    placeholder="React, Node.js, …"
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, idx) => idx !== i) })}
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors text-gray-400"
                  >
                    <Minus size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, technologies: [...form.technologies, ''] })}
                className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600"
              >
                <Plus size={14} /> Ajouter une technologie
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[
              { key: 'published', label: 'Publié' },
              { key: 'featured', label: 'Mis en avant' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
                  className={`relative w-10 h-6 rounded-full transition-colors ${form[key as keyof typeof form] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key as keyof typeof form] ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {isLoading ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</> : project ? 'Mettre à jour' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
