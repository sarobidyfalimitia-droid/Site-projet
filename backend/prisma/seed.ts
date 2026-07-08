import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin - Use environment variable for password in production
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@techno-logia.fr' },
    update: {},
    create: { email: 'admin@techno-logia.fr', password: adminPassword, name: 'Super Admin' },
  })
  console.log('✅ Admin created:', admin.email)

  // Demo client
  const clientPassword = await bcrypt.hash(process.env.CLIENT_PASSWORD || 'client123', 12)
  const client = await prisma.client.upsert({
    where: { email: 'client@demo.fr' },
    update: {},
    create: { email: 'client@demo.fr', password: clientPassword, name: 'Jean Dupont', company: 'Demo Corp', phone: '+33 6 12 34 56 78' },
  })
  console.log('✅ Client created:', client.email)

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'web' }, update: {}, create: { name: 'Développement Web', slug: 'web' } }),
    prisma.category.upsert({ where: { slug: 'mobile' }, update: {}, create: { name: 'Application Mobile', slug: 'mobile' } }),
    prisma.category.upsert({ where: { slug: 'design' }, update: {}, create: { name: 'UI/UX Design', slug: 'design' } }),
    prisma.category.upsert({ where: { slug: 'ecommerce' }, update: {}, create: { name: 'E-commerce', slug: 'ecommerce' } }),
    prisma.category.upsert({ where: { slug: 'saas' }, update: {}, create: { name: 'SaaS', slug: 'saas' } }),
  ])
  console.log('✅ Categories created:', categories.length)

  // Sample projects
  const projects = [
    {
      title: 'Plateforme E-commerce Premium',
      slug: 'plateforme-ecommerce-premium',
      excerpt: 'Une boutique en ligne complète avec gestion des stocks, paiement sécurisé et tableau de bord avancé.',
      description: '<p>Développement complet d\'une plateforme e-commerce avec Next.js, intégration Stripe, gestion des stocks en temps réel et dashboard analytics.</p>',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      published: true, featured: true,
      categoryId: categories[3].id,
      realizedAt: new Date('2024-03-15'),
    },
    {
      title: 'Application Mobile Fitness',
      slug: 'application-mobile-fitness',
      excerpt: 'Application mobile cross-platform pour le suivi d\'entraînement et la nutrition.',
      description: '<p>Application React Native avec suivi GPS, plans d\'entraînement personnalisés et analyse des performances.</p>',
      technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Socket.io'],
      published: true, featured: true,
      categoryId: categories[1].id,
      realizedAt: new Date('2024-01-20'),
    },
    {
      title: 'Dashboard SaaS Analytics',
      slug: 'dashboard-saas-analytics',
      excerpt: 'Tableau de bord analytique temps réel pour startups B2B avec visualisations avancées.',
      description: '<p>SaaS analytics avec graphiques interactifs, rapports automatisés et intégration multi-sources de données.</p>',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'Redis'],
      published: true, featured: true,
      categoryId: categories[4].id,
      realizedAt: new Date('2024-02-10'),
    },
  ]

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }
  console.log('✅ Projects created:', projects.length)

  // Team members
  const teamMembers = [
    { name: 'Alexandre Martin', role: 'Lead Developer & Fondateur', bio: 'Full-stack developer avec 10 ans d\'expérience. Passionné par les architectures scalables et les nouvelles technologies.', skills: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript'], published: true, featured: true },
    { name: 'Sophie Laurent', role: 'UI/UX Designer Senior', bio: 'Designer créative spécialisée en design système et expérience utilisateur. Adepte du design minimaliste et fonctionnel.', skills: ['Figma', 'Framer', 'Tailwind', 'Motion Design', 'Design System'], published: true, featured: true },
    { name: 'Thomas Bernard', role: 'Backend Developer', bio: 'Expert en architecture backend, APIs RESTful et microservices. Spécialiste en optimisation de bases de données.', skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'GraphQL'], published: true, featured: false },
  ]

  for (const m of teamMembers) {
    await prisma.teamMember.create({ data: m }).catch(() => {})
  }
  console.log('✅ Team members created:', teamMembers.length)

  // Testimonials
  const testimonials = [
    { clientName: 'Marie Dupont', company: 'StartupX', role: 'CEO', quote: 'Équipe exceptionnelle qui a su comprendre notre vision. Délais respectés, qualité irréprochable.', rating: 5, published: true },
    { clientName: 'Thomas Martin', company: 'AgriTech Solutions', role: 'CTO', quote: 'Plateforme développée en 3 mois. Qualité du code et architecture remarquables. Je recommande vivement.', rating: 5, published: true },
    { clientName: 'Sophie Leclerc', company: 'FashionBrand', role: 'Directrice Marketing', quote: 'Hausse de 45% du taux de conversion après la refonte. Travail soigné et résultats au rendez-vous.', rating: 5, published: true },
  ]
  for (const t of testimonials) await prisma.testimonial.create({ data: t }).catch(() => {})
  console.log('✅ Testimonials created:', testimonials.length)

  console.log('\n🎉 Seed completed successfully!')
  console.log('Admin: admin@techno-logia.fr / admin123')
  console.log('Client: client@demo.fr / client123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
