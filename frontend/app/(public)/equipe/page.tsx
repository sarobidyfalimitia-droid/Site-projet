'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Github, Linkedin, Twitter, Globe } from 'lucide-react'
import { useTeam } from '@/hooks'
import { buildImageUrl, getInitials } from '@/lib/utils'

const socialIcons: Record<string, React.ElementType> = {
  github: Github, linkedin: Linkedin, twitter: Twitter, portfolio: Globe,
}

export default function EquipePage() {
  const { data: members, isLoading } = useTeam({ published: true })

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary-500 font-medium text-sm uppercase tracking-widest mb-3">Les experts derrière vos projets</p>
            <h1 className="section-title mb-4">Notre équipe</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Une équipe passionnée de développeurs, designers et experts en stratégie digitale à votre service.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Team grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-gray-800" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (members ?? []).length === 0 ? (
          <div className="text-center py-16 text-gray-400">Aucun membre disponible pour le moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(members ?? []).map((member, i) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group card overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-64 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 overflow-hidden">
                  {member.photo ? (
                    <Image
                      src={buildImageUrl(member.photo)}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl font-display font-bold text-primary-300 dark:text-primary-700">
                        {getInitials(member.name)}
                      </span>
                    </div>
                  )}
                  {/* Social overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                      {member.socials?.map((url) => {
                        const platform = Object.keys(socialIcons).find((k) => url.includes(k)) ?? 'portfolio'
                        const Icon = socialIcons[platform] ?? Globe
                        return (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
                          >
                            <Icon size={16} />
                          </a>
                        )
                      })}
                      {member.portfolioUrl && (
                        <a href={member.portfolioUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all">
                          <Globe size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-primary-500 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{member.bio}</p>
                  {member.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {member.skills.slice(0, 5).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
