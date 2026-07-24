import express from 'express'
import { login, register, refresh, changePassword, me, logout } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import authGoogleRoutes from './auth.google.routes'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/refresh', refresh)
router.post('/change-password', authenticate, changePassword)
router.get('/me', authenticate, me)
router.post('/logout', authenticate, logout)

// Google OAuth routes
router.use('/google', authGoogleRoutes)

export default router