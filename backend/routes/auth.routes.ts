import { Router } from 'express'
import { login, me, changePassword, register, verifyRegister, forgotPassword, resetPassword, refresh, logout } from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.post('/login',           login)
router.get('/me',               requireAuth, me)
router.patch('/change-password',requireAuth, changePassword)
router.post('/register',        register)
router.post('/register/verify', verifyRegister)
router.post('/forgot-password',   forgotPassword)
router.post('/reset-password',    resetPassword)
router.post('/refresh',         refresh)
router.post('/logout',          requireAuth, logout)
export default router
