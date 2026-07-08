import { Router } from 'express'
import { getPublicProjects, getPublicProjectBySlug, getAllProjectsAdmin, createProject, updateProject, deleteProject } from '../controllers/project.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/',              getPublicProjects)
router.get('/:slug',         getPublicProjectBySlug)
router.get('/admin/all',     requireAuth, getAllProjectsAdmin)
router.post('/',             requireAuth, createProject)
router.patch('/:id',         requireAuth, updateProject)
router.delete('/:id',        requireAuth, deleteProject)
export default router
