import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { appointmentSchema } from '../validators/appointment.validator'

export const getAppointments = async (_req: Request, res: Response) => {
    const appointments = await prisma.appointment.findMany({ orderBy: { scheduledAt: 'desc' }, include: { client: true } })
    res.json(appointments)
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
