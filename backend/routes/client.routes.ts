import { Router } from 'express'
import { getClients, getClient, createClient, updateClient, deleteClient } from '../controllers/client.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', requireAuth, getClients)
router.get('/:id', requireAuth, getClient)
router.post('/', requireAuth, createClient)
router.patch('/:id', requireAuth, updateClient)
router.delete('/:id', requireAuth, deleteClient)
export default router
