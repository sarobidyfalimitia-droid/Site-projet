# 🔐 Configuration Google OAuth2 pour Agency Platform

## 📋 Vue d'ensemble

Ce guide explique comment configurer Google OAuth2 pour l'authentification et la réinitialisation de mot de passe.

**Fonctionnalités** :
- ✅ Connexion avec Google
- ✅ Inscription automatique avec Google
- ✅ Réinitialisation de mot de passe via email (sans OTP)
- ✅ Suppression complète de OTP/SMTP

---

## 🎯 ÉTAPE 1 : Créer un Projet Google Cloud

### 1.1 Accéder à Google Cloud Console

1. **Allez sur** : https://console.cloud.google.com
2. **Connectez-vous** avec votre compte Google
3. **Créez un projet** :
   - Cliquez sur la sélection de projet en haut
   - Cliquez sur **"New Project"**
   - Nom : `agency-platform`
   - Cliquez sur **"Create"**

### 1.2 Activer les APIs

1. Dans le menu, allez dans **"APIs & Services"** → **"Library"**
2. **Recherchez et activez** ces APIs :
   - **Google+ API** (pour récupérer les infos utilisateur)
   - **Gmail API** (pour envoyer des emails de réinitialisation)

---

## 🎯 ÉTAPE 2 : Configurer OAuth2

### 2.1 Aller dans Credentials

1. Menu : **"APIs & Services"** → **"Credentials"**
2. Cliquez sur **"Create Credentials"** → **"OAuth client ID"**

### 2.2 Configurer l'écran de consentement

1. Cliquez sur **"Configure Consent Screen"**
2. **User Type** : `External`
3. Cliquez sur **"Create"**

**Remplissez les informations** :
- **App name** : `Agency Platform`
- **User support email** : `sarobidyfalimitia@gmail.com`
- **Developer contact information** : `sarobidyfalimitia@gmail.com`
- Cliquez sur **"Save and Continue"**

**Scopes** :
- Cliquez sur **"Add or Remove Scopes"**
- Ajoutez ces scopes :
  - `../auth/userinfo.email`
  - `../auth/userinfo.profile`
- Cliquez sur **"Save and Continue"**

**Test users** (optionnel) :
- Ajoutez votre email de test
- Cliquez sur **"Save and Continue"**

### 2.3 Créer les identifiants OAuth2

1. Retournez dans **"Credentials"**
2. Cliquez sur **"Create Credentials"** → **"OAuth client ID"**
3. **Application type** : `Web application`
4. **Name** : `Agency Platform Web Client`

**Authorized redirect URIs** :
```
http://localhost:3000/api/auth/google/callback
https://agency-platform-frontend.vercel.app/api/auth/google/callback
```

5. Cliquez sur **"Create"**

### 2.4 Récupérer les identifiants

Après création, vous verrez :
- **Client ID** : `123456789-abc...googleusercontent.com`
- **Client Secret** : `GOCSPX-...`

**COPIEZ CES DEUX VALEURS** !

---

## 🎯 ÉTAPE 3 : Configurer le Backend

### 3.1 Variables d'environnement

Ajoutez ces variables dans Render (ou Fly.io) :

```
GOOGLE_CLIENT_ID=123456789-abc...googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_CALLBACK_URL=https://agency-platform-backend.onrender.com/api/auth/google/callback
```

### 3.2 Installer les dépendances

```bash
cd agency-platform/backend
npm install passport passport-google-oauth20 express-session
npm install -D @types/passport @types/passport-google-oauth20 @types/express-session
```

---

## 🎯 ÉTAPE 4 : Modifications du Code

### 4.1 Backend - Ajouter Google OAuth

**Fichier** : `backend/src/passport/google.strategy.ts` (à créer)

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
          password: null, // Pas de mot de passe pour Google Auth
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

### 4.2 Backend - Routes Google OAuth

**Fichier** : `backend/src/routes/auth.google.routes.ts` (à créer)

```typescript
import passport from 'passport'
import express from 'express'

const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  (req, res) => {
    const user = req.user as any
    const tokens = generateTokens(user.id, user.email, user.role)
    // Rediriger vers le frontend avec les tokens
    res.redirect(`https://agency-platform-frontend.vercel.app/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`)
  }
)

export default router
```

### 4.3 Backend - Réinitialisation mot de passe par email

**Modifier** : `backend/src/controllers/auth.controller.ts`

Supprimer les fonctions OTP :
- `verifyRegister`
- `forgotPassword` (remplacer par email avec lien)
- `resetPassword` (remplacer par token)

**Nouvelle approche** :
1. Utiliser `nodemailer` pour envoyer un lien de réinitialisation
2. Le lien contient un token JWT signé
3. Le token expire après 1 heure

### 4.4 Frontend - Ajouter bouton Google

**Fichier** : `frontend/components/GoogleLoginButton.tsx` (à créer)

```tsx
'use client'
import { signIn } from 'next-auth/react'

export default function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      <span>Se connecter avec Google</span>
    </button>
  )
}
```

---

## 🎯 ÉTAPE 5 : Configuration NextAuth.js

### 5.1 Installer NextAuth

```bash
cd agency-platform/frontend
npm install next-auth
```

### 5.2 Créer la configuration

**Fichier** : `frontend/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = 'client'
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  }
})

export { handler as GET, handler as POST }
```

---

## 🎯 ÉTAPE 6 : Supprimer OTP/SMTP

### 6.1 Fichiers à supprimer

```
backend/src/utils/otp.ts
backend/src/utils/email.ts
backend/src/validators/auth.validator.ts (partie OTP)
backend/src/routes/auth.routes.ts (partie OTP)
```

### 6.2 Modèles Prisma à modifier

**Supprimer** le modèle `AuthOtp` dans `backend/prisma/schema.prisma`

**Modifier** le modèle `Client` :
- Supprimer les champs liés à OTP (si existants)

### 6.3 Variables d'environnement à supprimer

```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
SMTP_DISABLED
```

---

## 🎯 ÉTAPE 7 : Déployer sur Render

### 7.1 Mettre à jour render.yaml

```yaml
services:
  - type: web
    name: agency-platform-backend
    runtime: docker
    plan: free
    region: frankfurt
    branch: main
    rootDir: backend
    dockerfilePath: Dockerfile
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: DATABASE_URL
        fromDatabase:
          name: agency-platform-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: GOOGLE_CLIENT_ID
        sync: false
      - key: GOOGLE_CLIENT_SECRET
        sync: false
      - key: GOOGLE_CALLBACK_URL
        value: https://agency-platform-backend.onrender.com/api/auth/google/callback
```

### 7.2 Déployer

1. Committez les changements
2. Pushez vers GitHub
3. Render déploiera automatiquement

---

## ✅ Vérifications

### Tester Google OAuth

1. Allez sur https://agency-platform-frontend.vercel.app
2. Cliquez sur **"Se connecter avec Google"**
3. Connectez-vous avec votre compte Google
4. Vous devriez être redirigé vers le dashboard

### Tester réinitialisation mot de passe

1. Cliquez sur **"Mot de passe oublié"**
2. Entrez votre email
3. Vérifiez votre boîte mail (Gmail)
4. Cliquez sur le lien de réinitialisation
5. Définissez un nouveau mot de passe

---

## 📞 Support

- **Google OAuth2** : https://developers.google.com/identity/protocols/oauth2
- **NextAuth.js** : https://next-auth.js.org
- **Passport.js** : http://www.passportjs.org

---

**Bon déploiement !** 🚀