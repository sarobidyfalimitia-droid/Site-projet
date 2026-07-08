import { z } from 'zod'

export const projectSchema = z.object({
  title:        z.string().min(2).max(200),
  slug:         z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  excerpt:      z.string().min(10).max(300),
  description:  z.string().min(20),
  coverImage:   z.string(),
  images:       z.array(z.string()).default([]),
  liveUrl:      z.string().url().optional().or(z.literal('')),
  githubUrl:    z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1),
  published:    z.boolean().default(false),
  featured:     z.boolean().default(false),
  realizedAt:   z.string().datetime(),
  categoryId:   z.number().int().positive(),
})

export type ProjectInput = z.infer<typeof projectSchema>
