import { Router } from 'express'
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/',      getCategories)
router.post('/',     requireAuth, createCategory)
router.delete('/:id',requireAuth, deleteCategory)
export default router
