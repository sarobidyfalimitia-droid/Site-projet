import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
const router = Router()

router.get('/', authenticate as any, async (req: Request, res: Response) => {
  const { status, clientId } = req.query
  const where: any = {}
  if (status) where.status = status
  if (clientId) where.clientId = Number(clientId)
  const invoices = await prisma.invoice.findMany({ where, include: { client: { select: { name: true } } }, orderBy: { createdAt: 'desc' } })
  res.json(invoices)
})

router.get('/:id', authenticate as any, async (req: Request, res: Response) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: Number(req.params.id) }, include: { client: true, quote: true } })
  if (!invoice) return res.status(404).json({ error: 'Facture introuvable' })
  res.json(invoice)
})

router.post('/', authenticate as any, requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const { quoteId, clientId, amount, dueDate } = req.body
    const invoice = await prisma.invoice.create({
      data: {
        number: `INV-${uuidv4().slice(0, 8).toUpperCase()}`,
        quoteId: quoteId ? Number(quoteId) : null,
        clientId: clientId ? Number(clientId) : null,
        amount: Number(amount),
        dueDate: new Date(dueDate),
        status: 'DRAFT',
      },
    })
    res.status(201).json(invoice)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Données invalides' })
  }
})

router.put('/:id', authenticate as any, requireAdmin as any, async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice.update({ where: { id: Number(req.params.id) }, data: req.body })
    res.json(invoice)
  } catch (err) {
    res.status(400).json({ error: 'Mise à jour impossible' })
  }
})

router.delete('/:id', authenticate as any, requireAdmin as any, async (req: Request, res: Response) => {
  try {
    await prisma.invoice.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: 'Suppression impossible' })
  }
})

export default router