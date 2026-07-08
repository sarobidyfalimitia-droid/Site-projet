'use client'

import { useMemo, useState } from 'react'
import { Plus, Download, FileText, Pencil } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useContracts, useCreateContract } from '@/hooks'
import { contractsService } from '@/services'
import type { Contract } from '@/types'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminContractsPage() {
  const { data, isLoading } = useContracts()
  const contracts = data?.data ?? []

  const columns = useMemo<ColumnDef<Contract, unknown>[]>(() => [
    {
      header: 'Titre',
      accessorKey: 'title',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.original.title}</p>
          {row.original.client && <p className="text-xs text-gray-400">{row.original.client.name}</p>}
        </div>
      ),
    },
    {
      header: 'Période',
      id: 'period',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.startDate ? formatDate(row.original.startDate) : '—'}
          {row.original.endDate ? ` → ${formatDate(row.original.endDate)}` : ''}
        </span>
      ),
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
      header: 'Créé le',
      accessorKey: 'createdAt',
      cell: ({ row }) => <span className="text-sm text-gray-500">{formatDate(row.original.createdAt)}</span>,
    },
    {
      header: 'Actions',
      id: 'actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original.pdfUrl ? (
            <a href={row.original.pdfUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors"><Download size={15} /></a>
          ) : (
            <button onClick={async () => {
              try { await contractsService.generatePdf(row.original.id); toast.success('PDF généré') }
              catch { toast.error('Erreur génération PDF') }
            }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors"><FileText size={15} /></button>
          )}
        </div>
      ),
    },
  ], [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Contrats</h1><p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} contrat(s)</p></div>
      </div>
      <div className="card p-6">
        <DataTable data={contracts} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  )
}
