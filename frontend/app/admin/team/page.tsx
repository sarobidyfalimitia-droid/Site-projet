'use client'

import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Star } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useTeam, useDeleteTeamMember } from '@/hooks'
import type { TeamMember } from '@/types'
import { buildImageUrl, getInitials } from '@/lib/utils'
import Image from 'next/image'
import TeamMemberFormModal from '@/components/admin/TeamMemberFormModal'

export default function AdminTeamPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editMember, setEditMember] = useState<TeamMember | undefined>()

  const { data: members, isLoading } = useTeam()
  const deleteMember = useDeleteTeamMember()

  const filtered = (members ?? []).filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
  )

  const columns = useMemo<ColumnDef<TeamMember, unknown>[]>(
    () => [
      {
        header: 'Membre',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-purple-500 shrink-0 flex items-center justify-center">
              {row.original.photo ? (
                <Image src={buildImageUrl(row.original.photo)} alt={row.original.name} fill className="object-cover" />
              ) : (
                <span className="text-white text-xs font-bold">{getInitials(row.original.name)}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                {row.original.name}
                {row.original.featured && <Star size={12} className="text-amber-400 fill-amber-400" />}
              </p>
              <p className="text-xs text-primary-500">{row.original.role}</p>
            </div>
          </div>
        ),
      },
      {
        header: 'Compétences',
        accessorKey: 'skills',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.skills.slice(0, 4).map(s => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono">{s}</span>
            ))}
            {row.original.skills.length > 4 && <span className="text-xs text-gray-400">+{row.original.skills.length - 4}</span>}
          </div>
        ),
      },
      {
        header: 'Statut',
        accessorKey: 'published',
        cell: ({ row }) => (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${row.original.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
            {row.original.published ? 'Visible' : 'Masqué'}
          </span>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button onClick={() => { setEditMember(row.original); setShowModal(true) }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors">
              <Pencil size={15} />
            </button>
            <button onClick={() => { if (confirm('Supprimer ce membre ?')) deleteMember.mutate(row.original.id) }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [deleteMember]
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Équipe</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} membre(s)</p>
        </div>
        <button onClick={() => { setEditMember(undefined); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>
      <div className="card p-6">
        <div className="relative mb-5 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>
        <DataTable data={filtered} columns={columns} isLoading={isLoading} />
      </div>
      {showModal && <TeamMemberFormModal member={editMember} onClose={() => { setShowModal(false); setEditMember(undefined) }} />}
    </div>
  )
}
