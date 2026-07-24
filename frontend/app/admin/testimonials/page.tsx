'use client'

import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useTestimonials } from '@/hooks'
import { testimonialsService } from '@/services'
import { useQueryClient } from '@tanstack/react-query'
import type { Testimonial } from '@/types'
import TestimonialFormModal from '@/components/admin/TestimonialFormModal'
import toast from 'react-hot-toast'

export default function AdminTestimonialsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Testimonial | undefined>()
  const { data: testimonials, isLoading } = useTestimonials()
  const qc = useQueryClient()

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce témoignage ?')) return
    await testimonialsService.delete(id)
    qc.invalidateQueries({ queryKey: ['testimonials'] })
    toast.success('Témoignage supprimé')
  }

  const columns = useMemo<ColumnDef<Testimonial, unknown>[]>(() => [
    {
      header: 'Client',
      accessorKey: 'clientName',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.original.clientName}</p>
          <p className="text-xs text-gray-400">{row.original.role}{row.original.company ? `, ${row.original.company}` : ''}</p>
        </div>
      ),
    },
    {
      header: 'Note',
      accessorKey: 'rating',
      cell: ({ row }) => (
        <div className="flex">
          {[...Array(row.original.rating)].map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
          {[...Array(5 - row.original.rating)].map((_, i) => <Star key={i} size={13} className="text-gray-200 dark:text-gray-700" />)}
        </div>
      ),
    },
    {
      header: 'Témoignage',
      accessorKey: 'quote',
      enableSorting: false,
      cell: ({ row }) => <span className="text-sm text-gray-500 line-clamp-2 max-w-xs">{row.original.quote}</span>,
    },
    {
      header: 'Statut',
      accessorKey: 'published',
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${row.original.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
          {row.original.published ? 'Publié' : 'Masqué'}
        </span>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => { setEditItem(row.original); setShowModal(true) }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors"><Pencil size={15} /></button>
          <button onClick={() => handleDelete(row.original.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ], [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Témoignages</h1><p className="text-gray-500 text-sm mt-1">{(testimonials ?? []).length} témoignage(s)</p></div>
        <button onClick={() => { setEditItem(undefined); setShowModal(true) }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Ajouter</button>
      </div>
      <div className="card p-6">
        <DataTable data={testimonials ?? []} columns={columns} isLoading={isLoading} />
      </div>
      {showModal && <TestimonialFormModal item={editItem} onClose={() => { setShowModal(false); setEditItem(undefined) }} />}
    </div>
  )
}
