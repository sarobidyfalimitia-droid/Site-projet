import { Request } from 'express'

export interface AuthRequest extends Request {
  body: any
  query: any
  user?: Express.User
  adminId?: number
  clientId?: number
  file?: Express.Multer.File
  files?: Express.Multer.File[]
}
