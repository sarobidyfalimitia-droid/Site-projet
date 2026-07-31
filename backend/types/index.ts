import { Request } from 'express'
import multer from 'multer'

export interface AuthRequest extends Request {
  body: any
  query: any
  user?: Express.User
  adminId?: number
  clientId?: number
  file?: multer.File
  files?: multer.File[]
}
