import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { appointmentSchema } from '../validators/appointment.validator'
import { getPaginationParams, paginatedResponse } from '../src/utils/pagination'

export const getAppointments = async (req: Request, res: Response) => {
    const pagination = getPaginationParams(req)
    const where = pagination.search
        ? { OR: [{ subject: { contains: pagination.search, mode: 'insensitive' as const } }, { client: { name: { contains: pagination.search, mode: 'insensitive' as const } } }] }
        : {}

    const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({ where, orderBy: { scheduledAt: 'desc' }, include: { client: true }, skip: pagination.skip, take: pagination.limit }),
        prisma.appointment.count({ where }),
    ])
    res.json(paginatedResponse(appointments, total, pagination))
}

export const getAppointment = async (req: Request, res: Response) => {
    const appointment = await prisma.appointment.findUnique({ where: { id: Number(req.params.id) }, include: { client: true } })
    if (!appointment) return res.status(404).json({ error: 'Rendez-vous introuvable' })
    res.json(appointment)
}

export const createAppointment = async (req: Request, res: Response) => {
    const result = appointmentSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const appointment = await prisma.appointment.create({ data: { ...result.data, scheduledAt: new Date(result.data.scheduledAt), status: result.data.status ?? 'PENDING' }, include: { client: true } })
    res.status(201).json(appointment)
}

export const updateAppointment = async (req: Request, res: Response) => {
    const result = appointmentSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = { ...result.data, scheduledAt: result.data.scheduledAt ? new Date(result.data.scheduledAt) : undefined }
    const appointment = await prisma.appointment.update({ where: { id: Number(req.params.id) }, data, include: { client: true } })
    res.json(appointment)
}

export const deleteAppointment = async (req: Request, res: Response) => {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Rendez-vous supprimé' })
}
