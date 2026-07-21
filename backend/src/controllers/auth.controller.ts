import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import type { AuthRequest } from '../middleware/auth.middleware'
import {
  loginSchema,
  registerRequestSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../validators/auth.validator'
import { z } from 'zod'
import { generateOTP, getOtpExpiry } from '../utils/otp'
import { sendEmail, emailTemplates } from '../utils/email'
import { normalizeEmail, isOtpCodeValid } from '../utils/auth.utils'

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
    const normalizedEmail = normalizeEmail(email)

    // Try admin first
    const admin = await prisma.admin.findUnique({ where: { email: normalizedEmail } })
    if (admin && await bcrypt.compare(password, admin.password)) {
      const tokens = generateTokens(admin.id, admin.email, 'admin')
      await prisma.admin.update({ where: { id: admin.id }, data: { refreshToken: tokens.refreshToken } })
      return res.json({
        user: { id: admin.id, email: admin.email, name: (admin as any).name ?? admin.email, role: 'admin' },
        tokens,
      })
    }

    // Try client
    const client = await prisma.client.findFirst({ where: { email: normalizedEmail } })
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
    const parsed = registerRequestSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides', details: parsed.error.errors })

    const { name, email, password, company, phonePrefix, phoneNumber } = parsed.data
    const normalizedEmail = normalizeEmail(email)
    const phone = [phonePrefix, phoneNumber].filter(Boolean).join('').trim() || null

    const exists = await prisma.client.findUnique({ where: { email: normalizedEmail } })
    if (exists) return res.status(409).json({ error: 'Un compte avec cet email existe déjà' })

    const hashedPassword = await bcrypt.hash(password, 12)
    const code = generateOTP(6)
    const expiresAt = getOtpExpiry(10)

    await prisma.authOtp.create({
      data: {
        email: normalizedEmail,
        type: 'REGISTER',
        code,
        expiresAt,
        payload: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          company: company || null,
          phone,
        },
      },
    })

    void sendEmail({
      to: normalizedEmail,
      subject: 'Code de vérification Techno-logia',
      html: emailTemplates.verifyRegistration(name, code),
    })

    res.status(200).json({ message: 'Code de vérification envoyé à votre adresse email.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de l\'envoi du code de vérification' })
  }
}

export async function verifyRegister(req: Request, res: Response) {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides', details: parsed.error.errors })

    const { email, code } = parsed.data
    const normalizedEmail = normalizeEmail(email)
    if (!isOtpCodeValid(code)) return res.status(400).json({ error: 'Code OTP invalide' })
    const otp = await prisma.authOtp.findFirst({
      where: {
        email: normalizedEmail,
        type: 'REGISTER',
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otp || !otp.payload) return res.status(400).json({ error: 'Code OTP invalide ou expiré' })
    const payload = otp.payload as { name: string; email: string; password: string; company?: string | null; phone?: string | null }

    const exists = await prisma.client.findUnique({ where: { email: normalizedEmail } })
    if (exists) return res.status(409).json({ error: 'Un compte avec cet email existe déjà' })

    const client = await prisma.client.create({
      data: {
        name: payload.name,
        email: normalizedEmail,
        password: payload.password,
        company: payload.company || null,
        phone: payload.phone || null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    await prisma.authOtp.update({ where: { id: otp.id }, data: { used: true } })

    const tokens = generateTokens(client.id, client.email, 'client')
    await prisma.client.update({ where: { id: client.id }, data: { refreshToken: tokens.refreshToken } })

    res.status(201).json({
      user: { id: client.id, email: client.email, name: client.name, role: 'client' },
      tokens,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur interne' })
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides', details: parsed.error.errors })

    const { email } = parsed.data
    const normalizedEmail = normalizeEmail(email)
    const user = await prisma.client.findUnique({ where: { email: normalizedEmail } }) || await prisma.admin.findUnique({ where: { email: normalizedEmail } })
    if (!user) {
      return res.status(200).json({ message: 'Si ce compte existe, un code de réinitialisation a été envoyé.' })
    }

    const code = generateOTP(6)
    const expiresAt = getOtpExpiry(10)

    await prisma.authOtp.create({
      data: {
        email: normalizedEmail,
        type: 'RESET',
        code,
        expiresAt,
      },
    })

    void sendEmail({
      to: normalizedEmail,
      subject: 'Réinitialisation de mot de passe Techno-logia',
      html: emailTemplates.passwordReset(code),
    })

    res.status(200).json({ message: 'Code de réinitialisation envoyé par email.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur interne' })
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides', details: parsed.error.errors })

    const { email, code, newPassword } = parsed.data
    const normalizedEmail = normalizeEmail(email)
    if (!isOtpCodeValid(code)) return res.status(400).json({ error: 'Code OTP invalide' })
    const otp = await prisma.authOtp.findFirst({
      where: {
        email: normalizedEmail,
        type: 'RESET',
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otp) return res.status(400).json({ error: 'Code OTP invalide ou expiré' })

    const targetAdmin = await prisma.admin.findUnique({ where: { email: normalizedEmail } })
    const targetClient = await prisma.client.findUnique({ where: { email: normalizedEmail } })
    if (!targetAdmin && !targetClient) return res.status(404).json({ error: 'Compte introuvable' })

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    if (targetAdmin) {
      await prisma.admin.update({ where: { email: normalizedEmail }, data: { password: hashedPassword } })
    } else {
      await prisma.client.update({ where: { email: normalizedEmail }, data: { password: hashedPassword } })
    }

    await prisma.authOtp.update({ where: { id: otp.id }, data: { used: true } })

    res.json({ message: 'Mot de passe réinitialisé avec succès' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur interne' })
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
      const admin = await prisma.admin.findUnique({ where: { id }, select: { id: true, email: true } })
      if (!admin) return res.status(404).json({ error: 'Utilisateur introuvable' })
      return res.json({ id: admin.id, email: admin.email, name: admin.email, role: 'admin' })
    }
    const client = await prisma.client.findUnique({ where: { id }, select: { id: true, email: true, name: true, company: true } })
    if (!client) return res.status(404).json({ error: 'Utilisateur introuvable' })
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