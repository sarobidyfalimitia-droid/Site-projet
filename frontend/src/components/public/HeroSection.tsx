'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'

const techStack = ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind']

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore()
  const quoteHref = isAuthenticated ? '/demande-devis' : `/auth/login?redirect=${encodeURIComponent('/demande-devis')}`
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-100 dark:bg-purple-900/20 blur-3xl opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary-300/30 dark:via-primary-600/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 text-sm font-medium mb-8"
          >
            <Sparkles size={14} />
            Agence Digitale Premium
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] mb-6"
          >
            Nous donnons vie
            <br />
            à vos{' '}
            <span className="gradient-text">idées digitales</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed"
          >
            Nous créons des expériences numériques exceptionnelles — du développement web au design UI/UX, en passant par les applications mobiles et métier.
          </motion.p>

          {/* CTAs */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.35 }}
             className="flex flex-wrap gap-4 mb-16"
           >
             <Link href={quoteHref} className="btn-primary flex items-center gap-2 text-base px-6 py-3">
               Démarrer un projet
               <ArrowRight size={18} />
             </Link>
             <Link
               href="/projets"
               className="flex items-center gap-2 px-6 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
             >
               <Play size={16} />
               Voir nos réalisations
             </Link>
           </motion.div>

          {/* Tech stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">Technologies maîtrisées</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono font-medium"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating card decoration */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 w-80"
        >
          <div className="glass rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-400 font-mono">project.tsx</span>
            </div>
            <div className="font-mono text-xs space-y-1.5 text-gray-600 dark:text-gray-400">
              <p><span className="text-primary-500">const</span> <span className="text-green-500">project</span> = {'{'}</p>
              <p className="pl-4"><span className="text-yellow-500">name</span>: <span className="text-orange-400">&quot;Votre App&quot;</span>,</p>
              <p className="pl-4"><span className="text-yellow-500">tech</span>: <span className="text-orange-400">&quot;Next.js&quot;</span>,</p>
              <p className="pl-4"><span className="text-yellow-500">status</span>: <span className="text-green-400">✓ deployed</span>,</p>
              <p>{'}'}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-500">Livré avec succès</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
