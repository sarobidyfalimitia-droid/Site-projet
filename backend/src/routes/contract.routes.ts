import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
const router = Router()
const include = { client: { select: { id: true, name: true } }, quote: { select: { id: true, title: true } } }
router.get('/', authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query; const skip = (Number(page) - 1) * Number(limit)
  const [data, total] = await Promise.all([prisma.contract.findMany({ include, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }), prisma.contract.count()])
  res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
})
router.get('/:id', authenticate, async (req, res) => {
  const contract = await prisma.contract.findUnique({ where: { id: Number(req.params.id) }, include })
  if (!contract) return res.status(404).json({ error: 'Contrat introuvable' })
  res.json(contract)
})
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try { const c = await prisma.contract.create({ data: { ...req.body, clientId: req.body.clientId ? Number(req.body.clientId) : null }, include }); res.status(201).json(c) }
  catch (err) { console.error(err); res.status(400).json({ error: 'Données invalides' }) }
})
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try { const c = await prisma.contract.update({ where: { id: Number(req.params.id) }, data: req.body, include }); res.json(c) }
  catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})
router.post('/:id/pdf', authenticate, requireAdmin, async (req, res) => {
  try { const c = await prisma.contract.update({ where: { id: Number(req.params.id) }, data: { pdfUrl: `/uploads/contracts/contract-${req.params.id}.pdf` }, include }); res.json({ pdfUrl: c.pdfUrl }) }
  catch { res.status(400).json({ error: 'Génération PDF impossible' }) }
})
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try { await prisma.contract.delete({ where: { id: Number(req.params.id) } }); res.status(204).send() }
  catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
