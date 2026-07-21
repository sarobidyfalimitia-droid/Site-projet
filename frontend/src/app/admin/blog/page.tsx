'use client'

import { useMemo, useState, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/shared/DataTable'
import { useBlogPosts, useUpdateBlogPost } from '@/hooks'
import { useDebounce } from '@/hooks/useDebounce'
import { blogService } from '@/services'
import { useQueryClient } from '@tanstack/react-query'
import type { BlogPost } from '@/types'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import BlogFormModal from '@/components/admin/BlogFormModal'
import toast from 'react-hot-toast'

export default function AdminBlogPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [showModal, setShowModal] = useState(false)
  const [editPost, setEditPost] = useState<BlogPost | undefined>()
  const { data, isLoading } = useBlogPosts({ search: debouncedSearch || undefined })
  const qc = useQueryClient()
  const posts = data?.data ?? []

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return
    await blogService.delete(id)
    qc.invalidateQueries({ queryKey: ['blog'] })
    toast.success('Article supprimé')
  }, [qc])

  const columns = useMemo<ColumnDef<BlogPost, unknown>[]>(
    () => [
      {
        header: 'Article',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.original.title}</p>
            <p className="text-xs text-gray-400 font-mono">{row.original.slug}</p>
          </div>
        ),
      },
      {
        header: 'Tags',
        accessorKey: 'tags',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.slice(0, 3).map(t => (
              <span key={t} className="px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs">{t}</span>
            ))}
          </div>
        ),
      },
      {
        header: 'Statut',
        accessorKey: 'published',
        cell: ({ row }) => (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${row.original.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
            {row.original.published ? 'Publié' : 'Brouillon'}
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
            {row.original.published && (
              <Link href={`/blog/${row.original.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-blue-500 transition-colors" aria-label="Voir l'article" title="Voir l'article">
                <Eye size={15} />
              </Link>
            )}
            <button type="button" onClick={() => { setEditPost(row.original); setShowModal(true) }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-primary-500 transition-colors" aria-label="Modifier l'article" title="Modifier l'article">
              <Pencil size={15} />
            </button>
            <button type="button" onClick={() => handleDelete(row.original.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors" aria-label="Supprimer l'article" title="Supprimer l'article">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.total ?? 0} articles</p>
        </div>
        <button type="button" onClick={() => { setEditPost(undefined); setShowModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nouvel article
        </button>
      </div>
      <div className="card p-6">
        <div className="relative mb-5 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>
        <DataTable data={posts} columns={columns} isLoading={isLoading} pageSize={10} globalFilter={search} onGlobalFilterChange={setSearch} />
      </div>
      {showModal && <BlogFormModal post={editPost} onClose={() => { setShowModal(false); setEditPost(undefined) }} />}
    </div>
  )
}
