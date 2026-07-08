import { z } from 'zod'

export const testimonialSchema = z.object({
    clientName: z.string().min(2),
    company: z.string().optional().or(z.literal('')),
    role: z.string().optional().or(z.literal('')),
    quote: z.string().min(10),
    rating: z.number().int().min(1).max(5).optional(),
    published: z.boolean().optional(),
})
