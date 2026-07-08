import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { messageSchema } from '../validators/message.validator'

export const sendMessage = async (req: Request, res: Response) => {
  const result = messageSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })
  const message = await prisma.message.create({ data: result.data })
  res.status(201).json({ message: 'Message envoyé', id: message.id })
}

export const getMessages = async (_req: Request, res: Response) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(messages)
}

export const markAsRead = async (req: Request, res: Response) => {
  const message = await prisma.message.update({ where: { id: Number(req.params.id) }, data: { read: true } })
  res.json(message)
}

export const deleteMessage = async (req: Request, res: Response) => {
  await prisma.message.delete({ where: { id: Number(req.params.id) } })
  res.json({ message: 'Message supprimé' })
}
