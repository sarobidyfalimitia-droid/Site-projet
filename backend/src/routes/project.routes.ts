import { Router, Request, Response } from 'express'
import { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } from '../controllers/project.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getProjects)
router.get('/:slug', getProjectBySlug)
router.post('/', authenticate as any, requireAdmin as any, createProject)
router.put('/:id', authenticate as any, requireAdmin as any, updateProject)
router.delete('/:id', authenticate as any, requireAdmin as any, deleteProject)
export default router
