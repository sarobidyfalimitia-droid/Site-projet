import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { loginSchema, changePasswordSchema } from '../validators/auth.validator'
import { AuthRequest } from '../types'

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  const admin = await prisma.admin.findUnique({ where: { email: result.data.email } })
  if (!admin) return res.status(401).json({ error: 'Identifiants invalides' })

  const valid = await bcrypt.compare(result.data.password, admin.password)
  if (!valid) return res.status(401).json({ error: 'Identifiants invalides' })

  const accessToken = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
  const refreshToken = jwt.sign({ adminId: admin.id }, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET || 'dev-secret'), { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' })

  // persist refresh token
  await prisma.admin.update({ where: { id: admin.id }, data: { refreshToken } }).catch(() => { })

  const user = { id: admin.id, email: admin.email, name: admin.name, role: 'admin' }
  res.json({ user, tokens: { accessToken, refreshToken } })
}

export const me = async (req: AuthRequest, res: Response) => {
  const admin = await prisma.admin.findUnique({ where: { id: req.adminId }, select: { id: true, email: true } })
  res.json(admin)
}

export const changePassword = async (req: AuthRequest, res: Response) => {
  const result = changePasswordSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  const admin = await prisma.admin.findUnique({ where: { id: req.adminId } })
  if (!admin) return res.status(404).json({ error: 'Admin introuvable' })

  const valid = await bcrypt.compare(result.data.currentPassword, admin.password)
  if (!valid) return res.status(401).json({ error: 'Mot de passe actuel incorrect' })

  const hash = await bcrypt.hash(result.data.newPassword, 12)
  await prisma.admin.update({ where: { id: admin.id }, data: { password: hash } })
  res.json({ message: 'Mot de passe mis à jour' })
}
