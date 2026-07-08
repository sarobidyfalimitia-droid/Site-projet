import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { projectSchema } from '../validators/project.validator'

export const getPublicProjects = async (req: Request, res: Response) => {
  const { category, featured } = req.query
  const projects = await prisma.project.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category as string } } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    include: { category: true },
    orderBy: { realizedAt: 'desc' },
  })
  res.json(projects)
}

export const getPublicProjectBySlug = async (req: Request, res: Response) => {
  const project = await prisma.project.findFirst({
    where: { slug: req.params.slug, published: true },
    include: { category: true },
  })
  if (!project) return res.status(404).json({ error: 'Projet introuvable' })
  res.json(project)
}

export const getAllProjectsAdmin = async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json(projects)
}

export const createProject = async (req: Request, res: Response) => {
  const result = projectSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })
  const project = await prisma.project.create({ data: result.data, include: { category: true } })
  res.status(201).json(project)
}

export const updateProject = async (req: Request, res: Response) => {
  const result = projectSchema.partial().safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })
  const project = await prisma.project.update({
    where: { id: Number(req.params.id) },
    data: result.data,
    include: { category: true },
  })
  res.json(project)
}

export const deleteProject = async (req: Request, res: Response) => {
  await prisma.project.delete({ where: { id: Number(req.params.id) } })
  res.json({ message: 'Projet supprimé' })
}
