import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techno-logia.fr'

interface PageSEO {
  title: string
  description: string
  image?: string
  noIndex?: boolean
}

export function generateMetadata({ title, description, image, noIndex }: PageSEO): Metadata {
  const fullTitle = `${title} | Techno-logia`
  const ogImage = image || `${siteUrl}/og-default.jpg`

  return {
    title: fullTitle,
    description,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: siteUrl,
      siteName: 'Techno-logia',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: { canonical: siteUrl },
  }
}
