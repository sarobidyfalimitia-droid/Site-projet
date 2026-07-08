import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

export async function getProjects(req: Request, res: Response) {
  try {
    const { search, categoryId, featured, published, page = 1, limit = 12, sort = 'desc' } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where: Record<string, unknown> = {}
    if (search) where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { excerpt: { contains: String(search), mode: 'insensitive' } },
    ]
    if (categoryId) where.categoryId = Number(categoryId)
    if (featured !== undefined) where.featured = featured === 'true'
    if (published !== undefined) where.published = published === 'true'

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: { category: true, client: { select: { id: true, name: true } } },
        orderBy: { realizedAt: sort === 'asc' ? 'asc' : 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.project.count({ where }),
    ])

    res.json({ data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function getProjectBySlug(req: Request, res: Response) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: { category: true, client: { select: { id: true, name: true } } },
    })
    if (!project) return res.status(404).json({ error: 'Projet introuvable' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const project = await prisma.project.create({
      data: {
        ...req.body,
        realizedAt: req.body.realizedAt ? new Date(req.body.realizedAt) : new Date(),
        categoryId: req.body.categoryId ? Number(req.body.categoryId) : null,
        clientId: req.body.clientId ? Number(req.body.clientId) : null,
      },
      include: { category: true },
    })
    res.status(201).json(project)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: 'Données invalides' })
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        realizedAt: req.body.realizedAt ? new Date(req.body.realizedAt) : undefined,
        categoryId: req.body.categoryId ? Number(req.body.categoryId) : null,
        clientId: req.body.clientId ? Number(req.body.clientId) : null,
      },
      include: { category: true },
    })
    res.json(project)
  } catch (err) {
    res.status(400).json({ error: 'Mise à jour impossible' })
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch {
    res.status(400).json({ error: 'Suppression impossible' })
  }
}
