import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'
import rateLimit from 'express-rate-limit'
import path from 'path'

import authRoutes from './routes/auth.routes'
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

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

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
  message: { error: 'Trop de tentatives, réessayez plus tard.' },
})
app.use('/api/auth', authLimiter)

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
