import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
const router = Router()
router.get('/', authenticate as any, requireAdmin as any, async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query
  const skip = (Number(page) - 1) * Number(limit)
  const [data, total] = await Promise.all([
    prisma.message.findMany({ skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.message.count(),
  ])
  res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
})
router.post('/public', async (req: Request, res: Response) => {
  try {
    await prisma.message.create({ data: req.body })
    res.status(201).send()
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Données invalides' })
  }
})
router.patch('/:id/read', authenticate as any, requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const m = await prisma.message.update({ where: { id: Number(req.params.id) }, data: { read: true } })
    res.json(m)
  } catch {
    res.status(400).json({ error: 'Mise à jour impossible' })
  }
})
router.delete('/:id', authenticate as any, requireAdmin as any, async (req: Request, res: Response) => {
  try {
    await prisma.message.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch {
    res.status(400).json({ error: 'Suppression impossible' })
  }
})
export default router
