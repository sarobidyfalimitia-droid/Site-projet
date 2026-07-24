import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../types'

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const token = authHeader.substring(7)
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    if (payload.adminId) {
      req.adminId = payload.adminId
    }
    if (payload.clientId) {
      req.clientId = payload.clientId
    }
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide' })
  }
}