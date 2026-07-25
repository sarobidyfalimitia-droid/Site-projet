import { Request } from 'express'

export interface AuthRequest extends Request {
  user?: Express.User
  adminId?: number
  clientId?: number
}
