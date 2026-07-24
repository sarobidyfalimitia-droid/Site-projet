import type { Metadata } from 'next'
import ServicesSection from '@/components/public/ServicesSection'
import CtaSection from '@/components/public/CtaSection'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Découvrez nos services : développement web, mobile, UI/UX design, maintenance et hébergement.',
}

export default function ServicesPage() {
  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="section-title mb-4">Nos Services</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Des solutions digitales complètes pour accompagner la croissance de votre entreprise.
          </p>
        </div>
      </div>
      <ServicesSection />
      <CtaSection />
    </>
  )
}
