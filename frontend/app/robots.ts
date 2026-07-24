import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techno-logia.fr'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/client/', '/api/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
