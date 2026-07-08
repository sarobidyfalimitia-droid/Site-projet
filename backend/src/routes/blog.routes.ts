import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
import { blogPostSchema } from '../validators/blogPost.validator'
const router = Router()
router.get('/', async (req, res) => {
  const { search, page = 1, limit = 12 } = req.query; const skip = (Number(page) - 1) * Number(limit)
  const where: Record<string, unknown> = {}
  if (search) where.OR = [{ title: { contains: String(search), mode: 'insensitive' } }, { excerpt: { contains: String(search), mode: 'insensitive' } }]
  if (!req.query.all) where.published = true
  const [data, total] = await Promise.all([prisma.blogPost.findMany({ where, skip, take: Number(limit), orderBy: { publishedAt: 'desc' } }), prisma.blogPost.count({ where })])
  res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
})
router.get('/:slug', async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } })
  if (!post) return res.status(404).json({ error: 'Article introuvable' })
  res.json(post)
})
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const parsed = blogPostSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides' })
    const data = { ...parsed.data, publishedAt: parsed.data.published ? new Date() : null }
    const p = await prisma.blogPost.create({ data })
    res.status(201).json(p)
  } catch (err) { console.error(err); res.status(400).json({ error: 'Données invalides' }) }
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const parsed = blogPostSchema.partial().safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides' })
    const data = { ...parsed.data }
    if (parsed.data.published !== undefined) {
      data.publishedAt = parsed.data.published ? (req.body.publishedAt ? new Date(req.body.publishedAt) : new Date()) : null as any
    }
    const p = await prisma.blogPost.update({ where: { id: Number(req.params.id) }, data })
    res.json(p)
  } catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await prisma.blogPost.delete({ where: { id: Number(req.params.id) } }); res.status(204).send() }
  catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
