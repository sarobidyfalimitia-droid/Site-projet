# 🚀 Agency Platform - Guide de Déploiement

## 📋 Vue d'ensemble

Ce guide vous explique comment déployer l'application Agency Platform sur **Vercel + Fly.io + Neon** (100% GRATUIT et ILLIMITÉ).

**Stack technique** :
- **Frontend** : Next.js 14 → Vercel (gratuit, illimité)
- **Backend** : Node.js/Express → Fly.io (3 VMs gratuites)
- **Base de données** : PostgreSQL → Neon (3GB gratuit)
- **Emails OTP** : Gmail SMTP (500 emails/jour gratuits)

**Coût total** : 0€/mois pour toujours 🎉

---

## ⚡ Démarrage Rapide (15 minutes)

### 📁 Fichiers de configuration créés

Tous les fichiers nécessaires sont déjà préparés dans le projet :

```
agency-platform/
├── vercel.json                    # Configuration Vercel
├── backend/
│   ├── fly.toml                   # Configuration Fly.io
│   └── .env.production            # Template variables backend
├── frontend/
│   └── .env.production            # Template variables frontend
├── GUIDE_VISUEL_DEPLOIEMENT.md    # Guide visuel étape par étape
├── QUICK_START_FREE.md            # Guide rapide
└── FREE_DEPLOY.md                 # Guide détaillé
```

---

## 🎯 Étapes de Déploiement

### Étape 1 : Base de Données (Neon) - 2 min

1. Allez sur **https://neon.tech**
2. Créez un compte avec GitHub
3. Créez un projet : `agency-platform`
4. **COPIEZ L'URL DE CONNEXION** (Connection String)

✅ **Vous avez** : `DATABASE_URL = postgres://...`

---

### Étape 2 : Backend (Fly.io) - 5 min

#### 2.1 Installer Fly.io CLI

```powershell
# Windows PowerShell
iwr https://fly.io/install.ps1 -UseBasicParsing | iex
```

#### 2.2 Se connecter et déployer

```bash
# Aller dans le dossier backend
cd agency-platform/backend

# Se connecter
fly auth login

# Initialiser l'application
fly launch --no-deploy

# Configurer les secrets (remplacez les valeurs)
fly secrets set \
  DATABASE_URL="votre-url-neon" \
  JWT_SECRET="$(openssl rand -base64 32)" \
  JWT_REFRESH_SECRET="$(openssl rand -base64 32)" \
  FRONTEND_URL="https://agency-platform-frontend.vercel.app" \
  SMTP_USER="votre-email@gmail.com" \
  SMTP_PASS="votre-mot-de-passe-app-gmail" \
  OPENROUTER_API_KEY="votre-cle-openrouter"

# Déployer
fly deploy
```

✅ **Vous avez** : Backend sur https://agency-platform-backend.fly.dev

---

### Étape 3 : Migrations Base de Données - 1 min

```bash
cd agency-platform/backend
npx prisma migrate deploy
```

✅ **Vous avez** : Base de données avec toutes les tables

---

### Étape 4 : Frontend (Vercel) - 5 min

#### 4.1 Installer Vercel CLI

```bash
npm i -g vercel
```

#### 4.2 Déployer

```bash
# Aller à la racine du projet
cd agency-platform

# Déployer
vercel --prod
```

#### 4.3 Configurer les variables d'environnement

1. Allez sur **https://vercel.com**
2. Ouvrez votre projet `agency-platform`
3. **Settings** → **Environment Variables**
4. Ajoutez ces 3 variables :

```
NEXT_PUBLIC_API_URL = https://agency-platform-backend.fly.dev/api
NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.fly.dev
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
```

5. **Redeploy** : Cliquez sur les 3 points du dernier déploiement → **Redeploy**

✅ **Vous avez** : Frontend sur https://agency-platform-frontend.vercel.app

---

### Étape 5 : Configuration OTP (Gmail) - 2 min

