'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { useBlogPost } from '@/hooks'
import { buildImageUrl, formatDate } from '@/lib/utils'

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { isAuthenticated } = useAuthStore()
  const { data: post, isLoading, isError } = useBlogPost(slug)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-6" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />)}
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article introuvable</h1>
        <Link href="/blog" className="text-primary-500 hover:underline">← Retour au blog</Link>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Cover */}
      {post.coverImage && (
        <div className="relative h-72 md:h-96 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Image src={buildImageUrl(post.coverImage)} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors mb-8">
          <ArrowLeft size={15} /> Retour au blog
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-medium">
                  <Tag size={11} /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.publishedAt ?? post.createdAt)}
            </span>
          </div>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-medium">
            {post.excerpt}
          </p>

          {/* Content */}
          <div
            className="prose dark:prose-invert prose-sm md:prose-base max-w-none text-gray-700 dark:text-gray-300
              prose-headings:font-display prose-headings:font-bold
              prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
              prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Vous avez un projet en tête ?</p>
                <p className="font-semibold text-gray-900 dark:text-white">Discutons-en ensemble.</p>
              </div>
              <Link href={isAuthenticated ? '/demande-devis' : `/auth/login?redirect=${encodeURIComponent('/demande-devis')}`} className="btn-primary shrink-0">Demander un devis</Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  )
}
