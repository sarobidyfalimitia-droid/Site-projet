import { z } from 'zod'

export const blogPostSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
    excerpt: z.string().min(20),
    content: z.string().min(20),
    coverImage: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string()).optional().default([]),
    published: z.boolean().optional(),
    publishedAt: z.string().datetime().optional().or(z.literal('')),
})
