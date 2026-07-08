import { z } from 'zod'

export const invoiceSchema = z.object({
    quoteId: z.number().int().positive().optional(),
    clientId: z.number().int().positive().optional(),
    number: z.string().min(1),
    amount: z.number().positive(),
    dueDate: z.string().datetime(),
    status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']).optional(),
    pdfUrl: z.string().url().optional().or(z.literal('')),
})
