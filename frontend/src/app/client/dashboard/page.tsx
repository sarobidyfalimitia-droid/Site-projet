'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FolderKanban, FileText, Receipt, Briefcase, Calendar, ArrowRight, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useProjects, useQuotes, useInvoices, useContracts, useAppointments } from '@/hooks'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

export default function ClientDashboard() {
  const { user } = useAuthStore()
  const { data: projectsData } = useProjects({ limit: 5 })
  const { data: quotesData } = useQuotes({ limit: 5 })
  const { data: invoicesData } = useInvoices({ limit: 5 })
  const { data: appointmentsData } = useAppointments({ limit: 3 })

  const projects = projectsData?.data ?? []
  const quotes = quotesData?.data ?? []
  const invoices = invoicesData?.data ?? []
  const appointments = appointmentsData?.data ?? []

  const cards = [
    { label: 'Projets actifs', value: projectsData?.total ?? 0, icon: FolderKanban, href: '/client/projects', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Devis', value: quotesData?.total ?? 0, icon: FileText, href: '/client/quotes', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Factures', value: invoicesData?.total ?? 0, icon: Receipt, href: '/client/invoices', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Rendez-vous', value: appointmentsData?.total ?? 0, icon: Calendar, href: '/client/appointments', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Bonjour, {user?.name?.split(' ')[0] ?? 'Client'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Bienvenue dans votre espace client</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={card.href} className="card p-5 block hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800">
              <div className={`inline-flex p-2.5 rounded-xl ${card.bg} mb-4`}>
                <card.icon size={18} className={card.color} />
              </div>
              <div className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent projects + upcoming appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">Projets récents</h2>
            <Link href="/client/projects" className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">Aucun projet pour le moment</div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shrink-0">
                    <FolderKanban size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(p.realizedAt)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${p.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
                    {p.published ? 'Livré' : 'En cours'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Appointments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">Prochains rendez-vous</h2>
            <Link href="/client/appointments" className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucun rendez-vous planifié</p>
              <Link href="/client/appointments" className="mt-3 inline-block text-xs text-primary-500 hover:text-primary-600">
                Planifier un rendez-vous →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <Clock size={14} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{apt.subject}</p>
                    <p className="text-xs text-gray-400">{formatDate(apt.scheduledAt)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(apt.status)}`}>
                    {getStatusLabel(apt.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent quotes */}
      {quotes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white">Derniers devis</h2>
            <Link href="/client/quotes" className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1">
              Voir tout <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {quotes.slice(0, 3).map((q) => (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <FileText size={15} className="text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{q.title}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(q.status)}`}>
                  {getStatusLabel(q.status)}
                </span>
                <span className="text-xs text-gray-400">{formatDate(q.createdAt)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
