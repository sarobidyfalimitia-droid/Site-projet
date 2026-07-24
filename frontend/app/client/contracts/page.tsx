'use client'

import { Briefcase, Download } from 'lucide-react'
import { useContracts } from '@/hooks'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ClientContractsPage() {
  const { data, isLoading } = useContracts()
  const contracts = data?.data ?? []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Mes contrats</h1><p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} contrat(s)</p></div>
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}</div>
      ) : contracts.length === 0 ? (
        <div className="card p-16 text-center"><Briefcase size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" /><p className="text-gray-400">Aucun contrat disponible</p></div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Briefcase size={18} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white">{c.title}</p>
                <p className="text-xs text-gray-400">{c.startDate ? `Du ${formatDate(c.startDate)}` : ''}{c.endDate ? ` au ${formatDate(c.endDate)}` : ''}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(c.status)}`}>{getStatusLabel(c.status)}</span>
              {c.pdfUrl && (
                <a href={c.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 text-xs font-medium hover:bg-primary-50 hover:text-primary-500 transition-colors">
                  <Download size={13} /> PDF
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
