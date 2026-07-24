import express from 'express'
import cors from 'cors'
import passport from 'passport'
import './src/passport/google.strategy'
import authRoutes from './src/routes/auth.routes'
import clientRoutes from './src/routes/client.routes'
import adminRoutes from './src/routes/admin.routes'
import projectRoutes from './src/routes/project.routes'
import taskRoutes from './src/routes/task.routes'
import ticketRoutes from './src/routes/ticket.routes'
import notificationRoutes from './src/routes/notification.routes'
import uploadRoutes from './src/routes/upload.routes'
import { errorHandler } from './src/middleware/error.middleware'

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(passport.initialize())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/upload', uploadRoutes)

// Error handling
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})