import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from '../lib/prisma'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value
    if (!email) return done(new Error('No email found'), false)

    let user = await prisma.client.findUnique({ where: { email } })
    
    if (!user) {
      user = await prisma.client.create({
        data: {
          email,
          name: profile.displayName || email,
          password: null,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })
    }

    return done(null, { id: user.id, email: user.email, role: 'client' } as any)
  } catch (err) {
    return done(err, false)
  }
}))

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, { id: user.id, email: user.email, role: user.role })
})

// Deserialize user from session
passport.deserializeUser((user: any, done) => {
  done(null, user)
})

export default passport
