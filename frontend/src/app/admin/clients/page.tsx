'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Mail, Phone } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useClients, useDeleteClient } from '@/hooks'
import type { Client } from '@/types'
import { formatDate, getStatusColor, getStatusLabel, getInitials } from '@/lib/utils'
import ClientFormModal from '@/components/admin/ClientFormModal'

export default function AdminClientsPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editClient, setEditClient] = useState<Client | undefined>()

  const { data, isLoading } = useClients({ search })
  const deleteClient = useDeleteClient()
  const clients = data?.data ?? []

  const columns = useMemo<ColumnDef<Client, unknown>[]>(
    () => [
      {
        header: 'Client',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(row.original.name)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{row.original.name}</p>
              {row.original.company && <p className="text-xs text-gray-400">{row.original.company}</p>}
            </div>
          </div>
        ),
      },
      {
        header: 'Contact',
        id: 'contact',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Mail size={12} /> {row.original.email}
            </div>
            {row.original.phone && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Phone size={12} /> {row.original.phone}
              </div>
            )}
          </div>
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
        header: 'Projets',
        accessorKey: '_count.projects',
        cell: ({ row }) => (
          <span className="font-medium text-gray-900 dark:text-white">{row.original._count?.projects ?? 0}</span>
        ),
      },
      {
        header: 'Inscrit le',
        accessorKey: 'createdAt',
        cell: ({ row }) => <span className="text-gray-500 text-sm">{formatDate(row.original.createdAt)}</span>,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setEditClient(row.original); setShowModal(true) }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => { if (confirm('Supprimer ce client ?')) deleteClient.mutate(row.original.id) }}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [deleteClient]
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} clients enregistrés</p>
        </div>
        <button onClick={() => { setEditClient(undefined); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouveau client
        </button>
      </div>
      <div className="card p-6">
        <div className="relative mb-5 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>
        <DataTable data={clients} columns={columns} isLoading={isLoading} pageSize={10} />
      </div>
      {showModal && <ClientFormModal client={editClient} onClose={() => { setShowModal(false); setEditClient(undefined) }} />}
    </div>
  )
}
