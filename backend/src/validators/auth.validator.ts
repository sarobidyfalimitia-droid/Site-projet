import { z } from 'zod'

const emailSchema = z.string().trim().email('Email invalide').transform((value) => value.toLowerCase())

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(6),
})
export const registerRequestSchema = z.object({
    name: z.string().min(2, 'Nom trop court').trim(),
    email: emailSchema,
    password: z.string().min(6, 'Mot de passe trop court (6 min)'),
    company: z.string().trim().optional().or(z.literal('')),
    phonePrefix: z.string().trim().optional().or(z.literal('')),
    phoneNumber: z.string().trim().optional().or(z.literal('')),
})

export const verifyOtpSchema = z.object({
    email: emailSchema,
    code: z.string().trim().regex(/^\d{6}$/, 'Code OTP invalide'),
})

export const forgotPasswordSchema = z.object({
    email: emailSchema,
})

export const resetPasswordSchema = z.object({
    email: emailSchema,
    code: z.string().trim().regex(/^\d{6}$/, 'Code OTP invalide'),
    newPassword: z.string().min(6, 'Mot de passe trop court (6 min)'),
})
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8),
})