#### 5.1 Activer la 2FA

1. Allez sur **https://myaccount.google.com/security**
2. Activez **"Validation en deux étapes"**

#### 5.2 Générer un mot de passe d'application

1. Allez sur **https://myaccount.google.com/apppasswords**
2. Sélectionnez **"Autre (nom personnalisé)"** → Entrez : `Agency Platform`
3. Cliquez sur **"Générer"**
4. **COPIEZ LE MOT DE PASSE** (16 caractères)

#### 5.3 Mettre à jour les secrets Fly.io

```bash
fly secrets set \
  SMTP_USER="votre-email@gmail.com" \
  SMTP_PASS="mot-de-passe-16-caracteres"
```

✅ **Vous avez** : OTP fonctionnel !

---

## ✅ Vérifications Finales

### Tester le Backend

```bash
curl https://agency-platform-backend.fly.dev/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### Tester le Frontend

1. Ouvrez **https://agency-platform-frontend.vercel.app**
2. Testez l'inscription
3. Vérifiez l'email de confirmation (OTP)

### Vérifier les Logs

```bash
# Backend
fly logs

# Frontend (via dashboard Vercel)
vercel logs
```

---

## 📊 URLs Finales

- **Frontend** : https://agency-platform-frontend.vercel.app
- **Backend** : https://agency-platform-backend.fly.dev
- **API Health** : https://agency-platform-backend.fly.dev/api/health

---

## 🔄 Mises à Jour

### Frontend (automatique)

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel déploiera automatiquement.

### Backend (manuel)

```bash
cd agency-platform/backend
fly deploy
```

### Base de données

```bash
cd agency-platform/backend
npx prisma migrate dev --name nom-migration
```

---

## 🆘 Dépannage

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
3. Testez avec Mailtrap pour debug

---

## 📚 Documentation Complète

- **Guide visuel** : `GUIDE_VISUEL_DEPLOIEMENT.md` (recommandé)
- **Guide rapide** : `QUICK_START_FREE.md`
- **Guide détaillé** : `FREE_DEPLOY.md`
- **Comparaison** : `DEPLOYMENT_OPTIONS.md`

---

## 💰 Coûts

| Service | Coût | Limites |
|---------|------|---------|
| Vercel | 0€/mois | Illimité (100GB/mois) |
| Fly.io | 0€/mois | 3 VMs gratuites |
| Neon | 0€/mois | 3GB PostgreSQL |
| Gmail SMTP | 0€/mois | 500 emails/jour |
| **TOTAL** | **0€/mois** | ✅ Illimité dans le temps |

---

## ✨ Avantages

- ✅ **100% GRATUIT** pour toujours
- ✅ **Illimité** dans le temps
- ✅ **Support OTP** complet
- ✅ **SSL automatique** sur toutes les plateformes
- ✅ **Déploiement automatique** depuis Git
- ✅ **Performance excellente**
- ✅ **Scaling automatique**

---

## 🎓 Ressources

- **Fly.io** : https://fly.io/docs
- **Vercel** : https://vercel.com/docs
- **Neon** : https://neon.tech/docs
- **Gmail SMTP** : https://support.google.com/a/answer/176600

---

## 📞 Support

- **Fly.io Community** : https://community.fly.io
- **Vercel Discord** : https://vercel.com/discord
- **Neon Discord** : https://discord.gg/neon

---

## 🎉 Félicitations !

Votre application est maintenant déployée et accessible gratuitement !

**Temps total** : ~15 minutes  
**Coût** : 0€/mois  
**Support OTP** : ✅ Oui  
**Illimité** : ✅ Oui  

**Bon déploiement !** 🚀

---

**Date de déploiement** : _______________

**Déployé par** : _______________

**URLs** :
- Frontend : https://agency-platform-frontend.vercel.app
- Backend : https://agency-platform-backend.fly.dev

**Notes** :
_________________________________
_________________________________
_________________________________