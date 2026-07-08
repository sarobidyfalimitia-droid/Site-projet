'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Video, Clock, Loader2, X } from 'lucide-react'
import { useAppointments, useCreateAppointment } from '@/hooks'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

export default function ClientAppointmentsPage() {
  const { data, isLoading } = useAppointments()
  const createAppointment = useCreateAppointment()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '', scheduledAt: '' })

  const appointments = data?.data ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createAppointment.mutateAsync(form)
    setShowForm(false)
    setForm({ subject: '', description: '', scheduledAt: '' })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Rendez-vous</h1>
          <p className="text-gray-500 text-sm mt-1">Planifiez et gérez vos rendez-vous</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouveau rendez-vous
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary-500" size={28} /></div>
      ) : appointments.length === 0 ? (
        <div className="card p-16 text-center">
          <Calendar size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Aucun rendez-vous</h3>
          <p className="text-gray-500 text-sm mb-6">Planifiez votre premier rendez-vous avec notre équipe.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto flex items-center gap-2 w-fit">
            <Plus size={16} /> Planifier un rendez-vous
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <Calendar size={20} className="text-primary-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{apt.subject}</h3>
                    <p className="text-sm text-gray-500 mt-1">{apt.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${getStatusColor(apt.status)}`}>
                    {getStatusLabel(apt.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Clock size={13} />{formatDate(apt.scheduledAt, 'dd MMM yyyy à HH:mm')}</span>
                  {apt.meetingUrl && (
                    <a href={apt.meetingUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600">
                      <Video size={13} /> Rejoindre la réunion
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Nouveau rendez-vous</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sujet *</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Discussion projet, revue de maquette…"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date et heure souhaitées *</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Décrivez l'objectif de ce rendez-vous…"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={createAppointment.isPending} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                  {createAppointment.isPending ? <><Loader2 size={15} className="animate-spin" /> Envoi…</> : 'Envoyer la demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
