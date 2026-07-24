'use client'

import { Bell, CheckCircle, FileText, Calendar, Receipt, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { timeAgo } from '@/lib/utils'

// Static demo notifications — in production wire to Socket.io / backend
const demoNotifications = [
  { id: '1', type: 'quote', title: 'Devis approuvé', body: 'Votre demande de devis "Application Mobile" a été approuvée.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '2', type: 'invoice', title: 'Nouvelle facture', body: 'La facture F-2024-032 de 4 500 € est disponible.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: '3', type: 'appointment', title: 'Rendez-vous confirmé', body: 'Votre rendez-vous du 15 janvier est confirmé. Lien Google Meet disponible.', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: '4', type: 'system', title: 'Bienvenue !', body: 'Bienvenue dans votre espace client Techno-logia. N\'hésitez pas à nous contacter.', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
]

const iconMap: Record<string, React.ElementType> = {
  quote: FileText, invoice: Receipt, appointment: Calendar, system: Info, message: Bell,
}
const colorMap: Record<string, string> = {
  quote: 'text-violet-500 bg-violet-50 dark:bg-violet-900/30',
  invoice: 'text-green-500 bg-green-50 dark:bg-green-900/30',
  appointment: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
  system: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
  message: 'text-pink-500 bg-pink-50 dark:bg-pink-900/30',
}

export default function ClientNotificationsPage() {
  const unread = demoNotifications.filter(n => !n.read).length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">{unread} non lue(s)</p>
        </div>
        {unread > 0 && (
          <button className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1.5">
            <CheckCircle size={15} /> Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="space-y-2">
        {demoNotifications.map((notif, i) => {
          const Icon = iconMap[notif.type] ?? Bell
          const colorClass = colorMap[notif.type] ?? 'text-gray-500 bg-gray-50'
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`card p-4 flex items-start gap-4 transition-all ${!notif.read ? 'border-l-2 border-primary-500' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {!notif.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 mb-0.5 align-middle" />}
                    {notif.title}
                  </p>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(notif.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notif.body}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
