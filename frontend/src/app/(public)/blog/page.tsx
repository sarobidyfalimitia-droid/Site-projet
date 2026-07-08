'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Tag, ArrowRight } from 'lucide-react'
import { useBlogPosts } from '@/hooks'
import { buildImageUrl, formatDate, truncate } from '@/lib/utils'

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useBlogPosts({ search, limit: 12 })
  const posts = data?.data ?? []

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary-500 font-medium text-sm uppercase tracking-widest mb-3">Nos articles</p>
            <h1 className="section-title mb-4">Blog & Actualités</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">Tutoriels techniques, retours d&apos;expérience et tendances du développement web.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Search */}
        <div className="relative mb-10 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un article…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="card overflow-hidden animate-pulse"><div className="h-48 bg-gray-200 dark:bg-gray-800" /><div className="p-5 space-y-3"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" /><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded" /></div></div>)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">Aucun article trouvé.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="group card overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 overflow-hidden">
                  {post.coverImage && <Image src={buildImageUrl(post.coverImage)} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {post.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 dark:bg-gray-900/90 text-xs font-medium text-primary-600">
                          <Tag size={10} />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">{formatDate(post.publishedAt ?? post.createdAt)}</p>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{truncate(post.excerpt, 100)}</p>
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">
                    Lire la suite <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
