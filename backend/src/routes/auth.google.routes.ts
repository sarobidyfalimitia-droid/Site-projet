import passport from 'passport'
import express from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  async (req: any, res) => {
    try {
      const user = req.user as any
      
      // Générer les tokens JWT
      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '15m' }
      )
      
      const refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
        { expiresIn: '30d' }
      )

      // Sauvegarder le refresh token
      await prisma.client.update({
        where: { id: user.id },
        data: { refreshToken }
      })

      // Rediriger vers le frontend avec les tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`)
    } catch (err) {
      console.error(err)
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`)
    }
  }
)

export default router