'use client'

import { motion } from 'framer-motion'
import { Receipt, Download } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'
import { useInvoices } from '@/hooks'
import { getStatusColor, getStatusLabel } from '@/lib/utils'

export default function ClientInvoicesPage() {
  const { t } = useLocale()
  const { data: invoicesData } = useInvoices()
  const invoices = invoicesData?.data ?? []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t.myInvoices}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.allInvoices}</p>
      </motion.div>

      {invoices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <Receipt size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t.noProjects}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice, i) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {t.invoiceNumber} #{invoice.number}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    {invoice.quote && <span>{t.quoteTitle}: {invoice.quote.title}</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{t.amount}: {invoice.amount}€</span>
                    <span>• {t.dueDate}: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invoice.pdfUrl && (
                    <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-primary-500">
                      <Download size={16} />
                    </a>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${getStatusColor(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}