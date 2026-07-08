import { z } from 'zod'

export const teamMemberSchema = z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    bio: z.string().min(10),
    photo: z.string().url(),
    skills: z.array(z.string()).optional().default([]),
    socials: z.array(z.string()).optional().default([]),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
})
