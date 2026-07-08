import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { invoiceSchema } from '../validators/invoice.validator'

export const getInvoices = async (_req: Request, res: Response) => {
    const invoices = await prisma.invoice.findMany({ orderBy: { dueDate: 'desc' }, include: { client: true, quote: true } })
    res.json(invoices)
}

export const getInvoice = async (req: Request, res: Response) => {
    const invoice = await prisma.invoice.findUnique({ where: { id: Number(req.params.id) }, include: { client: true, quote: true } })
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable' })
    res.json(invoice)
}

export const createInvoice = async (req: Request, res: Response) => {
    const result = invoiceSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const invoice = await prisma.invoice.create({ data: { ...result.data, dueDate: new Date(result.data.dueDate), status: result.data.status ?? 'PENDING' }, include: { client: true, quote: true } })
    res.status(201).json(invoice)
}

export const updateInvoice = async (req: Request, res: Response) => {
    const result = invoiceSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = { ...result.data, dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined }
    const invoice = await prisma.invoice.update({ where: { id: Number(req.params.id) }, data, include: { client: true, quote: true } })
    res.json(invoice)
}

export const deleteInvoice = async (req: Request, res: Response) => {
    await prisma.invoice.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Facture supprimée' })
}
