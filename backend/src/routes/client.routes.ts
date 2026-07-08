import { Router } from 'express'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()
const select = { id: true, name: true, email: true, company: true, phone: true, status: true, createdAt: true, updatedAt: true, _count: { select: { projects: true, quotes: true, invoices: true } } }

router.get('/', authenticate, requireAdmin, async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query
  const skip = (Number(page) - 1) * Number(limit)
  const where: Record<string, unknown> = search ? { OR: [{ name: { contains: String(search), mode: 'insensitive' } }, { email: { contains: String(search), mode: 'insensitive' } }] } : {}
  const [data, total] = await Promise.all([
    prisma.client.findMany({ where, select, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.client.count({ where }),
  ])
  res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
})

router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select })
  if (!client) return res.status(404).json({ error: 'Client introuvable' })
  res.json(client)
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { password, ...rest } = req.body
    const hashed = await bcrypt.hash(password, 12)
    const client = await prisma.client.create({ data: { ...rest, password: hashed }, select })
    res.status(201).json(client)
  } catch { res.status(400).json({ error: 'Données invalides ou email déjà utilisé' }) }
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { password, ...rest } = req.body
    const data: Record<string, unknown> = { ...rest }
    if (password) data.password = await bcrypt.hash(password, 12)
    const client = await prisma.client.update({ where: { id: Number(req.params.id) }, data, select })
    res.json(client)
  } catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
