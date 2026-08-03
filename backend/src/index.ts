import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'
import rateLimit from 'express-rate-limit'
import path from 'path'
import passport from 'passport'

import authRoutes from './routes/auth.routes'
import './src/passport/google.strategy'
import { validateInput, preventXSS, securityHeaders, securityLogger, detectSuspiciousActivity } from './middleware/security.middleware'
import projectRoutes from './routes/project.routes'
import categoryRoutes from './routes/category.routes'
import clientRoutes from './routes/client.routes'
import quoteRoutes from './routes/quote.routes'
import invoiceRoutes from './routes/invoice.routes'
import contractRoutes from './routes/contract.routes'
import appointmentRoutes from './routes/appointment.routes'
import teamRoutes from './routes/team.routes'
import blogRoutes from './routes/blog.routes'
import testimonialRoutes from './routes/testimonial.routes'
import messageRoutes from './routes/message.routes'
import uploadRoutes from './routes/upload.routes'
import dashboardRoutes from './routes/dashboard.routes'

const app = express()
const httpServer = createServer(app)

// Trust proxy for rate limiting (Render uses proxies)
app.set('trust proxy', 1)

// ─── Socket.io ────────────────────────────────────────────────────────────────
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})

// ─── Security Middleware ──────────────────────────────────────────────────────
// Helmet - Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://agency-platform-backend.onrender.com", "http://localhost:3001"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}))

// CORS - Restrictive configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://technologia-62da.onrender.com',
      'http://localhost:3000',
    ]
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
}
app.use(cors(corsOptions))

// Body parsing with limits
app.use(express.json({ limit: '10mb', strict: true }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Passport initialization
app.use(passport.initialize())

// Security middleware
app.use(securityHeaders)
app.use(securityLogger)
app.use(detectSuspiciousActivity)
app.use(validateInput)
app.use(preventXSS)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, réessayez plus tard.' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth/register/verify', authLimiter)
app.use('/api/auth/forgot-password', authLimiter)
app.use('/api/auth/reset-password', authLimiter)

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/quotes', quoteRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/contracts', contractRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route introuvable' }))

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
