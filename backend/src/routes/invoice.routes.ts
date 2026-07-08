import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()
const include = { client: { select: { id: true, name: true, email: true } }, quote: { select: { id: true, title: true } } }

router.get('/', authenticate, async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const skip = (Number(page) - 1) * Number(limit)
  const [data, total] = await Promise.all([
    prisma.invoice.findMany({ include, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
    prisma.invoice.count(),
  ])
  res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
})

router.get('/:id', authenticate, async (req, res) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: Number(req.params.id) }, include })
  if (!invoice) return res.status(404).json({ error: 'Facture introuvable' })
  res.json(invoice)
})

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const number = `F-${new Date().getFullYear()}-${uuidv4().slice(0, 6).toUpperCase()}`
    const invoice = await prisma.invoice.create({
      data: { ...req.body, number, dueDate: new Date(req.body.dueDate), clientId: req.body.clientId ? Number(req.body.clientId) : null },
      include,
    })
    res.status(201).json(invoice)
  } catch (err) { console.error(err); res.status(400).json({ error: 'Données invalides' }) }
})

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const invoice = await prisma.invoice.update({ where: { id: Number(req.params.id) }, data: req.body, include })
    res.json(invoice)
  } catch { res.status(400).json({ error: 'Mise à jour impossible' }) }
})

router.post('/:id/pdf', authenticate, requireAdmin, async (req, res) => {
  // PDF generation placeholder - returns mock URL
  try {
    const invoice = await prisma.invoice.update({
      where: { id: Number(req.params.id) },
      data: { pdfUrl: `/uploads/invoices/invoice-${req.params.id}.pdf` },
      include,
    })
    res.json({ pdfUrl: invoice.pdfUrl })
  } catch { res.status(400).json({ error: 'Génération PDF impossible' }) }
})

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.invoice.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch { res.status(400).json({ error: 'Suppression impossible' }) }
})
export default router
