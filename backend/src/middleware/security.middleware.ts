import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// ─── Input Validation Middleware ──────────────────────────────────────────────

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Prevent SQL injection in query parameters
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(UNION\s+SELECT)/i,
    /(\/\*.*?\*\/)/g,
    /(--)/g,
    /(\bOR\b\s+\d+\s*=\s*\d+)/i,
    /(\bAND\b\s+\d+\s*=\s*\d+)/i,
  ]

  const checkForInjection = (str: string): boolean => {
    if (typeof str !== 'string') return false
    return sqlInjectionPatterns.some(pattern => pattern.test(str))
  }

  // Check query parameters
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (checkForInjection(String(value))) {
        return res.status(400).json({ error: 'Invalid input detected' })
      }
    }
  }

  // Check body
  if (req.body && typeof req.body === 'object') {
    const checkObject = (obj: any): boolean => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && checkForInjection(value)) {
          return true
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (checkObject(value)) return true
        }
      }
      return false
    }

    if (checkObject(req.body)) {
      return res.status(400).json({ error: 'Invalid input detected' })
    }
  }

  next()
}

// ─── XSS Protection Middleware ────────────────────────────────────────────────

export const preventXSS = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj
          .replace(/&/g, '&')
          .replace(/</g, '<')
          .replace(/>/g, '>')
          .replace(/"/g, '"')
          .replace(/'/g, '&#039;')
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitize)
      }
      if (obj !== null && typeof obj === 'object') {
        const sanitized: any = {}
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitize(value)
        }
        return sanitized
      }
      return obj
    }

    req.body = sanitize(req.body)
  }

  // Set XSS protection headers
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('X-Content-Type-Options', 'nosniff')

  next()
}

// ─── Request Size Limit Middleware ────────────────────────────────────────────

export const requestSizeLimit = (maxSize: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0')
    const maxBytes = parseInt(maxSize)

    if (contentLength > maxBytes) {
      return res.status(413).json({ error: 'Request entity too large' })
    }

    next()
  }
}

// ─── suspicious Activity Detection ────────────────────────────────────────────

export const detectSuspiciousActivity = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.headers['user-agent'] || ''
  
  // Detect common attack patterns in User-Agent
  const suspiciousPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i,
    /burp/i,
    /scanner/i,
    /crawler/i,
    /spider/i,
    /bot/i,
  ]

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent))

  if (isSuspicious) {
    console.warn(`Suspicious request detected from IP: ${req.ip}, User-Agent: ${userAgent}`)
    // Log but don't block - could be legitimate crawlers
  }

  next()
}

// ─── JWT Token Validation Middleware ──────────────────────────────────────────

export const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ─── Admin Only Middleware ─────────────────────────────────────────────────────

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// ─── Sanitize MongoDB/Prisma Queries ──────────────────────────────────────────

export const sanitizeQuery = (req: Request, res: Response, next: NextFunction) => {
  // Remove any potential NoSQL injection attempts
  if (req.query) {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string' && (value.includes('$') || value.includes('{'))) {
        return res.status(400).json({ error: 'Invalid query parameter' })
      }
    }
  }
  next()
}

// ─── Prevent Parameter Pollution ──────────────────────────────────────────────

export const preventParameterPollution = (req: Request, res: Response, next: NextFunction) => {
  // Check for duplicate parameters (e.g., ?id=1&id=2)
  const queryKeys = Object.keys(req.query)
  const uniqueKeys = new Set(queryKeys)

  if (queryKeys.length !== uniqueKeys.size) {
    return res.status(400).json({ error: 'Duplicate parameters detected' })
  }

  next()
}

// ─── Security Headers Middleware ──────────────────────────────────────────────

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By')

  next()
}

// ─── Logging Middleware ───────────────────────────────────────────────────────

export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const ip = req.ip || req.connection.remoteAddress
  const method = req.method
  const url = req.url
  const userAgent = req.headers['user-agent']

  // Log suspicious activities
  if (url.includes('..') || url.includes('%00')) {
    console.log(`[SECURITY] ${timestamp} - Path traversal attempt from ${ip}: ${url}`)
  }

  // Log failed authentication attempts
  if (url.includes('/auth/login') || url.includes('/auth/register')) {
    console.log(`[AUTH] ${timestamp} - ${method} ${url} from ${ip}`)
  }

  next()
}