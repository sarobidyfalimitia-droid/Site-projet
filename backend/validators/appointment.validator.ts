import { z } from 'zod'

export const appointmentSchema = z.object({
    clientId: z.number().int().positive().optional(),
    subject: z.string().min(3),
    description: z.string().min(10),
    scheduledAt: z.string().datetime(),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
    meetingUrl: z.string().url().optional().or(z.literal('')),
})
