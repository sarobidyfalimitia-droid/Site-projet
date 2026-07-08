import { Router } from 'express'
import prisma from '../lib/prisma'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
const router = Router()
router.get('/stats', authenticate, requireAdmin, async (_req, res) => {
  const messageModel = (prisma as any).message
  const [projects, clients, quotes, invoices, unreadMessages] = await Promise.all([
    prisma.project.count(),
    prisma.client.count(),
    prisma.quote.count(),
    prisma.invoice.findMany({ select: { amount: true, status: true } }),
    typeof messageModel?.count === 'function' ? messageModel.count({ where: { read: false } }) : 0,
  ])
  const revenue = invoices.filter((i: any) => i.status === 'PAID').reduce((s: number, i: any) => s + i.amount, 0)
  const pendingQuotes = await prisma.quote.count({ where: { status: 'PENDING' } })
  const activeProjects = await prisma.project.count({ where: { published: false } })
  res.json({ projects, clients, quotes: invoices.length, invoices: invoices.length, revenue, pendingQuotes, activeProjects, unreadMessages })
})
router.get('/activity', authenticate, requireAdmin, async (_req, res) => {
  const messageModel = (prisma as any).message
  const [recentQuotes, recentMessages, recentProjects] = await Promise.all([
    prisma.quote.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { client: { select: { name: true } } } }),
    typeof messageModel?.findMany === 'function' ? messageModel.findMany({ take: 5, orderBy: { createdAt: 'desc' }, where: { read: false } }) : [],
    prisma.project.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ])
  res.json({ recentQuotes, recentMessages, recentProjects })
})
export default router
