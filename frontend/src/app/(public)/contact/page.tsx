'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, MessageSquare } from 'lucide-react'
import { messagesService } from '@/services'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await messagesService.sendPublic(form)
      setSent(true)
    } catch {
      toast.error('Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="section-title mb-3">Contactez-nous</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              Une question ? Un projet ? Nous sommes disponibles et répondons sous 24h.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'contact@techno-logia.fr', href: 'mailto:contact@techno-logia.fr' },
              { icon: Phone, label: 'Téléphone', value: '+33 1 23 45 67 89', href: 'tel:+33123456789' },
              { icon: MapPin, label: 'Adresse', value: '123 Rue de l\'Innovation\n75001 Paris, France', href: 'https://maps.google.com' },
              { icon: MessageSquare, label: 'WhatsApp', value: 'Discuter sur WhatsApp', href: 'https://wa.me/33123456789' },
            ].map(({ icon: Icon, label, value, href }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-primary-500 transition-colors">
                  <Icon size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-pre-line">{value}</p>
                </div>
              </motion.a>
            ))}

            {/* Hours */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Horaires</p>
              <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between"><span>Lun – Ven</span><span className="font-medium">9h – 18h</span></div>
                <div className="flex justify-between"><span>Samedi</span><span>Sur RDV</span></div>
                <div className="flex justify-between"><span>Dimanche</span><span className="text-gray-400">Fermé</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-12 text-center h-full flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Message envoyé !</h2>
                <p className="text-gray-500 mb-6">Nous vous répondrons dans les meilleurs délais.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', body: '' }) }} className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { key: 'name', label: 'Nom complet *', type: 'text', placeholder: 'Jean Dupont', required: true },
                    { key: 'email', label: 'Email *', type: 'email', placeholder: 'jean@email.com', required: true },
                  ].map(({ key, label, type, placeholder, required }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                      <input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        required={required}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sujet *</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Objet de votre message"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    rows={6}
                    placeholder="Décrivez votre besoin…"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-7 py-3 disabled:opacity-60">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Envoi…</> : <><Send size={16} /> Envoyer</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
