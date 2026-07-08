'use client'

import { use } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Github, ExternalLink, Calendar, ArrowLeft, Tag } from 'lucide-react'
import { useProject } from '@/hooks'
import { buildImageUrl, formatDate } from '@/lib/utils'

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { isAuthenticated } = useAuthStore()
  const { data: project, isLoading, isError } = useProject(slug)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-8" />
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-8" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />)}
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Projet introuvable</h1>
        <Link href="/projets" className="text-primary-500 hover:underline">← Retour aux projets</Link>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <div className="relative h-80 md:h-[420px] bg-gradient-to-br from-primary-900 to-purple-900 overflow-hidden">
        {project.coverImage && (
          <Image src={buildImageUrl(project.coverImage)} alt={project.title} fill className="object-cover opacity-50" />
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 w-full">
            {project.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3">
                <Tag size={12} /> {project.category.name}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{project.title}</h1>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span className="flex items-center gap-1.5"><Calendar size={14} />{formatDate(project.realizedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back */}
        <Link href="/projets" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors mb-10">
          <ArrowLeft size={15} /> Retour aux projets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">À propos du projet</h2>
            <div
              className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />

            {/* Image gallery */}
            {project.images && project.images.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">Galerie</h3>
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((img, i) => (
                    <div key={i} className="relative h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image src={buildImageUrl(img)} alt={`${project.title} - ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Links */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Liens du projet</h3>
              <div className="flex flex-col gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    <ExternalLink size={15} /> Voir la démo live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Github size={15} /> Voir le code
                  </a>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Technologies utilisées</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="card p-5 bg-gradient-to-br from-primary-500 to-purple-600 border-0">
              <h3 className="font-semibold text-white mb-2 text-sm">Un projet similaire ?</h3>
              <p className="text-white/80 text-xs mb-4">Discutons de votre projet et voyons comment nous pouvons vous aider.</p>
              <Link href={isAuthenticated ? '/demande-devis' : `/auth/login?redirect=${encodeURIComponent('/demande-devis')}`} className="block text-center px-4 py-2.5 rounded-xl bg-white text-primary-600 text-sm font-medium hover:bg-white/90 transition-colors">
                Demander un devis
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
