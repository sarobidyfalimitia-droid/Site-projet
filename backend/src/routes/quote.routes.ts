import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()
const include = { client: { select: { id: true, name: true, email: true } } }

router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query
  const skip = (Number(page) - 1) * Number(limit)
  const where: Record<string, unknown> = {}
  if (search) where.OR = [{ title: { contains: String(search), mode: 'insensitive' } }, { contactEmail: { contains: String(search), mode: 'insensitive' } }]
  if (status) where.status = status
  const [data, total] = await Promise.all([
    prisma.quote.findMany({ where, include, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.quote.count({ where }),
  ])
  res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
})

router.get('/:id', authenticate, async (req, res) => {
  const quote = await prisma.quote.findUnique({ where: { id: Number(req.params.id) }, include })
  if (!quote) return res.status(404).json({ error: 'Devis introuvable' })
  res.json(quote)
})

router.post('/public', async (req, res) => {
  try {
    const quote = await prisma.quote.create({ data: { ...req.body, status: 'PENDING' } })
    res.status(201).json(quote)
  } catch (err) { console.error(err); res.status(400).json({ error: 'Données invalides' }) }
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const quote = await prisma.quote.create({ data: req.body, include })
    res.status(201).json(quote)
  } catch { res.status(400).json({ error: 'Données invalides' }) }
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const quote = await prisma.quote.update({ where: { id: Number(req.params.id) }, data: req.body, include })
    res.json(quote)
  } catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})

router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const quote = await prisma.quote.update({ where: { id: Number(req.params.id) }, data: { status: req.body.status }, include })
    res.json(quote)
  } catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.quote.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
