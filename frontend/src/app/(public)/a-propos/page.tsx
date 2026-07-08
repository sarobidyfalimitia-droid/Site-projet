import type { Metadata } from 'next'
import StatsSection from '@/components/public/StatsSection'
import CtaSection from '@/components/public/CtaSection'

export const metadata: Metadata = {
  title: 'À propos',
  description: "Découvrez l'histoire et les valeurs de Techno-logia, agence digitale.",
}

const values = [
  { emoji: '🎯', title: 'Excellence', description: 'Nous visons l\'excellence dans chaque ligne de code, chaque design, chaque interaction.' },
  { emoji: '🤝', title: 'Partenariat', description: 'Nous nous considérons comme des partenaires de votre succès, pas de simples prestataires.' },
  { emoji: '🚀', title: 'Innovation', description: 'Veille technologique constante pour vous proposer les meilleures solutions du marché.' },
  { emoji: '🔒', title: 'Fiabilité', description: 'Code robuste, tests rigoureux et maintenance proactive pour des applications sans failles.' },
]

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Nous construisons le <span className="gradient-text">futur digital</span> de nos clients
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Fondée en 2016, Techno-logia est une agence digitale spécialisée en développement web, mobile et design UI/UX.
          </p>
        </div>
      </div>

      <StatsSection />

      {/* Story */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-primary-500 font-medium text-sm uppercase tracking-widest mb-3">Notre histoire</p>
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">De la startup à l&apos;agence de référence</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Techno-logia a été fondée par une équipe de développeurs passionnés avec une ambition claire : créer des expériences digitales qui font vraiment la différence.</p>
              <p>Au fil des années, nous avons accompagné plus de 150 projets — des startups ambitieuses aux entreprises établies.</p>
              <p>Aujourd&apos;hui, notre équipe de 15 experts couvre toute la chaîne de valeur digitale.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { year: '2016', label: 'Fondation', desc: "Naissance de l'agence" },
              { year: '2018', label: 'Croissance', desc: 'Équipe de 8 experts' },
              { year: '2021', label: 'Expansion', desc: '100+ projets livrés' },
              { year: '2024', label: "Aujourd'hui", desc: '150+ clients' },
            ].map(({ year, label, desc }) => (
              <div key={year} className="card p-5">
                <div className="text-2xl font-display font-bold gradient-text mb-1">{year}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ emoji, title, description }) => (
              <div key={title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  )
}
