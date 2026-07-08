import { Router } from 'express'
import { uploadImage, deleteImage, listImages } from '../controllers/upload.controller'
import { requireAuth } from '../middleware/auth.middleware'
import { upload } from '../middleware/upload.middleware'

const router = Router()
router.post('/',            requireAuth, upload.single('image'), uploadImage)
router.get('/media',        requireAuth, listImages)
router.delete('/:filename', requireAuth, deleteImage)
export default router
