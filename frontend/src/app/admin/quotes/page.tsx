'use client'

import { useMemo, useState } from 'react'
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useQuotes, useUpdateQuoteStatus, useDeleteQuote } from '@/hooks'
import type { Quote } from '@/types'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

export default function AdminQuotesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const { data, isLoading } = useQuotes({ search, status: status || undefined })
  const updateStatus = useUpdateQuoteStatus()
  const deleteQuote = useDeleteQuote()
  const quotes = data?.data ?? []

  const columns = useMemo<ColumnDef<Quote, unknown>[]>(
    () => [
      {
        header: 'Titre',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.original.title}</p>
            <p className="text-xs text-gray-400">{row.original.contactEmail}</p>
          </div>
        ),
      },
      {
        header: 'Contact',
        accessorKey: 'contactName',
        cell: ({ row }) => (
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{row.original.contactName ?? row.original.client?.name ?? '—'}</p>
            {row.original.company && <p className="text-xs text-gray-400">{row.original.company}</p>}
          </div>
        ),
      },
      {
        header: 'Budget',
        accessorKey: 'budgetRange',
        cell: ({ row }) => <span className="text-gray-600 dark:text-gray-400">{row.original.budgetRange ?? '—'}</span>,
      },
      {
        header: 'Statut',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(row.original.status)}`}>
            {getStatusLabel(row.original.status)}
          </span>
        ),
      },
      {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: ({ row }) => <span className="text-gray-500 text-sm">{formatDate(row.original.createdAt)}</span>,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.status === 'PENDING' && (
              <>
                <button
                  onClick={() => updateStatus.mutate({ id: row.original.id, status: 'APPROVED' })}
                  className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-500 transition-colors"
                  title="Approuver"
                >
                  <CheckCircle size={15} />
                </button>
                <button
                  onClick={() => updateStatus.mutate({ id: row.original.id, status: 'REJECTED' })}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                  title="Refuser"
                >
                  <XCircle size={15} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [updateStatus]
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Devis</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} devis reçus</p>
        </div>
      </div>
      <div className="card p-6">
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none">
            <option value="">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvés</option>
            <option value="REJECTED">Refusés</option>
            <option value="DRAFT">Brouillons</option>
          </select>
        </div>
        <DataTable data={quotes} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  )
}
