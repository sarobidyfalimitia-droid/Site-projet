'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Plus, Minus } from 'lucide-react'
import { useCreateTeamMember, useUpdateTeamMember } from '@/hooks'
import type { TeamMember } from '@/types'
import { z } from 'zod'

const teamFormSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  role: z.string().min(2, 'Poste requis'),
  bio: z.string().min(10, 'Biographie trop courte (min. 10)'),
  photo: z.string().url('URL invalide').optional().or(z.literal('')),
  portfolioUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  skills: z.array(z.string().min(1)).optional(),
  socials: z.array(z.string().min(1)).optional(),
  featured: z.boolean(),
  published: z.boolean(),
})

interface Props { member?: TeamMember; onClose: () => void }

export default function TeamMemberFormModal({ member, onClose }: Props) {
  const create = useCreateTeamMember()
  const update = useUpdateTeamMember()
  const [form, setForm] = useState({
    name: '', role: '', bio: '', photo: '', portfolioUrl: '',
    skills: [''], socials: [''], featured: false, published: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (member) setForm({
      name: member.name, role: member.role, bio: member.bio,
      photo: member.photo ?? '', portfolioUrl: member.portfolioUrl ?? '',
      skills: member.skills.length ? member.skills : [''],
      socials: member.socials.length ? member.socials : [''],
      featured: member.featured, published: member.published,
    })
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    const payload = { ...form, skills: form.skills.filter(Boolean), socials: form.socials.filter(Boolean) }
    const result = teamFormSchema.safeParse(payload)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const key = err.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    onClose()
    if (member) update.mutate({ id: member.id, ...payload })
    else create.mutate(payload)
  }

  const updateArr = (key: 'skills' | 'socials', i: number, val: string) => {
    const arr = [...form[key]]; arr[i] = val; setForm({ ...form, [key]: arr })
  }

  const isLoading = create.isPending || update.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">{member ? 'Modifier le membre' : 'Ajouter un membre'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Nom complet *', required: true },
              { key: 'role', label: 'Poste *', required: true },
            ].map(({ key, label, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input value={form[key as keyof typeof form] as string} onChange={e => setForm({ ...form, [key]: e.target.value })} required={required} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Biographie *</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Photo (URL)</label>
              <input value={form.photo} onChange={e => setForm({ ...form, photo: e.target.value })} placeholder="https://…" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Portfolio URL</label>
              <input value={form.portfolioUrl} onChange={e => setForm({ ...form, portfolioUrl: e.target.value })} placeholder="https://…" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compétences</label>
            <div className="space-y-2">
              {form.skills.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s} onChange={e => updateArr('skills', i, e.target.value)} placeholder="React, Node.js…" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                  <button type="button" onClick={() => setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) })} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400"><Minus size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, skills: [...form.skills, ''] })} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600">
                <Plus size={14} /> Ajouter
              </button>
            </div>
          </div>

          {/* Socials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Réseaux sociaux (URLs)</label>
            <div className="space-y-2">
              {form.socials.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s} onChange={e => updateArr('socials', i, e.target.value)} placeholder="https://linkedin.com/in/…" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                  <button type="button" onClick={() => setForm({ ...form, socials: form.socials.filter((_, idx) => idx !== i) })} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400"><Minus size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setForm({ ...form, socials: [...form.socials, ''] })} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600">
                <Plus size={14} /> Ajouter
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[{ key: 'published', label: 'Visible' }, { key: 'featured', label: 'Mis en avant' }].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })} className={`relative w-10 h-6 rounded-full transition-colors ${form[key as keyof typeof form] ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key as keyof typeof form] ? 'translate-x-4' : ''}`} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Annuler</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {isLoading ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</> : member ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
