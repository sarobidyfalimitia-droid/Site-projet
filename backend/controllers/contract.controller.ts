import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { contractSchema } from '../validators/contract.validator'
import { getPaginationParams, paginatedResponse } from '../src/utils/pagination'

export const getContracts = async (req: Request, res: Response) => {
    const pagination = getPaginationParams(req)
    const where = pagination.search
        ? { OR: [{ title: { contains: pagination.search, mode: 'insensitive' as const } }, { client: { name: { contains: pagination.search, mode: 'insensitive' as const } } }] }
        : {}

    const [contracts, total] = await Promise.all([
        prisma.contract.findMany({ where, orderBy: { updatedAt: 'desc' }, include: { client: true, quote: true }, skip: pagination.skip, take: pagination.limit }),
        prisma.contract.count({ where }),
    ])
    res.json(paginatedResponse(contracts, total, pagination))
}

export const getContract = async (req: Request, res: Response) => {
    const contract = await prisma.contract.findUnique({ where: { id: Number(req.params.id) }, include: { client: true, quote: true } })
    if (!contract) return res.status(404).json({ error: 'Contrat introuvable' })
    res.json(contract)
}

export const createContract = async (req: Request, res: Response) => {
    const result = contractSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = {
        ...result.data,
        startDate: result.data.startDate ? new Date(result.data.startDate) : undefined,
        endDate: result.data.endDate ? new Date(result.data.endDate) : undefined,
        status: result.data.status ?? 'DRAFT',
    }
    const contract = await prisma.contract.create({ data, include: { client: true, quote: true } })
    res.status(201).json(contract)
}

export const updateContract = async (req: Request, res: Response) => {
    const result = contractSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = {
        ...result.data,
        startDate: result.data.startDate ? new Date(result.data.startDate) : undefined,
        endDate: result.data.endDate ? new Date(result.data.endDate) : undefined,
    }
    const contract = await prisma.contract.update({ where: { id: Number(req.params.id) }, data, include: { client: true, quote: true } })
    res.json(contract)
}

export const deleteContract = async (req: Request, res: Response) => {
    await prisma.contract.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Contrat supprimé' })
}
