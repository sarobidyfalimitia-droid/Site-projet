import { z } from 'zod'

export const contractSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    clientId: z.number().int().positive().optional(),
    quoteId: z.number().int().positive().optional(),
    startDate: z.string().datetime().optional().or(z.literal('')),
    endDate: z.string().datetime().optional().or(z.literal('')),
    status: z.enum(['DRAFT', 'SENT', 'SIGNED', 'CANCELLED']).optional(),
    pdfUrl: z.string().url().optional().or(z.literal('')),
})
