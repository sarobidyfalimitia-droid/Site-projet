'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Une erreur est survenue</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{error.message || 'Quelque chose s\'est mal passé.'}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={reset} className="btn-primary flex items-center gap-2">
            <RefreshCw size={16} /> Réessayer
          </button>
          <Link href="/" className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
