'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { testimonialsService } from '@/services'
import { useQueryClient } from '@tanstack/react-query'
import type { Testimonial } from '@/types'
import toast from 'react-hot-toast'

interface Props { item?: Testimonial; onClose: () => void }

export default function TestimonialFormModal({ item, onClose }: Props) {
  const qc = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ clientName: '', company: '', role: '', quote: '', rating: 5, published: true })

  useEffect(() => {
    if (item) setForm({ clientName: item.clientName, company: item.company ?? '', role: item.role ?? '', quote: item.quote, rating: item.rating, published: item.published })
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (item) await testimonialsService.update(item.id, form)
      else await testimonialsService.create(form)
      qc.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success(item ? 'Témoignage mis à jour' : 'Témoignage ajouté')
      onClose()
    } catch { toast.error('Erreur lors de l\'enregistrement') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">{item ? 'Modifier' : 'Ajouter un témoignage'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[{ key: 'clientName', label: 'Nom *', required: true }, { key: 'company', label: 'Société' }, { key: 'role', label: 'Poste' }].map(({ key, label, required }) => (
              <div key={key} className={key === 'clientName' ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input value={form[key as keyof typeof form] as string} onChange={e => setForm({ ...form, [key]: e.target.value })} required={required} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Note</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={`text-2xl transition-transform hover:scale-110 ${n <= form.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}>★</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Témoignage *</label>
            <textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} rows={4} required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setForm({ ...form, published: !form.published })} className={`relative w-10 h-6 rounded-full transition-colors ${form.published ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Publié</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</> : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
