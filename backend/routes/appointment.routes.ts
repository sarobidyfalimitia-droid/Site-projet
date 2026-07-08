import { Router } from 'express'
import { getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointment.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', requireAuth, getAppointments)
router.get('/:id', requireAuth, getAppointment)
router.post('/', requireAuth, createAppointment)
router.patch('/:id', requireAuth, updateAppointment)
router.delete('/:id', requireAuth, deleteAppointment)
export default router
