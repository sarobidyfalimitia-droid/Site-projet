'use client'

import { motion } from 'framer-motion'
import { FolderKanban, ExternalLink, Github } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'
import { useProjects } from '@/hooks'

export default function ClientProjectsPage() {
  const { t } = useLocale()
  const { data: projectsData } = useProjects()
  const projects = projectsData?.data ?? []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t.myProjects}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t.allProjects}</p>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <FolderKanban size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t.noProjects}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${project.published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {project.published ? t.delivered : t.inProgress}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1">
                    <ExternalLink size={14} /> {t.liveDemo}
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <Github size={14} /> {t.viewCode}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}