import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { z } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({
          error: 'Données invalides',
          details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
        })
      }
      next(err)
    }
  }
}

// ─── Schemas ──────────────────────────────────────────────────────────────────
export const schemas = {
  login: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
  }),

  register: z.object({
    name: z.string().min(2, 'Nom trop court'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court (6 min)'),
    company: z.string().optional(),
    phone: z.string().optional(),
  }),

  project: z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    excerpt: z.string().min(10),
    description: z.string(),
    technologies: z.array(z.string()).default([]),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    categoryId: z.number().optional().nullable(),
  }),

  quote: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    company: z.string().optional(),
    budgetRange: z.string().optional(),
    deadline: z.string().optional(),
  }),

  message: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(3),
    body: z.string().min(10),
  }),

  client: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6).optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  }),
}
