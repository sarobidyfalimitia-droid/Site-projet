import { z } from 'zod'

export const quoteSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    budgetRange: z.string().optional().or(z.literal('')),
    deadline: z.string().datetime().optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED']).optional(),
    clientId: z.number().int().positive().optional(),
    contactName: z.string().optional().or(z.literal('')),
    contactEmail: z.string().email().optional().or(z.literal('')),
    contactPhone: z.string().optional().or(z.literal('')),
    company: z.string().optional().or(z.literal('')),
})
