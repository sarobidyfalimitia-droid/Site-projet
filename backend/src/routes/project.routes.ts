import { Router } from 'express'
import { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } from '../controllers/project.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getProjects)
router.get('/:slug', getProjectBySlug)
router.post('/', authenticate, requireAdmin, createProject)
router.put('/:id', authenticate, requireAdmin, updateProject)
router.delete('/:id', authenticate, requireAdmin, deleteProject)
export default router
