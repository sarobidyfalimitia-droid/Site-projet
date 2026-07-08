import { z } from 'zod'

export const clientSchema = z.object({
    name: z.string().min(2),
    company: z.string().optional().or(z.literal('')),
    email: z.string().email(),
    phone: z.string().optional().or(z.literal('')),
    status: z.string().default('active'),
})
