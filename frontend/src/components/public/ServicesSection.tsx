'use client'

import { motion } from 'framer-motion'
import { Globe, Smartphone, Palette, Settings, Server, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    id: 'web',
    icon: Globe,
    title: 'Développement Web',
    description: 'Applications web modernes avec Next.js, React et TypeScript. Performance, SEO et accessibilité au cœur de chaque projet.',
    color: 'from-blue-500 to-cyan-500',
    href: '/services#web',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Développement Mobile',
    description: 'Applications iOS et Android natives et cross-platform avec React Native. UX soignée et performances optimales.',
    color: 'from-violet-500 to-purple-500',
    href: '/services#mobile',
  },
  {
    id: 'design',
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Design d\'interfaces modernes et intuitives. Prototypage, design system et expérience utilisateur premium.',
    color: 'from-pink-500 to-rose-500',
    href: '/services#design',
  },
  {
    id: 'metier',
    icon: Settings,
    title: 'Applications Métier',
    description: 'Solutions sur mesure adaptées à vos processus métier. ERP, CRM, plateformes SaaS et outils internes.',
    color: 'from-orange-500 to-amber-500',
    href: '/services#metier',
  },
  {
    id: 'maintenance',
    icon: Server,
    title: 'Maintenance & Support',
    description: 'Maintenance proactive, mises à jour de sécurité et support technique. Votre tranquillité d\'esprit est notre priorité.',
    color: 'from-green-500 to-emerald-500',
    href: '/services#maintenance',
  },
  {
    id: 'hosting',
    icon: BarChart3,
    title: 'Hébergement & DevOps',
    description: 'Déploiement cloud, CI/CD, monitoring et optimisation des performances. Infrastructure robuste et scalable.',
    color: 'from-teal-500 to-cyan-500',
    href: '/services#hosting',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary-500 font-medium text-sm uppercase tracking-widest mb-3">Ce que nous faisons</p>
          <h2 className="section-title mb-4">Nos services</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            De la conception à la mise en production, nous vous accompagnons à chaque étape de votre transformation numérique.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={service.href}
                id={service.id}
                className="group block card p-6 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 h-full"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${service.color} mb-5 shadow-sm`}>
                  <service.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn-primary inline-flex items-center gap-2">
            Voir tous les services
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
