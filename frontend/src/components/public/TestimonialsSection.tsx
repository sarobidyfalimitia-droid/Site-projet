'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useTestimonials } from '@/hooks'
import { getInitials } from '@/lib/utils'

export default function TestimonialsSection() {
  const { data: testimonials } = useTestimonials({ published: true })

  const list = testimonials ?? []

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary-500 font-medium text-sm uppercase tracking-widest mb-3">Ce qu'ils disent</p>
          <h2 className="section-title mb-4">Avis de nos clients</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre meilleure récompense.
          </p>
        </motion.div>

        {list.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder testimonials */}
            {[
              { name: 'Marie Dupont', company: 'StartupX', role: 'CEO', quote: 'Une équipe exceptionnelle qui a su comprendre notre vision et la transformer en une solution numérique parfaite. Délais respectés, communication irréprochable.', rating: 5 },
              { name: 'Thomas Martin', company: 'AgriTech', role: 'CTO', quote: 'Techno-logia a développé notre plateforme en 3 mois seulement. La qualité du code et l\'architecture sont remarquables. Je recommande vivement.', rating: 5 },
              { name: 'Sophie Leclerc', company: 'FashionBrand', role: 'Directrice Marketing', quote: 'Notre site e-commerce a connu une hausse de 45% du taux de conversion après la refonte. Travail soigné et résultats au rendez-vous.', rating: 5 },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 relative"
              >
                <Quote size={32} className="text-primary-200 dark:text-primary-900/50 mb-4" />
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6"
              >
                <Quote size={32} className="text-primary-200 dark:text-primary-900/50 mb-4" />
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(t.clientName)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.clientName}</div>
                    <div className="text-xs text-gray-500">
                      {t.role}{t.company ? `, ${t.company}` : ''}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
