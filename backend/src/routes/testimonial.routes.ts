import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
const router = Router()
router.get('/', async (req, res) => {
  const where: Record<string, unknown> = {}
  if (req.query.published !== undefined) where.published = req.query.published === 'true'
  const list = await prisma.testimonial.findMany({ where, orderBy: { createdAt: 'desc' } })
  res.json(list)
})
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try { const t = await prisma.testimonial.create({ data: req.body }); res.status(201).json(t) }
  catch { res.status(400).json({ error: 'Données invalides' }) }
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try { const t = await prisma.testimonial.update({ where: { id: Number(req.params.id) }, data: req.body }); res.json(t) }
  catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await prisma.testimonial.delete({ where: { id: Number(req.params.id) } }); res.status(204).send() }
  catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
