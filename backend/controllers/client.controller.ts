import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { clientSchema } from '../validators/client.validator'
import { getPaginationParams, paginatedResponse } from '../src/utils/pagination'

export const getClients = async (req: Request, res: Response) => {
    const pagination = getPaginationParams(req)
    const where = pagination.search
        ? { OR: [{ name: { contains: pagination.search, mode: 'insensitive' as const } }, { email: { contains: pagination.search, mode: 'insensitive' as const } }] }
        : {}

    const [clients, total] = await Promise.all([
        prisma.client.findMany({ where, orderBy: { name: 'asc' }, skip: pagination.skip, take: pagination.limit, include: { _count: { select: { projects: true, quotes: true, invoices: true } } } }),
        prisma.client.count({ where }),
    ])
    res.json(paginatedResponse(clients, total, pagination))
}

export const getClient = async (req: Request, res: Response) => {
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) } })
    if (!client) return res.status(404).json({ error: 'Client introuvable' })
    res.json(client)
}

export const createClient = async (req: Request, res: Response) => {
    const result = clientSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const client = await prisma.client.create({ data: result.data })
    res.status(201).json(client)
}

export const updateClient = async (req: Request, res: Response) => {
    const result = clientSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const client = await prisma.client.update({ where: { id: Number(req.params.id) }, data: result.data })
    res.json(client)
}

export const deleteClient = async (req: Request, res: Response) => {
    await prisma.client.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Client supprimé' })
}
