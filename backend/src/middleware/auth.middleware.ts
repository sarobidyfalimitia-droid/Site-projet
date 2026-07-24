import { Request, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface User {
      id: number
      role: 'admin' | 'client'
      email: string
    }
  }
}

export interface AuthRequest extends Request {}

export const authenticate: RequestHandler = (req, res, next): void => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'Token manquant' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: 'admin' | 'client'; email: string }
    ;(req as AuthRequest).user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' })
    return
  }
}

export const requireAdmin: RequestHandler = (req, res, next): void => {
  if ((req as AuthRequest).user?.role !== 'admin') {
    res.status(403).json({ error: 'Accès réservé aux administrateurs' })
    return
  }
  next()
}

export const requireClient: RequestHandler = (req, res, next): void => {
  if (!(req as AuthRequest).user) {
    res.status(401).json({ error: 'Non authentifié' })
    return
  }
  next()
}
