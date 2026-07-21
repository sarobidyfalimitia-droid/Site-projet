'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useCreateClient, useUpdateClient } from '@/hooks'
import type { Client } from '@/types'
import { z } from 'zod'

const clientSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  company: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  password: z.string().min(6, 'Mot de passe trop court').optional().or(z.literal('')),
})

interface Props { client?: Client; onClose: () => void }

export default function ClientFormModal({ client, onClose }: Props) {
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', status: 'active' as 'active' | 'inactive', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (client) setForm({ name: client.name, email: client.email, company: client.company ?? '', phone: client.phone ?? '', status: client.status, password: '' })
  }, [client])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const result = clientSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[err.path[0] as string] = err.message })
      setErrors(fieldErrors)
      return
    }
    
    const payload = { ...form, ...(form.password ? {} : { password: undefined }) }
    onClose()
    if (client) updateClient.mutate({ id: client.id, ...payload })
    else createClient.mutate(payload)
  }

  const isLoading = createClient.isPending || updateClient.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">{client ? 'Modifier client' : 'Nouveau client'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { key: 'name', label: 'Nom complet *', type: 'text', required: true },
            { key: 'email', label: 'Email *', type: 'email', required: true },
            { key: 'company', label: 'Société', type: 'text' },
            { key: 'phone', label: 'Téléphone', type: 'tel' },
            { key: 'password', label: client ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *', type: 'password', required: !client },
          ].map(({ key, label, type, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={required}
                className={`w-full px-3 py-2.5 rounded-xl border ${errors[key] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30`}
              />
              {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Statut</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30">
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Annuler</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {isLoading ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</> : client ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
