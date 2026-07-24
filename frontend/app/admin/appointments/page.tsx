'use client'

import { useMemo } from 'react'
import { Calendar, Video, CheckCircle, XCircle } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useAppointments, useUpdateAppointment } from '@/hooks'
import type { Appointment } from '@/types'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

export default function AdminAppointmentsPage() {
  const { data, isLoading } = useAppointments()
  const updateApt = useUpdateAppointment()
  const appointments = data?.data ?? []

  const columns = useMemo<ColumnDef<Appointment, unknown>[]>(() => [
    {
      header: 'Client',
      accessorKey: 'client.name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.original.client?.name ?? 'Anonyme'}</p>
          <p className="text-xs text-gray-400">{row.original.client?.email}</p>
        </div>
      ),
    },
    {
      header: 'Sujet',
      accessorKey: 'subject',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">{row.original.subject}</p>
          {row.original.description && <p className="text-xs text-gray-400 line-clamp-1">{row.original.description}</p>}
        </div>
      ),
    },
    {
      header: 'Date & Heure',
      accessorKey: 'scheduledAt',
      cell: ({ row }) => <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(row.original.scheduledAt, 'dd MMM yyyy HH:mm')}</span>,
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
          {row.original.status === 'PENDING' && (
            <>
              <button
                onClick={() => updateApt.mutate({ id: row.original.id, status: 'CONFIRMED', meetingUrl: `https://meet.google.com/new` })}
                className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-500 transition-colors"
                title="Confirmer"
              >
                <CheckCircle size={15} />
              </button>
              <button
                onClick={() => updateApt.mutate({ id: row.original.id, status: 'CANCELLED' })}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                title="Annuler"
              >
                <XCircle size={15} />
              </button>
            </>
          )}
          {row.original.meetingUrl && (
            <a href={row.original.meetingUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-colors" title="Rejoindre">
              <Video size={15} />
            </a>
          )}
        </div>
      ),
    },
  ], [updateApt])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Rendez-vous</h1>
        <p className="text-gray-500 text-sm mt-1">{appointments.filter(a => a.status === 'PENDING').length} en attente de confirmation</p>
      </div>
      <div className="card p-6">
        <DataTable data={appointments} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  )
}
