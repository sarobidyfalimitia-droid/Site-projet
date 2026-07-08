import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { quoteSchema } from '../validators/quote.validator'

export const getQuotes = async (_req: Request, res: Response) => {
    const quotes = await prisma.quote.findMany({ orderBy: { updatedAt: 'desc' }, include: { client: true } })
    res.json(quotes)
}

export const getQuote = async (req: Request, res: Response) => {
    const quote = await prisma.quote.findUnique({ where: { id: Number(req.params.id) }, include: { client: true } })
    if (!quote) return res.status(404).json({ error: 'Devis introuvable' })
    res.json(quote)
}

export const createQuote = async (req: Request, res: Response) => {
    const result = quoteSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = {
        ...result.data,
        deadline: result.data.deadline ? new Date(result.data.deadline) : undefined,
        status: result.data.status ?? 'PENDING',
    }
    const quote = await prisma.quote.create({ data, include: { client: true } })
    res.status(201).json(quote)
}

export const updateQuote = async (req: Request, res: Response) => {
    const result = quoteSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = {
        ...result.data,
        deadline: result.data.deadline ? new Date(result.data.deadline) : undefined,
    }
    const quote = await prisma.quote.update({ where: { id: Number(req.params.id) }, data, include: { client: true } })
    res.json(quote)
}

export const deleteQuote = async (req: Request, res: Response) => {
    await prisma.quote.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Devis supprimé' })
}
