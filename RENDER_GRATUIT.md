# 🚀 Déploiement 100% GRATUIT avec Render (Sans Carte de Crédit)

## ✅ Pourquoi Render ?

- ✅ **Plan gratuit** disponible (pas de carte de crédit requise)
- ✅ **750 heures/mois** gratuites (suffisant pour un petit projet)
- ✅ **Base de données PostgreSQL** incluse (90 jours gratuits)
- ✅ **SSL automatique**
- ✅ **Déploiement automatique** depuis Git

**Note** : La base de données PostgreSQL est gratuite pendant 90 jours, puis $7/mois. Mais vous pouvez utiliser Neon (gratuit) à la place.

---

## 🎯 Stack 100% GRATUITE

| Service | Rôle | Coût | Carte Requise |
|---------|------|------|---------------|
| **Vercel** | Frontend Next.js | 0€/mois | ❌ Non |
| **Render** | Backend Node.js | 0€/mois | ❌ Non |
| **Neon** | PostgreSQL | 0€/mois | ❌ Non |
| **Gmail SMTP** | Emails OTP | 0€/mois | ❌ Non |

**Coût total** : 0€/mois 🎉  
**Carte de crédit** : Aucune requise !

---

## 📋 ÉTAPE 1 : Créer un compte Render

1. **Allez sur** : https://render.com
2. **Cliquez sur "Get Started"** (en haut à droite)
3. **Choisissez "Sign up with GitHub"**
4. **Autorisez Render** à accéder à votre compte GitHub
5. **Connectez-vous**

**Aucune carte de crédit requise !**

---

## 📋 ÉTAPE 2 : Créer la Base de Données (Neon)

Avant de déployer le backend, assurez-vous d'avoir votre URL Neon :

1. **Allez sur** : https://neon.tech
2. **Créez un compte** avec GitHub
3. **Créez un projet** : `agency-platform`
4. **COPIEZ L'URL DE CONNEXION** (depuis le bloc noir en haut)

**Format** : `postgresql://user:password@host/dbname`

---

## 📋 ÉTAPE 3 : Déployer le Backend sur Render

### 3.1 Créer un nouveau Web Service

1. Dans le dashboard Render, **cliquez sur "New +"** (en haut à droite)
2. **Choisissez "Web Service"**
3. **Connectez votre repository** :
   - Sélectionnez `sarobidyfalimitia-droid/Site-projet`
   - Cliquez sur **"Connect"**

### 3.2 Configurer le service

**Remplissez les informations** :

- **Name** : `agency-platform-backend`
- **Region** : `Frankfurt` (ou `Paris` si disponible)
- **Branch** : `main`
- **Root Directory** : `backend`
- **Runtime** : `Docker`
- **Dockerfile Path** : `Dockerfile`

### 3.3 Plan

- **Sélectionnez** : `Free` (plan gratuit)
- **Instance Type** : `Free`

### 3.4 Variables d'environnement

**Ajoutez ces variables** :

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

### 3.5 Déployer

1. **Cliquez sur "Create Web Service"**
2. **Attendez le déploiement** (3-5 minutes)
3. **Vérifiez les logs** pour vous assurer qu'il n'y a pas d'erreurs

✅ **Résultat** : Backend sur https://agency-platform-backend.onrender.com

---

## 📋 ÉTAPE 4 : Migrations Base de Données

### Option A : Via le Shell Render

1. Dans votre service backend, **cliquez sur "Shell"** (en haut)
2. **Exécutez** :
```bash
npx prisma migrate deploy
```

### Option B : En local (si vous avez la DATABASE_URL)

```bash
cd agency-platform/backend
npx prisma migrate deploy
```

✅ **Résultat** : Base de données avec toutes les tables créées

---

## 📋 ÉTAPE 5 : Déployer le Frontend sur Vercel

### 5.1 Installer Vercel CLI

```bash
npm i -g vercel
```

### 5.2 Se connecter

```bash
vercel login
```

### 5.3 Déployer

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

### 5.4 Configurer les variables d'environnement

1. Allez sur https://vercel.com
2. Ouvrez votre projet `agency-platform`
3. **Settings** → **Environment Variables**
4. Ajoutez ces 3 variables :

```
NEXT_PUBLIC_API_URL = https://agency-platform-backend.onrender.com/api
NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.onrender.com
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
```

5. **Redeploy** : Deployments → 3 points → Redeploy

✅ **Résultat** : Frontend sur https://agency-platform-frontend.vercel.app

---

## 📋 ÉTAPE 6 : Configurer Gmail SMTP (pour OTP)

### 6.1 Activer la 2FA

1. Allez sur https://myaccount.google.com/security
2. Activez **"Validation en deux étapes"**

### 6.2 Générer un mot de passe d'application

1. Allez sur https://myaccount.google.com/apppasswords
2. **Sélectionnez** : "Autre (nom personnalisé)" → `Agency Platform`
3. **Cliquez sur "Générer"**
4. **COPIEZ LE MOT DE PASSE** (16 caractères)

### 6.3 Mettre à jour les variables Render

Dans Render, mettez à jour :
```
SMTP_USER=sarobidyfalimitia@gmail.com
SMTP_PASS=mot-de-passe-16-caracteres
```

---

## ✅ VÉRIFICATIONS FINALES

### Tester le Backend

```bash
curl https://agency-platform-backend.onrender.com/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### Tester le Frontend

1. Ouvrez https://agency-platform-frontend.vercel.app
2. Testez l'inscription
3. Vérifiez l'email de confirmation (OTP)

---

## 🎉 URLs Finales Attendues

- **Frontend** : https://agency-platform-frontend.vercel.app
- **Backend** : https://agency-platform-backend.onrender.com
- **API Health** : https://agency-platform-backend.onrender.com/api/health

---

## 💰 Coût Total

**0€/mois** 🎉

- Vercel : 0€/mois (illimité)
- Render : 0€/mois (750h/mois)
- Neon : 0€/mois (3GB PostgreSQL)
- Gmail SMTP : 0€/mois (500 emails/jour)

**Aucune carte de crédit requise !**

---

## ⚠️ Limitations du Plan Gratuit Render

- **750 heures/mois** de temps d'exécution
- **Mise en veille** après 15 minutes d'inactivité
- **Base de données PostgreSQL** : 90 jours gratuits, puis $7/mois
  - **Solution** : Utilisez Neon (gratuit) pour la base de données

---

## 🆘 Dépannage

### Backend ne démarre pas

1. Vérifiez les logs dans Render
2. Vérifiez que `DATABASE_URL` est correct
3. Vérifiez que le port est 3001

### Frontend ne peut pas appeler le backend

1. Vérifiez `NEXT_PUBLIC_API_URL` sur Vercel
2. Vérifiez CORS dans `backend/index.ts`
3. Testez : https://agency-platform-backend.onrender.com/api/health

### OTP ne fonctionne pas

1. Vérifiez `SMTP_USER` et `SMTP_PASS` sur Render
2. Vérifiez les logs : Render → Logs

---

## 📞 Support

- **Render** : https://render.com/docs
- **Render Community** : https://community.render.com
- **Vercel** : https://vercel.com/discord
- **Neon** : https://discord.gg/neon

---

**Bon déploiement avec Render !** 🚀

**Rappel** : Aucune carte de crédit requise !