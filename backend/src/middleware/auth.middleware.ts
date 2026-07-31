import { Request, RequestHandler, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import multer from 'multer'

export interface AuthRequest extends Request {
  body: any
  query: any
  user?: Express.User
  file?: multer.File
  files?: multer.File[]
}

export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Token manquant' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Express.User
    ;(req as AuthRequest).user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' })
    return
  }
}

export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  if ((req as AuthRequest).user?.role !== 'admin') {
    res.status(403).json({ error: 'Accès réservé aux administrateurs' })
    return
  }
  next()
}

export const requireClient: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (!(req as AuthRequest).user) {
    res.status(401).json({ error: 'Non authentifié' })
    return
  }
  next()
}
