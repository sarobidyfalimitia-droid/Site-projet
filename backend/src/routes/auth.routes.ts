import { Router } from 'express'
import { login, register, verifyRegister, forgotPassword, resetPassword, refresh, me, logout, changePassword } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/register/verify', verifyRegister)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/refresh', refresh)
router.patch('/change-password', authenticate, changePassword)
router.get('/me', authenticate, me)
router.post('/logout', authenticate, logout)

export default router
