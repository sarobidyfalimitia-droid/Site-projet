# 🚀 Déploiement avec Railway (100% GRATUIT)

## ⚠️ Problème avec Fly.io

Fly.io demande maintenant un mode de paiement pour déployer, même pour le plan gratuit.

**Solution** : Utilisez **Railway** à la place (100% gratuit avec $5 crédit/mois)

---

## 🎯 Stack Alternative (Toujours 100% GRATUITE)

| Service | Rôle | Coût | Limites |
|---------|------|------|---------|
| **Vercel** | Frontend Next.js | 0€/mois | Illimité |
| **Railway** | Backend Node.js | 0€/mois | $5 crédit/mois |
| **Neon** | PostgreSQL | 0€/mois | 3GB stockage |
| **Gmail SMTP** | Emails OTP | 0€/mois | 500 emails/jour |

**Coût total** : 0€/mois 🎉

---

## 📋 ÉTAPE 1 : Créer un compte Railway

1. **Allez sur** : https://railway.app
2. **Cliquez sur "Login"** (en haut à droite)
3. **Choisissez "Login with GitHub"**
4. **Autorisez Railway** à accéder à votre compte GitHub

---

## 📋 ÉTAPE 2 : Déployer le Backend sur Railway

### 2.1 Créer un nouveau projet

1. Dans le dashboard Railway, **cliquez sur "New Project"**
2. **Choisissez "Deploy from GitHub repo"**
3. **Sélectionnez** : `sarobidyfalimitia-droid/Site-projet`
4. **Cliquez sur "Connect"**

### 2.2 Configurer le déploiement

1. **Sélectionnez le dossier** : `backend`
2. Railway détectera automatiquement le Dockerfile
3. **Attendez le déploiement** (2-3 minutes)

### 2.3 Configurer les variables d'environnement

Dans Railway, allez dans votre projet backend :

1. **Cliquez sur "Variables"**
2. **Ajoutez ces variables** :

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://neondb_owner:VOTRE_PASSWORD@ep-dry-bird-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=czR4eG1iYjd2cmJxaHpuNW9jenY3Y3Z4M3psZGl4YW8
JWT_REFRESH_SECRET=generez-une-autre-cle-secrete
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://agency-platform-frontend.vercel.app
UPLOAD_DIR=/app/uploads
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sarobidyfalimitia@gmail.com
SMTP_PASS=votre-mot-de-passe-app-gmail
SMTP_FROM=Techno-logia <noreply@techno-logia.fr>
SMTP_DISABLED=false
OPENROUTER_API_KEY=votre-cle-openrouter
```

**Remplacez** :
- `DATABASE_URL` : Votre URL Neon complète
- `JWT_REFRESH_SECRET` : Générez une autre clé secrète
- `SMTP_PASS` : Mot de passe d'application Gmail
- `OPENROUTER_API_KEY` : Votre clé API OpenRouter (optionnel)

### 2.4 Ajouter un volume pour les uploads (optionnel)

1. **Cliquez sur "Volumes"**
2. **Créez un volume** de 1GB
3. **Montez-le** sur `/app/uploads`

---

## 📋 ÉTAPE 3 : Migrations Base de Données

### Option A : Via Railway CLI

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Lier le projet
railway link

# Exécuter les migrations
railway run npx prisma migrate deploy
```

### Option B : Via le dashboard Railway

1. Dans votre projet backend, **cliquez sur "Deployments"**
2. **Cliquez sur les 3 points** du dernier déploiement
3. **Choisissez "Shell"**
4. Exécutez : `npx prisma migrate deploy`

---

## 📋 ÉTAPE 4 : Déployer le Frontend sur Vercel

### 4.1 Installer Vercel CLI

```bash
npm i -g vercel
```

### 4.2 Se connecter

```bash
vercel login
```

### 4.3 Déployer

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

### 4.4 Configurer les variables d'environnement

1. Allez sur https://vercel.com
2. Ouvrez votre projet `agency-platform`
3. **Settings** → **Environment Variables**
4. Ajoutez ces 3 variables :

```
NEXT_PUBLIC_API_URL = https://votre-app-backend.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL = https://votre-app-backend.up.railway.app
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
```

**Remplacez** `votre-app-backend.up.railway.app` par l'URL de votre backend Railway

5. **Redeploy** : Deployments → 3 points → Redeploy

---

## 📋 ÉTAPE 5 : Configurer Gmail SMTP (pour OTP)

### 5.1 Activer la 2FA

1. Allez sur https://myaccount.google.com/security
2. Activez **"Validation en deux étapes"**

### 5.2 Générer un mot de passe d'application

1. Allez sur https://myaccount.google.com/apppasswords
2. **Sélectionnez** : "Autre (nom personnalisé)" → `Agency Platform`
3. **Cliquez sur "Générer"**
4. **COPIEZ LE MOT DE PASSE** (16 caractères)

### 5.3 Mettre à jour les variables Railway

Dans Railway, mettez à jour :
```
SMTP_USER=sarobidyfalimitia@gmail.com
SMTP_PASS=mot-de-passe-16-caracteres
```

---

## ✅ VÉRIFICATIONS FINALES

### Tester le Backend

```bash
curl https://votre-app-backend.up.railway.app/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### Tester le Frontend

1. Ouvrez https://agency-platform-frontend.vercel.app
2. Testez l'inscription
3. Vérifiez l'email de confirmation (OTP)

---

## 🎉 URLs Finales Attendues

- **Frontend** : https://agency-platform-frontend.vercel.app
- **Backend** : https://votre-app-backend.up.railway.app
- **API Health** : https://votre-app-backend.up.railway.app/api/health

---

## 💰 Coût Total

**0€/mois** 🎉

- Vercel : 0€/mois (illimité)
- Railway : 0€/mois ($5 crédit/mois)
- Neon : 0€/mois (3GB PostgreSQL)
- Gmail SMTP : 0€/mois (500 emails/jour)

---

## 🆘 Dépannage

### Railway ne déploie pas

1. Vérifiez les logs dans Railway
2. Vérifiez que le Dockerfile est dans le dossier `backend/`
3. Vérifiez les variables d'environnement

### Backend ne démarre pas

1. Vérifiez les logs Railway
2. Vérifiez que `DATABASE_URL` est correct
3. Vérifiez que le port est 3001

### Frontend ne peut pas appeler le backend

1. Vérifiez `NEXT_PUBLIC_API_URL` sur Vercel
2. Vérifiez CORS dans `backend/index.ts`
3. Testez l'URL du backend directement

---

## 📞 Support

- **Railway** : https://docs.railway.app
- **Railway Discord** : https://discord.gg/railway
- **Vercel** : https://vercel.com/discord
- **Neon** : https://discord.gg/neon

---

**Bon déploiement avec Railway !** 🚀