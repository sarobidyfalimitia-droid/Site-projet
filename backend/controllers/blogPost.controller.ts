import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { blogPostSchema } from '../validators/blogPost.validator'
import { getPaginationParams, paginatedResponse } from '../src/utils/pagination'

export const getBlogPosts = async (req: Request, res: Response) => {
    const pagination = getPaginationParams(req)
    const where = pagination.search
        ? { OR: [{ title: { contains: pagination.search, mode: 'insensitive' as const } }, { excerpt: { contains: pagination.search, mode: 'insensitive' as const } }] }
        : {}

    const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: pagination.skip, take: pagination.limit }),
        prisma.blogPost.count({ where }),
    ])
    res.json(paginatedResponse(posts, total, pagination))
}

export const getBlogPost = async (req: Request, res: Response) => {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } })
    if (!post) return res.status(404).json({ error: 'Article introuvable' })
    res.json(post)
}

export const createBlogPost = async (req: Request, res: Response) => {
    const result = blogPostSchema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = {
        ...result.data,
        publishedAt: result.data.publishedAt ? new Date(result.data.publishedAt) : undefined,
    }
    const post = await prisma.blogPost.create({ data })
    res.status(201).json(post)
}

export const updateBlogPost = async (req: Request, res: Response) => {
    const result = blogPostSchema.partial().safeParse(req.body)
    if (!result.success) return res.status(400).json({ error: result.error.flatten() })
    const data = {
        ...result.data,
        publishedAt: result.data.publishedAt ? new Date(result.data.publishedAt) : undefined,
    }
    const post = await prisma.blogPost.update({ where: { id: Number(req.params.id) }, data })
    res.json(post)
}

export const deleteBlogPost = async (req: Request, res: Response) => {
    await prisma.blogPost.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Article supprimé' })
}
