import { Router } from 'express'
import { getQuotes, getQuote, createQuote, updateQuote, deleteQuote } from '../controllers/quote.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', requireAuth, getQuotes)
router.get('/:id', requireAuth, getQuote)
router.post('/', createQuote)
router.patch('/:id', requireAuth, updateQuote)
router.delete('/:id', requireAuth, deleteQuote)
export default router
