import { z } from 'zod'

export const messageSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  subject: z.string().min(2).max(200),
  body:    z.string().min(10).max(2000),
})
