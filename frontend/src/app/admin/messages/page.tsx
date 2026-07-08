'use client'

import { useMemo } from 'react'
import { CheckCheck, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useMessages } from '@/hooks'
import { messagesService } from '@/services'
import { useQueryClient } from '@tanstack/react-query'
import type { Message } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminMessagesPage() {
  const { data, isLoading } = useMessages()
  const qc = useQueryClient()
  const messages = data?.data ?? []

  const markRead = async (id: number) => {
    await messagesService.markRead(id)
    qc.invalidateQueries({ queryKey: ['messages'] })
  }

  const deleteMsg = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return
    await messagesService.delete(id)
    qc.invalidateQueries({ queryKey: ['messages'] })
    toast.success('Message supprimé')
  }

  const columns = useMemo<ColumnDef<Message, unknown>[]>(
    () => [
      {
        header: 'De',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div>
            <p className={cn('font-medium', !row.original.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400')}>
              {!row.original.read && <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mr-2" />}
              {row.original.name}
            </p>
            <p className="text-xs text-gray-400">{row.original.email}</p>
          </div>
        ),
      },
      {
        header: 'Sujet',
        accessorKey: 'subject',
        cell: ({ row }) => <span className={cn('text-sm', !row.original.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400')}>{row.original.subject}</span>,
      },
      {
        header: 'Message',
        accessorKey: 'body',
        enableSorting: false,
        cell: ({ row }) => <span className="text-sm text-gray-500 line-clamp-1">{row.original.body.slice(0, 80)}…</span>,
      },
      {
        header: 'Reçu le',
        accessorKey: 'createdAt',
        cell: ({ row }) => <span className="text-xs text-gray-400">{formatDate(row.original.createdAt)}</span>,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {!row.original.read && (
              <button onClick={() => markRead(row.original.id)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-colors" title="Marquer lu">
                <CheckCheck size={15} />
              </button>
            )}
            <button onClick={() => deleteMsg(row.original.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">{messages.filter((m) => !m.read).length} message(s) non lu(s)</p>
      </div>
      <div className="card p-6">
        <DataTable data={messages} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  )
}
