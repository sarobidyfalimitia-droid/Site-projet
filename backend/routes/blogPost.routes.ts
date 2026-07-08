import { Router } from 'express'
import { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/blogPost.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()
router.get('/', getBlogPosts)
router.get('/:slug', getBlogPost)
router.post('/', requireAuth, createBlogPost)
router.patch('/:id', requireAuth, updateBlogPost)
router.delete('/:id', requireAuth, deleteBlogPost)
export default router
