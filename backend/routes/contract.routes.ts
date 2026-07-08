import { Router } from 'express'
import { getContracts, getContract, createContract, updateContract, deleteContract } from '../controllers/contract.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', requireAuth, getContracts)
router.get('/:id', requireAuth, getContract)
router.post('/', requireAuth, createContract)
router.patch('/:id', requireAuth, updateContract)
router.delete('/:id', requireAuth, deleteContract)
export default router
