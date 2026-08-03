'use client'

import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'
import { useContracts } from '@/hooks'
import { getStatusColor, getStatusLabel } from '@/lib/utils'

export default function ClientContractsPage() {
  const { t } = useLocale()
  const { data: contractsData } = useContracts()
  const contracts = contractsData?.data ?? []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t.myContracts}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.allContracts}</p>
      </motion.div>

      {contracts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <Briefcase size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t.noProjects}</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract, i) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{contract.title}</h3>
                  {contract.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{contract.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {contract.startDate && <span>{t.startDate}: {new Date(contract.startDate).toLocaleDateString()}</span>}
                    {contract.endDate && <span>• {t.endDate}: {new Date(contract.endDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${getStatusColor(contract.status)}`}>
                  {getStatusLabel(contract.status)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}