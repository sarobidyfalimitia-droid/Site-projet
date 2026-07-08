import { Router } from 'express'
import { getTeamMembers, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamMember.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getTeamMembers)
router.get('/:id', getTeamMember)
router.post('/', requireAuth, createTeamMember)
router.patch('/:id', requireAuth, updateTeamMember)
router.delete('/:id', requireAuth, deleteTeamMember)
export default router
