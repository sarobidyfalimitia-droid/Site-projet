'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, Download, FileText } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useInvoices, useCreateInvoice, useGenerateInvoicePdf } from '@/hooks'
import type { Invoice } from '@/types'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import InvoiceFormModal from '@/components/admin/InvoiceFormModal'

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const { data, isLoading } = useInvoices({ search })
  const generatePdf = useGenerateInvoicePdf()
  const invoices = data?.data ?? []

  const columns = useMemo<ColumnDef<Invoice, unknown>[]>(
    () => [
      {
        header: 'Numéro',
        accessorKey: 'number',
        cell: ({ row }) => <span className="font-mono font-medium text-primary-500">{row.original.number}</span>,
      },
      {
        header: 'Client',
        accessorKey: 'client.name',
        cell: ({ row }) => <span className="text-gray-700 dark:text-gray-300">{row.original.client?.name ?? '—'}</span>,
      },
      {
        header: 'Montant',
        accessorKey: 'amount',
        cell: ({ row }) => <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(row.original.amount)}</span>,
      },
      {
        header: 'Échéance',
        accessorKey: 'dueDate',
        cell: ({ row }) => <span className="text-gray-500 text-sm">{formatDate(row.original.dueDate)}</span>,
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
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.pdfUrl ? (
              <a href={row.original.pdfUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors">
                <Download size={15} />
              </a>
            ) : (
              <button onClick={() => generatePdf.mutate(row.original.id)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors">
                <FileText size={15} />
              </button>
            )}
          </div>
        ),
      },
    ],
    [generatePdf]
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Factures</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} factures</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouvelle facture
        </button>
      </div>
      <div className="card p-6">
        <div className="relative mb-5 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>
        <DataTable data={invoices} columns={columns} isLoading={isLoading} />
      </div>
      {showModal && <InvoiceFormModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
