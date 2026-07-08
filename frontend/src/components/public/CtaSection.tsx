'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'

export default function CtaSection() {
  const { isAuthenticated } = useAuthStore()
  const quoteHref = isAuthenticated ? '/demande-devis' : `/auth/login?redirect=${encodeURIComponent('/demande-devis')}`
  const appointmentHref = isAuthenticated ? '/client/appointments' : `/auth/login?redirect=${encodeURIComponent('/client/appointments')}`
  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Prêt à lancer votre
            <br />
            <span className="gradient-text">prochain projet ?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Discutons de votre projet et voyons comment nous pouvons vous aider à atteindre vos objectifs numériques.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={quoteHref}
              className="btn-primary flex items-center gap-2 text-base px-7 py-3.5"
            >
              Demander un devis gratuit
              <ArrowRight size={18} />
            </Link>
            <Link
              href={appointmentHref}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium text-white border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition-all"
            >
              <Calendar size={18} />
              Prendre rendez-vous
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
