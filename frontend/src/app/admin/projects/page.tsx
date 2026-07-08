'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, Eye, Star, Globe } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useProjects, useDeleteProject } from '@/hooks'
import type { Project } from '@/types'
import { formatDate, getStatusColor, buildImageUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import ProjectFormModal from '@/components/admin/ProjectFormModal'

export default function AdminProjectsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editProject, setEditProject] = useState<Project | undefined>()

  const { data, isLoading } = useProjects({ search, page, limit: 20 })
  const deleteProject = useDeleteProject()

  const projects = data?.data ?? []

  const columns = useMemo<ColumnDef<Project, unknown>[]>(
    () => [
      {
        header: 'Projet',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
              {row.original.coverImage && (
                <Image src={buildImageUrl(row.original.coverImage)} alt={row.original.title} fill className="object-cover" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{row.original.title}</p>
              <p className="text-xs text-gray-400">{row.original.slug}</p>
            </div>
          </div>
        ),
      },
      {
        header: 'Catégorie',
        accessorKey: 'category.name',
        cell: ({ row }) => row.original.category ? (
          <span className="px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium">
            {row.original.category.name}
          </span>
        ) : '—',
      },
      {
        header: 'Technologies',
        accessorKey: 'technologies',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.technologies.slice(0, 3).map((t) => (
              <span key={t} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono">{t}</span>
            ))}
            {row.original.technologies.length > 3 && <span className="text-xs text-gray-400">+{row.original.technologies.length - 3}</span>}
          </div>
        ),
      },
      {
        header: 'Statut',
        accessorKey: 'published',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${row.original.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
              {row.original.published ? 'Publié' : 'Brouillon'}
            </span>
            {row.original.featured && <Star size={13} className="text-amber-400 fill-amber-400" />}
          </div>
        ),
      },
      {
        header: 'Date',
        accessorKey: 'realizedAt',
        cell: ({ row }) => <span className="text-gray-500">{formatDate(row.original.realizedAt)}</span>,
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Link href={`/projets/${row.original.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-colors">
              <Eye size={15} />
            </Link>
            <button
              onClick={() => { setEditProject(row.original); setShowModal(true) }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => { if (confirm('Supprimer ce projet ?')) deleteProject.mutate(row.original.id) }}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [deleteProject]
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Projets</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} projets au total</p>
        </div>
        <button
          onClick={() => { setEditProject(undefined); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Nouveau projet
        </button>
      </div>

      <div className="card p-6">
        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>

        <DataTable data={projects} columns={columns} isLoading={isLoading} />
      </div>

      {showModal && (
        <ProjectFormModal
          project={editProject}
          onClose={() => { setShowModal(false); setEditProject(undefined) }}
        />
      )}
    </div>
  )
}
