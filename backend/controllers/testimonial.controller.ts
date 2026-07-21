import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { testimonialSchema } from '../validators/testimonial.validator'
import { getPaginationParams, paginatedResponse } from '../src/utils/pagination'

export const getTestimonials = async (req: Request, res: Response) => {
    const pagination = getPaginationParams(req)
    const where = pagination.search
        ? { OR: [{ clientName: { contains: pagination.search, mode: 'insensitive' as const } }, { company: { contains: pagination.search, mode: 'insensitive' as const } }, { quote: { contains: pagination.search, mode: 'insensitive' as const } }] }
        : {}

    const [testimonials, total] = await Promise.all([
        prisma.testimonial.findMany({ where, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.limit }),
        prisma.testimonial.count({ where }),
    ])
    res.json(paginatedResponse(testimonials, total, pagination))
}

export const getTestimonial = async (req: Request, res: Response) => {
    const testimonial = await prisma.testimonial.findUnique({ where: { id: Number(req.params.id) } })
    if (!testimonial) return res.status(404).json({ error: 'Témoignage introuvable' })
    res.json(testimonial)
}

export const createTestimonial = async (req: Request, res: Response) => {
    const result = testimonialSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const testimonial = await prisma.testimonial.create({ data: { ...result.data, published: result.data.published ?? false } })
    res.status(201).json(testimonial)
}

export const updateTestimonial = async (req: Request, res: Response) => {
    const result = testimonialSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const testimonial = await prisma.testimonial.update({ where: { id: Number(req.params.id) }, data: result.data })
    res.json(testimonial)
}

export const deleteTestimonial = async (req: Request, res: Response) => {
    await prisma.testimonial.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Témoignage supprimé' })
}
