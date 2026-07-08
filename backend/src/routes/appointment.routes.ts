import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware'
const router = Router()
const include = { client: { select: { id: true, name: true, email: true } } }
router.get('/', authenticate, async (req: AuthRequest, res) => {
  const { page = 1, limit = 20 } = req.query; const skip = (Number(page) - 1) * Number(limit)
  const where = req.user!.role === 'client' ? { clientId: req.user!.id } : {}
  const [data, total] = await Promise.all([prisma.appointment.findMany({ where, include, skip, take: Number(limit), orderBy: { scheduledAt: 'asc' } }), prisma.appointment.count({ where })])
  res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
})
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const apt = await prisma.appointment.create({ data: { ...req.body, scheduledAt: new Date(req.body.scheduledAt), clientId: req.user!.role === 'client' ? req.user!.id : (req.body.clientId ? Number(req.body.clientId) : null) }, include })
    res.status(201).json(apt)
  } catch (err) { console.error(err); res.status(400).json({ error: 'Données invalides' }) }
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try { const apt = await prisma.appointment.update({ where: { id: Number(req.params.id) }, data: { ...req.body, scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined }, include }); res.json(apt) }
  catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await prisma.appointment.delete({ where: { id: Number(req.params.id) } }); res.status(204).send() }
  catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
