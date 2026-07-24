# 🚀 COMMENCEZ ICI - Déploiement Agency Platform

## ⚡ Guide Ultra-Rapide

Votre projet est prêt ! Suivez ces 5 étapes simples :

---

## 📋 ÉTAPE 1 : Obtenir l'URL Neon (2 min)

### Action : Allez sur https://neon.tech

1. **Cliquez sur "Sign Up"** → Choisissez "Sign up with GitHub"
2. **Autorisez Neon** à accéder à votre compte
3. **Cliquez sur "New Project"**
4. **Nom** : `agency-platform`
5. **Region** : `Europe (Frankfurt)`
6. **Cliquez sur "Create Project"**

### 📋 COPIEZ L'URL

- **Regardez en haut de la page** après la création
- Vous voyez un **bloc noir** avec l'URL
- **Cliquez sur [Copy]**

**Format** : `postgresql://user:password@host/dbname`

**Exemple** :
```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

### ✅ Collez l'URL dans ces fichiers :

**Fichier 1** : `agency-platform/.env`
```env
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

**Fichier 2** : `agency-platform/backend/.env.production`
```env
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

**Remplacez** l'exemple par VOTRE URL copiée !

---

## 📋 ÉTAPE 2 : Déployer le Backend (5 min)

### Ouvrez PowerShell et exécutez :

```powershell
# 1. Installer Fly.io
iwr https://fly.io/install.ps1 -UseBasicParsing | iex

# 2. Se connecter
fly auth login

# 3. Aller dans le dossier backend
cd agency-platform/backend

# 4. Initialiser l'application
fly launch --no-deploy

# 5. Configurer les secrets (remplacez les valeurs)
fly secrets set `
  DATABASE_URL="votre-url-neon" `
  JWT_SECRET="$(openssl rand -base64 32)" `
  JWT_REFRESH_SECRET="$(openssl rand -base64 32)" `
  FRONTEND_URL="https://agency-platform-frontend.vercel.app" `
  SMTP_USER="votre-email@gmail.com" `
  SMTP_PASS="votre-mot-de-passe-app-gmail" `
  OPENROUTER_API_KEY="votre-cle-openrouter"

# 6. Déployer
fly deploy
```

✅ **Résultat** : Backend sur https://agency-platform-backend.fly.dev

---

## 📋 ÉTAPE 3 : Migrations (1 min)

```bash
cd agency-platform/backend
npx prisma migrate deploy
```

✅ **Résultat** : Base de données créée

---

## 📋 ÉTAPE 4 : Déployer le Frontend (5 min)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
cd agency-platform
vercel --prod
```

### Configurer les variables sur https://vercel.com :

1. Ouvrez votre projet `agency-platform`
2. **Settings** → **Environment Variables**
3. Ajoutez ces 3 variables :

```
NEXT_PUBLIC_API_URL = https://agency-platform-backend.fly.dev/api
NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.fly.dev
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
```

4. **Redeploy** : Deployments → 3 points → Redeploy

✅ **Résultat** : Frontend sur https://agency-platform-frontend.vercel.app

---

## 📋 ÉTAPE 5 : Configurer Gmail SMTP (2 min)

### 5.1 Activer la 2FA
1. Allez sur https://myaccount.google.com/security
2. Activez **"Validation en deux étapes"**

### 5.2 Générer un mot de passe d'application
1. Allez sur https://myaccount.google.com/apppasswords
2. **Sélectionnez** : "Autre (nom personnalisé)" → `Agency Platform`
3. **Cliquez sur "Générer"**
4. **COPIEZ LE MOT DE PASSE** (16 caractères)

### 5.3 Mettre à jour les secrets Fly.io

```bash
fly secrets set `
  SMTP_USER="votre-email@gmail.com" `
  SMTP_PASS="mot-de-passe-16-caracteres"
```

✅ **Résultat** : OTP fonctionnel !

---

## 🎉 VÉRIFICATIONS FINALES

### Tester le Backend
```bash
curl https://agency-platform-backend.fly.dev/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### Tester le Frontend
1. Ouvrez https://agency-platform-frontend.vercel.app
2. Testez l'inscription
3. Vérifiez l'email de confirmation (OTP)

---

## 🎯 URLs Finales

- **Frontend** : https://agency-platform-frontend.vercel.app
- **Backend** : https://agency-platform-backend.fly.dev
- **API Health** : https://agency-platform-backend.fly.dev/api/health

---

## 💰 Coût Total

**0€/mois** 🎉

- Vercel : 0€/mois (illimité)
- Fly.io : 0€/mois (3 VMs gratuites)
- Neon : 0€/mois (3GB PostgreSQL)
- Gmail SMTP : 0€/mois (500 emails/jour)

---

## 📚 Documentation Disponible

| Fichier | Description |
|---------|-------------|
| **`COMMENCER_ICI.md`** | ✅ **VOUS ÊTES ICI** - Guide rapide |
| **`INSTRUCTIONS_FINALES.md`** | Guide détaillé complet |
| **`GUIDE_VISUEL_DEPLOIEMENT.md`** | Guide visuel pas à pas |
| **`QUICK_START_FREE.md`** | Guide rapide alternatif |
| **`FREE_DEPLOY.md`** | Guide technique complet |
| **`OBTENIR_URL_NEON.md`** | Comment obtenir l'URL Neon |
| **`NEON_MANUAL_SETUP.md`** | Configuration manuelle Neon |

---

## ⏱️ Temps Total

- **Étape 1 (Neon)** : 2 minutes
- **Étape 2 (Fly.io)** : 5 minutes
- **Étape 3 (Migrations)** : 1 minute
- **Étape 4 (Vercel)** : 5 minutes
- **Étape 5 (Gmail)** : 2 minutes

**Total** : ~15 minutes

---

## ✨ Points Importants

- ✅ **100% GRATUIT** pour toujours
- ✅ **Illimité** dans le temps
- ✅ **Support OTP** complet
- ✅ **SSL automatique** sur toutes les plateformes
- ✅ **Déploiement automatique** depuis Git

---

## 🆘 En Cas de Problème

### Backend ne démarre pas
```bash
fly logs
fly status
fly deploy
```

### Frontend ne peut pas appeler le backend
1. Vérifiez `NEXT_PUBLIC_API_URL` sur Vercel
2. Vérifiez CORS dans `backend/index.ts`
3. Testez : https://agency-platform-backend.fly.dev/api/health

### OTP ne fonctionne pas
1. Vérifiez `SMTP_USER` et `SMTP_PASS` sur Fly.io
2. Vérifiez les logs : `fly logs`

---

## 🚀 Prochaine Action

**COMMENCEZ PAR L'ÉTAPE 1 :** Allez sur https://neon.tech et créez votre projet !

---

## 📞 Support

- **Fly.io** : https://community.fly.io
- **Vercel** : https://vercel.com/discord
- **Neon** : https://discord.gg/neon

---

**Bon déploiement !** 🚀

---

**Date** : 24/07/2026  
**Statut** : ✅ Projet prêt  
**Temps estimé** : ~15 minutes  
**Coût** : 0€/mois