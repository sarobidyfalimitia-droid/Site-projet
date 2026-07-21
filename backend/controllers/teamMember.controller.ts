import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { teamMemberSchema } from '../validators/teamMember.validator'
import { getPaginationParams, paginatedResponse } from '../src/utils/pagination'

export const getTeamMembers = async (req: Request, res: Response) => {
    const { published } = req.query
    const pagination = getPaginationParams(req)

    const where = {
        ...(published !== undefined ? { published: published === 'true' } : {}),
        ...(pagination.search
            ? { OR: [{ name: { contains: pagination.search, mode: 'insensitive' as const } }, { role: { contains: pagination.search, mode: 'insensitive' as const } }] }
            : {}),
    }

    const [members, total] = await Promise.all([
        prisma.teamMember.findMany({ where, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.limit }),
        prisma.teamMember.count({ where }),
    ])
    res.json(paginatedResponse(members, total, pagination))
}

export const getTeamMember = async (req: Request, res: Response) => {
    const member = await prisma.teamMember.findUnique({ where: { id: Number(req.params.id) } })
    if (!member) return res.status(404).json({ error: 'Membre introuvable' })
    res.json(member)
}

export const createTeamMember = async (req: Request, res: Response) => {
    const result = teamMemberSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const member = await prisma.teamMember.create({ data: result.data })
    res.status(201).json(member)
}

export const updateTeamMember = async (req: Request, res: Response) => {
    const result = teamMemberSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const member = await prisma.teamMember.update({ where: { id: Number(req.params.id) }, data: result.data })
    res.json(member)
}

export const deleteTeamMember = async (req: Request, res: Response) => {
    await prisma.teamMember.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Membre supprimé' })
}
