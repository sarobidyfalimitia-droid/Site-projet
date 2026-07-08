'use client'

import { Download, FileText } from 'lucide-react'
import { useInvoices } from '@/hooks'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ClientInvoicesPage() {
  const { data, isLoading } = useInvoices()
  const invoices = data?.data ?? []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Mes factures</h1><p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} facture(s)</p></div>
      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card h-16 animate-pulse bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : invoices.length === 0 ? (
        <div className="card p-16 text-center"><FileText size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" /><p className="text-gray-400">Aucune facture pour le moment</p></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 dark:bg-gray-900/50">{['Numéro', 'Montant', 'Échéance', 'Statut', ''].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {invoices.map((inv, i) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary-500 font-medium">{inv.number}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(inv.status)}`}>{getStatusLabel(inv.status)}</span></td>
                  <td className="px-4 py-3 text-right">
                    {inv.pdfUrl && <a href={inv.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-500 text-xs font-medium transition-colors"><Download size={13} /> PDF</a>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
