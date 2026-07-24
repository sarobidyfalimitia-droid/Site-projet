'use client'

import { FolderKanban, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useProjects } from '@/hooks'
import { formatDate, truncate } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function ClientProjectsPage() {
  const { data, isLoading } = useProjects({ limit: 50 })
  const projects = data?.data ?? []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Mes projets</h1><p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} projet(s)</p></div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <div className="card p-16 text-center"><FolderKanban size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" /><p className="text-gray-400">Aucun projet en cours</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors"><ExternalLink size={14} /></a>}
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${p.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{p.published ? 'Livré' : 'En cours'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">{truncate(p.excerpt, 100)}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.technologies.slice(0, 4).map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono">{t}</span>)}
              </div>
              <p className="text-xs text-gray-400 mt-3">{formatDate(p.realizedAt)}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
