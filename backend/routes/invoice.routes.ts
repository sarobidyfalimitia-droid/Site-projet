import { Router } from 'express'
import { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } from '../controllers/invoice.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', requireAuth, getInvoices)
router.get('/:id', requireAuth, getInvoice)
router.post('/', requireAuth, createInvoice)
router.patch('/:id', requireAuth, updateInvoice)
router.delete('/:id', requireAuth, deleteInvoice)
export default router
