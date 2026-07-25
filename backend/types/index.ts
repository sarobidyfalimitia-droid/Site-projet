import { Request } from 'express'

declare global {
  namespace Express {
    interface User {
      id: number
      role: 'admin' | 'client'
      email: string
    }
  }
}

export interface AuthRequest extends Request {
  user?: Express.User
  adminId?: number
  clientId?: number
}
