'use client'

import { FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useQuotes } from '@/hooks'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ClientQuotesPage() {
  const { data, isLoading } = useQuotes()
  const quotes = data?.data ?? []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Mes devis</h1><p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} demande(s)</p></div>
        <Link href="/demande-devis" className="btn-primary flex items-center gap-2"><FileText size={15} /> Nouvelle demande</Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}</div>
      ) : quotes.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Aucune demande de devis pour le moment.</p>
          <Link href="/demande-devis" className="btn-primary inline-flex items-center gap-2">Faire une demande <ArrowRight size={15} /></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-violet-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{q.title}</p>
                <p className="text-xs text-gray-400">{formatDate(q.createdAt)}{q.budgetRange ? ` · Budget : ${q.budgetRange}` : ''}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${getStatusColor(q.status)}`}>{getStatusLabel(q.status)}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
