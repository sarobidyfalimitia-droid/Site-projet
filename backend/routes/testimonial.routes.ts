import { Router } from 'express'
import { getTestimonials, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getTestimonials)
router.get('/:id', requireAuth, getTestimonial)
router.post('/', requireAuth, createTestimonial)
router.patch('/:id', requireAuth, updateTestimonial)
router.delete('/:id', requireAuth, deleteTestimonial)
export default router
