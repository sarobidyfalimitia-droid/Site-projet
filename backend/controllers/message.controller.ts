import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { messageSchema } from '../validators/message.validator'
import { getPaginationParams, paginatedResponse } from '../src/utils/pagination'

export const sendMessage = async (req: Request, res: Response) => {
  const result = messageSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })
  const message = await prisma.message.create({ data: result.data })
  res.status(201).json({ message: 'Message envoyé', id: message.id })
}

export const getMessages = async (req: Request, res: Response) => {
  const pagination = getPaginationParams(req)
  const where = pagination.search
    ? { OR: [{ name: { contains: pagination.search, mode: 'insensitive' as const } }, { email: { contains: pagination.search, mode: 'insensitive' as const } }, { subject: { contains: pagination.search, mode: 'insensitive' as const } }] }
    : {}

  const [messages, total] = await Promise.all([
    prisma.message.findMany({ where, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.limit }),
    prisma.message.count({ where }),
  ])
  res.json(paginatedResponse(messages, total, pagination))
}

export const markAsRead = async (req: Request, res: Response) => {
  const message = await prisma.message.update({ where: { id: Number(req.params.id) }, data: { read: true } })
  res.json(message)
}

export const deleteMessage = async (req: Request, res: Response) => {
  await prisma.message.delete({ where: { id: Number(req.params.id) } })
  res.json({ message: 'Message supprimé' })
}
