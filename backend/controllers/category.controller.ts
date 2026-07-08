import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  res.json(categories)
}

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body
  if (!name || !slug) return res.status(400).json({ error: 'name et slug requis' })
  const category = await prisma.category.create({ data: { name, slug } })
  res.status(201).json(category)
}

export const deleteCategory = async (req: Request, res: Response) => {
  await prisma.category.delete({ where: { id: Number(req.params.id) } })
  res.json({ message: 'Catégorie supprimée' })
}
