import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { loginSchema, changePasswordSchema } from '../validators/auth.validator'
import { AuthRequest } from '../types'
import { sendEmail, emailTemplates } from '../src/utils/email'

// Generate OTP code
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

// Helper to create tokens
const createTokens = (id: number, role: 'admin' | 'client') => {
  const payload = role === 'admin' ? { adminId: id } : { clientId: id }
  const secret = process.env.JWT_SECRET || 'dev-secret'
  const refreshSecret = process.env.JWT_REFRESH_SECRET || secret
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  
  const accessToken = jwt.sign(payload, secret, { expiresIn: String(expiresIn) } as any)
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: String(refreshExpiresIn) } as any)
  return { accessToken, refreshToken }
}

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  // Check both admin and client
  const admin = await prisma.admin.findUnique({ where: { email: result.data.email } })
  if (admin) {
    const valid = await bcrypt.compare(result.data.password, admin.password)
    if (!valid) return res.status(401).json({ error: 'Identifiants invalides' })

    const { accessToken, refreshToken } = createTokens(admin.id, 'admin')
    await prisma.admin.update({ where: { id: admin.id }, data: { refreshToken } }).catch(() => { })

    const user = { id: admin.id, email: admin.email, role: 'admin' }
    return res.json({ user, tokens: { accessToken, refreshToken } })
  }

  const client = await prisma.client.findUnique({ where: { email: result.data.email } })
  if (!client || !client.password) return res.status(401).json({ error: 'Identifiants invalides' })

  const valid = await bcrypt.compare(result.data.password, client.password)
  if (!valid) return res.status(401).json({ error: 'Identifiants invalides' })

  const { accessToken, refreshToken } = createTokens(client.id, 'client')
  await prisma.client.update({ where: { id: client.id }, data: { refreshToken } }).catch(() => { })

  const user = { id: client.id, email: client.email, name: client.name, role: 'client' }
  res.json({ user, tokens: { accessToken, refreshToken } })
}

export const me = async (req: AuthRequest, res: Response) => {
  if (req.adminId) {
    const admin = await prisma.admin.findUnique({ where: { id: req.adminId }, select: { id: true, email: true } })
    return res.json({ ...admin, role: 'admin' })
  }
  if (req.clientId) {
    const client = await prisma.client.findUnique({ where: { id: req.clientId }, select: { id: true, email: true, name: true, company: true } })
    return res.json({ ...client, role: 'client' })
  }
  res.status(401).json({ error: 'Non authentifié' })
}

export const changePassword = async (req: AuthRequest, res: Response) => {
  const result = changePasswordSchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ error: result.error.flatten() })

  if (req.adminId) {
    const admin = await prisma.admin.findUnique({ where: { id: req.adminId } })
    if (!admin) return res.status(404).json({ error: 'Admin introuvable' })

    const valid = await bcrypt.compare(result.data.currentPassword, admin.password)
    if (!valid) return res.status(401).json({ error: 'Mot de passe actuel incorrect' })

    const hash = await bcrypt.hash(result.data.newPassword, 12)
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hash } })
    return res.json({ message: 'Mot de passe mis à jour' })
  }

  if (req.clientId) {
    const client = await prisma.client.findUnique({ where: { id: req.clientId } })
    if (!client) return res.status(404).json({ error: 'Client introuvable' })

    const valid = await bcrypt.compare(result.data.currentPassword, client.password || '')
    if (!valid) return res.status(401).json({ error: 'Mot de passe actuel incorrect' })

    const hash = await bcrypt.hash(result.data.newPassword, 12)
    await prisma.client.update({ where: { id: client.id }, data: { password: hash } })
    return res.json({ message: 'Mot de passe mis à jour' })
  }

  res.status(401).json({ error: 'Non authentifié' })
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password, company, phonePrefix, phoneNumber } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nom, email et mot de passe requis' })
  }

  const existing = await prisma.client.findUnique({ where: { email } })
  if (existing) return res.status(409).json({ error: 'Email déjà utilisé' })

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.authOtp.create({
    data: { email, type: 'REGISTER', code, expiresAt, payload: { name, password, company, phonePrefix, phoneNumber } }
  })

  await sendEmail({
    to: email,
    subject: 'Code de vérification',
    html: emailTemplates.verifyRegistration(name, code)
  })

  res.json({ message: 'Code de vérification envoyé' })
}

export const verifyRegister = async (req: Request, res: Response) => {
  const { email, code } = req.body
  if (!email || !code) return res.status(400).json({ error: 'Email et code requis' })

  const otp = await prisma.authOtp.findFirst({
    where: { email, type: 'REGISTER', code, used: false, expiresAt: { gt: new Date() } }
  })
  if (!otp) return res.status(401).json({ error: 'Code invalide ou expiré' })

  const payload = otp.payload as any
  const hash = await bcrypt.hash(payload.password, 12)

  const client = await prisma.client.create({
    data: {
      name: payload.name,
      email,
      password: hash,
      company: payload.company,
      phone: payload.phoneNumber ? `${payload.phonePrefix}${payload.phoneNumber}` : undefined
    }
  })

  await prisma.authOtp.update({ where: { id: otp.id }, data: { used: true } })

  const { accessToken, refreshToken } = createTokens(client.id, 'client')
  await prisma.client.update({ where: { id: client.id }, data: { refreshToken } })

  res.json({ user: { id: client.id, email: client.email, name: client.name, role: 'client' }, tokens: { accessToken, refreshToken } })
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email requis' })

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.authOtp.create({
    data: { email, type: 'RESET', code, expiresAt }
  })

  await sendEmail({
    to: email,
    subject: 'Réinitialisation mot de passe',
    html: emailTemplates.passwordReset(code)
  })

  res.json({ message: 'Code envoyé si le compte existe' })
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'Tous les champs requis' })

  const otp = await prisma.authOtp.findFirst({
    where: { email, type: 'RESET', code, used: false, expiresAt: { gt: new Date() } }
  })
  if (!otp) return res.status(401).json({ error: 'Code invalide ou expiré' })

  const hash = await bcrypt.hash(newPassword, 12)

  // Update both admin and client
  await prisma.admin.updateMany({ where: { email }, data: { password: hash } })
  await prisma.client.updateMany({ where: { email }, data: { password: hash } })

  await prisma.authOtp.update({ where: { id: otp.id }, data: { used: true } })

  res.json({ message: 'Mot de passe réinitialisé' })
}

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token requis' })

  try {
    const payload: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-secret')

    if (payload.adminId) {
      const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } })
      if (!admin) return res.status(401).json({ error: 'Token invalide' })

      const accessToken = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: String(process.env.JWT_EXPIRES_IN || '7d') } as any)
      return res.json({ accessToken })
    }

    if (payload.clientId) {
      const client = await prisma.client.findUnique({ where: { id: payload.clientId } })
      if (!client) return res.status(401).json({ error: 'Token invalide' })

      const accessToken = jwt.sign({ clientId: client.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: String(process.env.JWT_EXPIRES_IN || '7d') } as any)
      return res.json({ accessToken })
    }

    res.status(401).json({ error: 'Token invalide' })
  } catch {
    res.status(401).json({ error: 'Token expiré ou invalide' })
  }
}

export const logout = async (req: AuthRequest, res: Response) => {
  if (req.adminId) {
    await prisma.admin.update({ where: { id: req.adminId }, data: { refreshToken: null } }).catch(() => { })
  }
  if (req.clientId) {
    await prisma.client.update({ where: { id: req.clientId }, data: { refreshToken: null } }).catch(() => { })
  }
  res.json({ message: 'Déconnecté' })
}