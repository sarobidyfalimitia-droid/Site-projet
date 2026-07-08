import { Router } from 'express'
import { login, me, changePassword } from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.post('/login',           login)
router.get('/me',               requireAuth, me)
router.patch('/change-password',requireAuth, changePassword)
export default router
