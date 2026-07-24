# Modifications Backend - Google OAuth2

## 📝 Résumé des modifications

1. Supprimer OTP/SMTP
2. Ajouter Google OAuth2 avec Passport.js
3. Modifier les routes d'authentification
4. Mettre à jour les modèles Prisma

---

## 🎯 ÉTAPE 1 : Installer les dépendances

```bash
cd agency-platform/backend
npm install passport passport-google-oauth20 express-session
npm install -D @types/passport @types/passport-google-oauth20 @types/express-session
```

---

## 🎯 ÉTAPE 2 : Créer la stratégie Google OAuth

**Fichier** : `backend/src/passport/google.strategy.ts`

```typescript
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

    return done(null, { id: user.id, email: user.email, role: 'client' })
  } catch (err) {
    return done(err, false)
  }
}))
```

---

## 🎯 ÉTAPE 3 : Créer les routes Google OAuth

**Fichier** : `backend/src/routes/auth.google.routes.ts`

```typescript
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
```

---

## 🎯 ÉTAPE 4 : Modifier auth.controller.ts

**Supprimer** ces fonctions :
- `verifyRegister` (ligne 141-193)
- `forgotPassword` (ligne 195-230)
- `resetPassword` (ligne 232-271)

**Supprimer** ces imports :
- `generateOTP, getOtpExpiry` depuis `../utils/otp`
- `sendEmail, emailTemplates` depuis `../utils/email`
- `verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema` depuis les validators

**Garder** seulement :
- `login`
- `register` (modifié sans OTP)
- `refresh`
- `changePassword`
- `me`
- `logout`

**Nouvelle fonction register** (sans OTP) :

```typescript
export async function register(req: Request, res: Response) {
  try {
    const parsed = registerRequestSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Données invalides', details: parsed.error.errors })

    const { name, email, password, company, phonePrefix, phoneNumber } = parsed.data
    const normalizedEmail = normalizeEmail(email)
    const phone = [phonePrefix, phoneNumber].filter(Boolean).join('').trim() || null

    const exists = await prisma.client.findUnique({ where: { email: normalizedEmail } })
    if (exists) return res.status(409).json({ error: 'Un compte avec cet email existe déjà' })

    const hashedPassword = await bcrypt.hash(password, 12)

    const client = await prisma.client.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        company: company || null,
        phone,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    const tokens = generateTokens(client.id, client.email, 'client')
    await prisma.client.update({ where: { id: client.id }, data: { refreshToken: tokens.refreshToken } })

    res.status(201).json({
      message: 'Compte client créé avec succès.',
      user: { id: client.id, email: client.email, name: client.name, role: 'client' },
      tokens,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur interne' })
  }
}
```

---

## 🎯 ÉTAPE 5 : Modifier les routes

**Fichier** : `backend/src/routes/auth.routes.ts`

**Supprimer** ces routes :
- `POST /verify-register`
- `POST /forgot-password`
- `POST /reset-password`

**Ajouter** la route Google OAuth :
```typescript
import authGoogleRoutes from './auth.google.routes'
app.use('/api/auth', authGoogleRoutes)
```

---

## 🎯 ÉTAPE 6 : Modifier le modèle Prisma

**Fichier** : `backend/prisma/schema.prisma`

**Supprimer** le modèle `AuthOtp` :

```prisma
model AuthOtp {
  id        Int      @id @default(autoincrement())
  email     String
  type      String
  code      String
  expiresAt DateTime
  used      Boolean  @default(false)
  payload   Json?
  createdAt DateTime @default(now())

  @@index([email, code])
}
```

**Ajouter** au modèle `Client` (si pas déjà présent) :
```prisma
model Client {
  id            Int      @id @default(autoincrement())
  email         String   @unique
  password      String?
  name          String
  company       String?
  phone         String?
  status        String   @default("pending")
  refreshToken  String?
  googleId      String?  @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🎯 ÉTAPE 7 : Mettre à jour les variables d'environnement

**Fichier** : `backend/.env.production`

**Supprimer** ces variables :
```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
SMTP_DISABLED
```

**Ajouter** ces variables :
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://agency-platform-backend.onrender.com/api/auth/google/callback
```

---

## 🎯 ÉTAPE 8 : Mettre à jour index.ts

**Fichier** : `backend/index.ts`

**Ajouter** l'initialisation de Passport :

```typescript
import passport from 'passport'
import './src/passport/google.strategy'

app.use(passport.initialize())
```

---

## 🎯 ÉTAPE 9 : Supprimer les fichiers inutiles

```bash
cd agency-platform/backend
rm src/utils/otp.ts
rm src/utils/email.ts
```

---

## 🎯 ÉTAPE 10 : Mettre à jour les validators

**Fichier** : `backend/src/validators/auth.validator.ts`

**Supprimer** :
- `verifyOtpSchema`
- `forgotPasswordSchema`
- `resetPasswordSchema`

**Garder** :
- `loginSchema`
- `registerRequestSchema`
- `changePasswordSchema`

---

## ✅ Vérifications

### Tester l'inscription classique
```bash
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "company": "Test Corp"
}
```

### Tester Google OAuth
1. Allez sur http://localhost:3000/api/auth/google
2. Connectez-vous avec Google
3. Vous devriez être redirigé vers le frontend

### Tester la connexion
```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🚀 Déployer sur Render

1. Committez les changements
2. Pushez vers GitHub
3. Render déploiera automatiquement

**Variables à configurer sur Render** :
```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://agency-platform-backend.onrender.com/api/auth/google/callback
```

---

**Modifications terminées !** 🎉