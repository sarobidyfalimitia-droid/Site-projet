'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { Send, Upload, CheckCircle, Loader2, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { quotesService } from '@/services'
import toast from 'react-hot-toast'

const budgetRanges = [
  '< 2 000 €',
  '2 000 - 5 000 €',
  '5 000 - 10 000 €',
  '10 000 - 20 000 €',
  '20 000 - 50 000 €',
  '> 50 000 €',
]

const services = [
  'Développement Web',
  'Développement Mobile',
  'UI/UX Design',
  'Application métier',
  'Maintenance',
  'Hébergement',
  'Autre',
]

export default function DemandeDevisPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [form, setForm] = useState({
    contactName: '', contactEmail: '', contactPhone: '', company: '',
    title: '', description: '', budgetRange: '', deadline: '', service: '',
  })

  useEffect(() => {
    // Reset form and files on mount
    setForm({ contactName: '', contactEmail: '', contactPhone: '', company: '', title: '', description: '', budgetRange: '', deadline: '', service: '' })
    setFiles([])
  }, [])

  useEffect(() => {
    // Enforce authentication: redirect to login with return URL
    // Ne pas rediriger si on est en train de charger l'utilisateur
    if (!isAuthenticated && !isLoading) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/demande-devis')}`)
    }
  }, [isAuthenticated, isLoading, router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 5)),
    accept: { 'image/*': [], 'application/pdf': [], 'application/msword': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [] },
    maxSize: 10 * 1024 * 1024,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await quotesService.submitPublic(form)
      setSent(true)
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Demande envoyée !</h2>
          <p className="text-gray-500 mb-8">Merci pour votre demande. Notre équipe vous contactera dans les 24 heures.</p>
          <a href="/" className="btn-primary inline-block">Retour à l&apos;accueil</a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-purple-700 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold text-white mb-4"
          >
            Demander un devis
          </motion.h1>
          <p className="text-white/80 text-lg">
            Décrivez votre projet et recevez une offre personnalisée sous 24h.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact info */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Vos coordonnées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'contactName', label: 'Nom complet *', placeholder: 'Jean Dupont', type: 'text', required: true },
                { key: 'contactEmail', label: 'Email professionnel *', placeholder: 'jean@societe.fr', type: 'email', required: true },
                { key: 'contactPhone', label: 'Téléphone', placeholder: '+33 6 …', type: 'tel' },
                { key: 'company', label: 'Société', placeholder: 'Ma Société SAS', type: 'text' },
              ].map(({ key, label, placeholder, type, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                  <input
                    type={type}
                    inputMode={key === 'contactPhone' ? 'tel' : undefined}
                    pattern={key === 'contactPhone' ? '^[+0-9()\\s-]{4,20}$' : undefined}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project info */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Votre projet</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Titre du projet *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Application e-commerce, Site vitrine, CRM…"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de service</label>
                <div className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, service: s })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.service === s ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description du projet *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  placeholder="Décrivez votre projet en détail : fonctionnalités souhaitées, public cible, intégrations nécessaires, inspirations…"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Budget estimé</label>
                  <select
                    value={form.budgetRange}
                    onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  >
                    <option value="">Sélectionner…</option>
                    {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Délai souhaité</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* File upload */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Documents (optionnel)</h2>
            <p className="text-sm text-gray-500 mb-4">Cahier des charges, maquettes, références… (max 5 fichiers, 10 Mo)</p>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
            >
              <input {...getInputProps()} />
              <Upload size={28} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {isDragActive ? 'Déposez ici…' : 'Glissez vos fichiers ou cliquez pour parcourir'}
              </p>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-xs text-gray-400">{(f.size / 1024).toFixed(0)} Ko</span>
                    <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-8 py-3.5 text-base disabled:opacity-60"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours…</> : <><Send size={18} /> Envoyer ma demande</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
