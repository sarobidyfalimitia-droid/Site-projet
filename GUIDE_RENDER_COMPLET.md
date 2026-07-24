# 🚀 Guide Complet - Déploiement sur Render

## ✅ Votre projet est prêt !

Toutes les modifications ont été effectuées. Voici ce que vous devez faire :

---

## 📋 ÉTAPE 1 : Configurer Google OAuth2 (5 min)

### 1.1 Créer un projet Google Cloud

1. **Allez sur** : https://console.cloud.google.com
2. **Créez un projet** : `agency-platform`
3. **Activez les APIs** :
   - Google+ API
   - Gmail API (pour réinitialisation mot de passe)

### 1.2 Créer les identifiants OAuth2

1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth client ID**
3. **Configure Consent Screen** :
   - User Type : `External`
   - App name : `Agency Platform`
   - User support email : `sarobidyfalimitia@gmail.com`
   - Scopes : `../auth/userinfo.email`, `../auth/userinfo.profile`

4. **Create OAuth client ID** :
   - Application type : `Web application`
   - Name : `Agency Platform Web Client`
   - Authorized redirect URIs :
     ```
     http://localhost:3000/api/auth/google/callback
     https://agency-platform-frontend.vercel.app/api/auth/google/callback
     ```

5. **COPIEZ** :
   - Client ID : `123456789-abc...googleusercontent.com`
   - Client Secret : `GOCSPX-...`

---

## 📋 ÉTAPE 2 : Déployer le Backend sur Render (10 min)

### 2.1 Créer un compte Render

1. **Allez sur** : https://render.com
2. **Sign up with GitHub**
3. **Aucune carte de crédit requise**

### 2.2 Créer le Web Service

1. **New +** → **Web Service**
2. **Connectez** : `sarobidyfalimitia-droid/Site-projet`

### 2.3 Remplissez le formulaire

| Champ | Valeur |
|-------|--------|
| **Name** | `agency-platform-backend` |
| **Region** | Oregon (US West) |
| **Root Directory** | `backend` |
| **Build Command** | `yarn build` |
| **Start Command** | `yarn start` |
| **Runtime** | Docker |
| **Dockerfile Path** | `Dockerfile` |
| **Plan** | Free |

### 2.4 Ajoutez les variables d'environnement

Cliquez sur "Create Web Service", puis ajoutez ces variables :

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://neondb_owner:VOTRE_PASSWORD@ep-dry-bird-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=czR4eG1iYjd2cmJxaHpuNW9jenY3Y3Z4M3psZGl4YW8
JWT_REFRESH_SECRET=generez-une-autre-cle-secrete
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://agency-platform-frontend.vercel.app
UPLOAD_DIR=/app/uploads
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://agency-platform-backend.onrender.com/api/auth/google/callback
```

**⚠️ Remplacez** :
- `DATABASE_URL` → Votre URL Neon
- `JWT_REFRESH_SECRET` → Générez une clé
- `GOOGLE_CLIENT_ID` → Votre Client ID Google
- `GOOGLE_CLIENT_SECRET` → Votre Client Secret Google

### 2.5 Déployer

1. **Cliquez sur "Create Web Service"**
2. **Attendez 3-5 minutes**
3. **Vérifiez les logs**

✅ **Backend** : https://agency-platform-backend.onrender.com

---

## 📋 ÉTAPE 3 : Migrations (2 min)

Dans Render → Votre service → Shell :

```bash
npx prisma migrate deploy
```

---

## 📋 ÉTAPE 4 : Déployer le Frontend sur Vercel (5 min)

### 4.1 Installer Vercel CLI

```bash
npm i -g vercel
```

### 4.2 Déployer

```bash
cd agency-platform
vercel --prod
```

Répondez aux questions :
- Set up and deploy? `y`
- Which scope? Votre compte
- Link to existing project? `n`
- Project name? `agency-platform`
- In which directory? `./`
- Want to override settings? `n`

### 4.3 Configurer les variables Vercel

1. Allez sur https://vercel.com
2. Ouvrez votre projet `agency-platform`
3. **Settings** → **Environment Variables**
4. Ajoutez :

```
NEXT_PUBLIC_API_URL = https://agency-platform-backend.onrender.com/api
NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.onrender.com
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID = votre-client-id-google
```

5. **Redeploy** : Deployments → 3 points → Redeploy

✅ **Frontend** : https://agency-platform-frontend.vercel.app

---

## 📋 ÉTAPE 5 : Configurer le Frontend pour Google OAuth (5 min)

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
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
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

### 5.3 Créer le bouton Google

**Fichier** : `frontend/components/GoogleLoginButton.tsx`

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

## ✅ Vérifications Finales

### Tester le Backend

```bash
curl https://agency-platform-backend.onrender.com/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### Tester Google OAuth

1. Allez sur https://agency-platform-frontend.vercel.app
2. Cliquez sur **"Se connecter avec Google"**
3. Connectez-vous avec Google
4. Vous devriez être redirigé vers le dashboard

---

## 🎉 URLs Finales

- **Frontend** : https://agency-platform-frontend.vercel.app
- **Backend** : https://agency-platform-backend.onrender.com
- **API Health** : https://agency-platform-backend.onrender.com/api/health

---

## 💰 Coût Total

**0€/mois** 🎉

- Vercel : 0€/mois (illimité)
- Render : 0€/mois (750h/mois)
- Neon : 0€/mois (3GB PostgreSQL)
- Google OAuth : 0€/mois

**Aucune carte de crédit requise !**

---

## ⏱️ Temps Total Estimé

- **Étape 1 (Google OAuth)** : 5 minutes
- **Étape 2 (Render)** : 10 minutes
- **Étape 3 (Migrations)** : 2 minutes
- **Étape 4 (Vercel)** : 5 minutes
- **Étape 5 (Frontend)** : 5 minutes

**Total** : ~27 minutes

---

## 🆘 Dépannage

### Backend ne démarre pas
1. Vérifiez les logs Render
2. Vérifiez que `DATABASE_URL` est correct
3. Vérifiez que les variables Google OAuth sont présentes

### Google OAuth ne fonctionne pas
1. Vérifiez `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
2. Vérifiez les URIs autorisés dans Google Cloud Console
3. Vérifiez les logs backend

### Frontend ne peut pas appeler le backend
1. Vérifiez `NEXT_PUBLIC_API_URL` sur Vercel
2. Vérifiez CORS dans `backend/index.ts`

---

## 📞 Support

- **Render** : https://community.render.com
- **Vercel** : https://vercel.com/discord
- **Google OAuth** : https://developers.google.com/identity/protocols/oauth2

---

**Bon déploiement !** 🚀