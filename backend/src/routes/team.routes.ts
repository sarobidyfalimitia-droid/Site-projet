import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
const router = Router()
router.get('/', async (req, res) => {
  const where: Record<string, unknown> = {}
  if (req.query.published !== undefined) where.published = req.query.published === 'true'
  const members = await prisma.teamMember.findMany({ where, orderBy: { createdAt: 'asc' } })
  res.json(members)
})
router.get('/:id', async (req, res) => {
  const member = await prisma.teamMember.findUnique({ where: { id: Number(req.params.id) } })
  if (!member) return res.status(404).json({ error: 'Membre introuvable' })
  res.json(member)
})
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try { const m = await prisma.teamMember.create({ data: req.body }); res.status(201).json(m) }
  catch (err) { console.error(err); res.status(400).json({ error: 'Données invalides' }) }
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try { const m = await prisma.teamMember.update({ where: { id: Number(req.params.id) }, data: req.body }); res.json(m) }
  catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await prisma.teamMember.delete({ where: { id: Number(req.params.id) } }); res.status(204).send() }
  catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
