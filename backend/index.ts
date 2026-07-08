import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/auth.routes'
import projectRoutes from './routes/project.routes'
import categoryRoutes from './routes/category.routes'
import messageRoutes from './routes/message.routes'
import uploadRoutes from './routes/upload.routes'
import clientRoutes from './routes/client.routes'
import quoteRoutes from './routes/quote.routes'
import invoiceRoutes from './routes/invoice.routes'
import contractRoutes from './routes/contract.routes'
import appointmentRoutes from './routes/appointment.routes'
import testimonialRoutes from './routes/testimonial.routes'
import teamMemberRoutes from './routes/teamMember.routes'
import blogPostRoutes from './routes/blogPost.routes'
import { errorHandler } from './middleware/error.middleware'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/quotes', quoteRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/contracts', contractRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/team', teamMemberRoutes)
app.use('/api/blog', blogPostRoutes)

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
