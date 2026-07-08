'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { useFeaturedProjects } from '@/hooks'
import { buildImageUrl, truncate } from '@/lib/utils'

export default function FeaturedProjects() {
  const { data: projects, isLoading } = useFeaturedProjects()

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50" id="projets">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
        >
          <div>
            <p className="text-primary-500 font-medium text-sm uppercase tracking-widest mb-3">Notre portfolio</p>
            <h2 className="section-title">Projets vedettes</h2>
          </div>
          <Link href="/projets" className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors shrink-0">
            Tous les projets <ArrowRight size={16} />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(projects ?? []).slice(0, 6).map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group card overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Cover */}
                <div className="relative h-52 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 overflow-hidden">
                  {project.coverImage && (
                    <Image
                      src={buildImageUrl(project.coverImage)}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {project.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 dark:bg-gray-900/90 text-xs font-medium text-primary-600 dark:text-primary-400">
                      {project.category.name}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                    <Link href={`/projets/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {truncate(project.excerpt, 110)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
