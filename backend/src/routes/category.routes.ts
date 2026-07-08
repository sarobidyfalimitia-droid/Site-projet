import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()
router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({ include: { _count: { select: { projects: true } } }, orderBy: { name: 'asc' } })
  res.json(categories)
})
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const cat = await prisma.category.create({ data: req.body })
    res.status(201).json(cat)
  } catch { res.status(400).json({ error: 'Données invalides' }) }
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const cat = await prisma.category.update({ where: { id: Number(req.params.id) }, data: req.body })
    res.json(cat)
  } catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
