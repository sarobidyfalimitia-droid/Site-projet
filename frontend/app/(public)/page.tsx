import type { Metadata } from 'next'
import HeroSection from '@/components/public/HeroSection'
import StatsSection from '@/components/public/StatsSection'
import ServicesSection from '@/components/public/ServicesSection'
import FeaturedProjects from '@/components/public/FeaturedProjects'
import TestimonialsSection from '@/components/public/TestimonialsSection'
import CtaSection from '@/components/public/CtaSection'

export const metadata: Metadata = {
  title: 'Accueil | Agence Digitale Premium',
  description: 'Techno-logia - Agence digitale spécialisée en développement web, mobile et design UI/UX.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturedProjects />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
