'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'
import { useAppointments } from '@/hooks'
import { getStatusColor, getStatusLabel } from '@/lib/utils'

export default function ClientAppointmentsPage() {
  const { t } = useLocale()
  const { data: appointmentsData } = useAppointments()
  const appointments = appointmentsData?.data ?? []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t.myAppointments}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.allAppointments}</p>
      </motion.div>

      {appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <Calendar size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t.noAppointments}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment, i) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{appointment.subject}</h3>
                  {appointment.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{appointment.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>{new Date(appointment.scheduledAt).toLocaleString()}</span>
                  </div>
                  {appointment.meetingUrl && (
                    <a href={appointment.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:text-primary-600 mt-2 inline-block">
                      {t.meetingUrl}
                    </a>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${getStatusColor(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}