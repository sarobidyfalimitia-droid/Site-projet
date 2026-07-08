import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import type { AuthRequest } from '../middleware/auth.middleware'
import { loginSchema, changePasswordSchema } from '../validators/auth.validator'
import { z } from 'zod'

const generateTokens = (id: number, email: string, role: string) => {
  const accessToken = jwt.sign(
    { id, email, role },
    (process.env.JWT_SECRET || 'dev-secret') as jwt.Secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as jwt.SignOptions
  )
  const refreshToken = jwt.sign(
    { id, email, role },
    (process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret') as jwt.Secret,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' } as jwt.SignOptions
  )
  return { accessToken, refreshToken }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Email et mot de passe requis' })

    const { email, password } = parsed.data

    // Try admin first
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (admin && await bcrypt.compare(password, admin.password)) {
      const tokens = generateTokens(admin.id, admin.email, 'admin')
      await prisma.admin.update({ where: { id: admin.id }, data: { refreshToken: tokens.refreshToken } })
      return res.json({
        user: { id: admin.id, email: admin.email, name: (admin as any).name ?? admin.email, role: 'admin' },
        tokens,
      })
    }

    // Try client
    const client = await prisma.client.findFirst({ where: { email } })
    if (client && client.password && await bcrypt.compare(password, client.password)) {
      const tokens = generateTokens(client.id, client.email, 'client')
      await prisma.client.update({ where: { id: client.id }, data: { refreshToken: tokens.refreshToken } })
      return res.json({
        user: { id: client.id, email: client.email, name: client.name, role: 'client' },
        tokens,
      })
    }

    return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur interne' })
  }
}

export async function register(req: Request, res: Response) {
  try {
    const parsed = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      company: z.string().trim().max(100).optional().or(z.literal('')),
      phone: z.string().trim().max(30).optional().or(z.literal('')),
    }).safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Champs requis manquants' })

    const { name, email, password, company, phone } = parsed.data

    const exists = await prisma.client.findFirst({ where: { email } })
    if (exists) return res.status(409).json({ error: 'Un compte avec cet email existe déjà' })

    const hashed = await bcrypt.hash(password, 12)
    const client = await prisma.client.create({
      data: { name, email, company: company || null, phone: phone || null, status: 'active', password: hashed },
    })

    const tokens = generateTokens(client.id, client.email, 'client')
    await prisma.client.update({ where: { id: client.id }, data: { refreshToken: tokens.refreshToken } })

    res.status(201).json({
      user: { id: client.id, email: client.email, name: client.name, role: 'client' },
      tokens,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de la création du compte' })
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token manquant' })

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: number; email: string; role: string }

    let user: { id: number; email: string; name?: string | null; refreshToken?: string | null } | null = null
    if (decoded.role === 'admin') {
      user = await prisma.admin.findFirst({ where: { id: decoded.id, refreshToken } })
    } else {
      user = await prisma.client.findFirst({ where: { id: decoded.id, refreshToken } })
    }

    if (!user) return res.status(401).json({ error: 'Refresh token invalide' })

    const tokens = generateTokens(decoded.id, decoded.email, decoded.role)
    if (decoded.role === 'admin') {
      await prisma.admin.update({ where: { id: decoded.id }, data: { refreshToken: tokens.refreshToken } })
    } else {
      await prisma.client.update({ where: { id: decoded.id }, data: { refreshToken: tokens.refreshToken } })
    }

    res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
  } catch {
    res.status(401).json({ error: 'Token invalide' })
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const parsed = changePasswordSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Mot de passe invalide' })

    const { currentPassword, newPassword } = parsed.data
    const user = req.user
    if (!user) return res.status(401).json({ error: 'Non authentifié' })

    if (user.role === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { id: user.id } })
      if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
        return res.status(401).json({ error: 'Mot de passe actuel incorrect' })
      }
      await prisma.admin.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, 12) } })
    } else {
      const client = await prisma.client.findUnique({ where: { id: user.id } })
      if (!client || !(await bcrypt.compare(currentPassword, client.password || ''))) {
        return res.status(401).json({ error: 'Mot de passe actuel incorrect' })
      }
      await prisma.client.update({ where: { id: user.id }, data: { password: await bcrypt.hash(newPassword, 12) } })
    }

    res.json({ message: 'Mot de passe mis à jour' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur interne' })
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const { id, role } = req.user!
    if (role === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { id }, select: { id: true, email: true, name: true } })
      return res.json({ ...admin, role: 'admin' })
    }
    const client = await prisma.client.findUnique({ where: { id }, select: { id: true, email: true, name: true, company: true } })
    return res.json({ ...client, role: 'client' })
  } catch {
    res.status(500).json({ error: 'Erreur interne' })
  }
}

export async function logout(req: AuthRequest, res: Response) {
  try {
    const { id, role } = req.user!
    if (role === 'admin') await prisma.admin.update({ where: { id }, data: { refreshToken: null } })
    else await prisma.client.update({ where: { id }, data: { refreshToken: null } })
    res.json({ message: 'Déconnexion réussie' })
  } catch {
    res.status(500).json({ error: 'Erreur interne' })
  }
}