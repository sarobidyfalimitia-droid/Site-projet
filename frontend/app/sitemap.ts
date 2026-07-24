import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techno-logia.fr'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/projets`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${siteUrl}/equipe`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.6 },
    { url: `${siteUrl}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${siteUrl}/demande-devis`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
  ]

  return staticPages
}
