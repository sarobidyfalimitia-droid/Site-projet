import { Router } from 'express'
import { sendMessage, getMessages, markAsRead, deleteMessage } from '../controllers/message.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.post('/',          sendMessage)
router.get('/',           requireAuth, getMessages)
router.patch('/:id/read', requireAuth, markAsRead)
router.delete('/:id',     requireAuth, deleteMessage)
export default router
