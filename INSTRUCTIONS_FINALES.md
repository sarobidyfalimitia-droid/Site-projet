# 📋 INSTRUCTIONS FINALES - Déploiement Agency Platform

## ✅ Ce qui est déjà fait (côté code)

- [x] Configuration Vercel créée (`vercel.json`)
- [x] Configuration Fly.io créée (`backend/fly.toml`)
- [x] Fichiers `.env.production` créés (backend et frontend)
- [x] Dépendances installées (backend et frontend)
- [x] Builds testés avec succès
- [x] Documentation complète créée

**Le projet est prêt à être déployé !**

---

## 🎯 Ce que VOUS devez faire (étapes externes)

Vous devez maintenant créer les comptes et déployer sur les plateformes externes.

---

## 📝 ÉTAPE 1 : Créer un compte Neon (Base de données)

**Temps** : 2 minutes  
**Coût** : Gratuit

### Actions à faire :

1. **Ouvrez votre navigateur** et allez sur : https://neon.tech
2. **Cliquez sur "Sign Up"** (en haut à droite)
3. **Choisissez "Sign up with GitHub"**
4. **Autorisez Neon** à accéder à votre compte GitHub
5. **Créez un nouveau projet** :
   - Nom : `agency-platform`
   - Region : `Europe (Frankfurt)` ou `Europe (Paris)`
   - Cliquez sur **"Create Project"**
6. **COPIEZ L'URL DE CONNEXION** :
   - Elle est affichée dans un bloc noir en haut de la page
   - Format : `postgres://user:password@host/dbname`
   - **GARDEZ-LA PRÉCIEUSEMENT**

✅ **Résultat** : Vous avez maintenant `DATABASE_URL = postgres://...`

---

## 📝 ÉTAPE 2 : Créer un compte Fly.io (Backend)

**Temps** : 5 minutes  
**Coût** : Gratuit

### 2.1 Installer Fly.io CLI

**Sur Windows (PowerShell)** :
```powershell
iwr https://fly.io/install.ps1 -UseBasicParsing | iex
```

**Sur Mac/Linux** :
```bash
curl -L https://fly.io/install.sh | sh
```

### 2.2 Se connecter à Fly.io

```bash
fly auth login
```

- Cela ouvrira votre navigateur
- Connectez-vous avec GitHub
- Autorisez Fly.io

### 2.3 Déployer le Backend

```bash
# Aller dans le dossier backend
cd agency-platform/backend

# Initialiser l'application
fly launch --no-deploy
```

**Répondez aux questions** :
- App name : `agency-platform-backend` (ou laissez par défaut)
- Organization : `personal`
- Region : `fra` (Frankfurt) ou `par` (Paris)
- Postgres : `n` (NON, on utilise Neon)
- Redis : `n` (NON, pas besoin)

### 2.4 Configurer les Secrets

**IMPORTANT** : Remplacez les valeurs par les vôtres !

```bash
fly secrets set \
  DATABASE_URL="votre-url-neon" \
  JWT_SECRET="$(openssl rand -base64 32)" \
  JWT_REFRESH_SECRET="$(openssl rand -base64 32)" \
  FRONTEND_URL="https://agency-platform-frontend.vercel.app" \
  SMTP_USER="votre-email@gmail.com" \
  SMTP_PASS="votre-mot-de-passe-app-gmail" \
  OPENROUTER_API_KEY="votre-cle-openrouter"
```

**Remplacez** :
- `votre-url-neon` : L'URL que vous avez copiée depuis Neon (Étape 1)
- `votre-email@gmail.com` : Votre email Gmail
- `votre-mot-de-passe-app-gmail` : Mot de passe d'application Gmail (voir Étape 5)
- `votre-cle-openrouter` : Votre clé API OpenRouter (optionnel)

**Pour générer JWT_SECRET et JWT_REFRESH_SECRET** :
- **Windows** : Utilisez un générateur en ligne comme https://www.random.org/strings/
- **Mac/Linux** : `openssl rand -base64 32`

### 2.5 Déployer

```bash
fly deploy
```

Attendez 2-3 minutes que le déploiement se termine.

✅ **Résultat** : Backend accessible sur https://agency-platform-backend.fly.dev

---

## 📝 ÉTAPE 3 : Exécuter les Migrations

**Temps** : 1 minute  
**Coût** : Gratuit

```bash
cd agency-platform/backend
npx prisma migrate deploy
```

✅ **Résultat** : Base de données avec toutes les tables créées

---

## 📝 ÉTAPE 4 : Créer un compte Vercel (Frontend)

**Temps** : 5 minutes  
**Coût** : Gratuit

### 4.1 Installer Vercel CLI

```bash
npm i -g vercel
```

### 4.2 Se connecter à Vercel

```bash
vercel login
```

- Cela ouvrira votre navigateur
- Connectez-vous avec GitHub

### 4.3 Déployer le Frontend

```bash
# Aller à la racine du projet
cd agency-platform

# Déployer
vercel --prod
```

**Répondez aux questions** :
- Set up and deploy? `y`
- Which scope? Votre compte
- Link to existing project? `n`
- Project name? `agency-platform`
- In which directory is your code located? `./`
- Want to override settings? `n`

### 4.4 Configurer les Variables d'Environnement

1. Allez sur **https://vercel.com**
2. Connectez-vous
3. Cliquez sur votre projet `agency-platform`
4. Allez dans **Settings** → **Environment Variables**
5. Ajoutez ces 3 variables :

```
NEXT_PUBLIC_API_URL = https://agency-platform-backend.fly.dev/api
NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.fly.dev
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
```

6. Cliquez sur **Save**
7. Allez dans l'onglet **Deployments**
8. Cliquez sur les 3 points du dernier déploiement → **Redeploy**

✅ **Résultat** : Frontend accessible sur https://agency-platform-frontend.vercel.app

---

## 📝 ÉTAPE 5 : Configurer Gmail SMTP (pour OTP)

**Temps** : 2 minutes  
**Coût** : Gratuit

### 5.1 Activer l'authentification à 2 facteurs

1. Allez sur **https://myaccount.google.com/security**
2. Cliquez sur **"Validation en deux étapes"**
3. Suivez les instructions pour l'activer

### 5.2 Générer un mot de passe d'application

1. Allez sur **https://myaccount.google.com/apppasswords**
2. Cliquez sur **"Sélectionner une application"** → **"Autre (nom personnalisé)"**
3. Entrez : `Agency Platform`
4. Cliquez sur **"Générer"**
5. **COPIEZ LE MOT DE PASSE** (16 caractères, sans espaces)
   - Exemple : `abcdefghijklmnop`

### 5.3 Mettre à jour les secrets Fly.io

```bash
fly secrets set \
  SMTP_USER="votre-email@gmail.com" \
  SMTP_PASS="mot-de-passe-16-caracteres"
```

✅ **Résultat** : OTP fonctionnel !

---

## ✅ VÉRIFICATIONS FINALES

### Tester le Backend

```bash
curl https://agency-platform-backend.fly.dev/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

### Tester le Frontend

1. Ouvrez **https://agency-platform-frontend.vercel.app**
2. La page d'accueil devrait se charger
3. Testez l'inscription d'un nouvel utilisateur
4. Vérifiez que vous recevez l'email de confirmation (OTP)

### Vérifier les Logs

```bash
# Logs backend
fly logs

# Logs frontend (via dashboard Vercel)
vercel logs
```

---

## 🎉 RÉCAPITULATIF

### URLs Finales

- **Frontend** : https://agency-platform-frontend.vercel.app
- **Backend** : https://agency-platform-backend.fly.dev
- **API Health** : https://agency-platform-backend.fly.dev/api/health

### Comptes Créés

- ✅ **Neon** : https://neon.tech (Base de données PostgreSQL)
- ✅ **Fly.io** : https://fly.io (Backend)
- ✅ **Vercel** : https://vercel.com (Frontend)
- ✅ **Gmail** : https://gmail.com (SMTP pour OTP)

### Coût Total

**0€/mois** 🎉

---

## 🔄 MISES À JOUR FUTURES

### Frontend (automatique)

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel déploiera automatiquement les changements.

### Backend (manuel)

```bash
cd agency-platform/backend
fly deploy
```

### Base de données

```bash
cd agency-platform/backend
npx prisma migrate dev --name nom-de-la-migration
```

---

## 🆘 DÉPANNAGE

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

## 📚 DOCUMENTATION DISPONIBLE

- **GUIDE_VISUEL_DEPLOIEMENT.md** - Guide visuel étape par étape (RECOMMANDÉ)
- **QUICK_START_FREE.md** - Guide rapide
- **FREE_DEPLOY.md** - Guide détaillé
- **README_DEPLOY.md** - Vue d'ensemble
- **DEPLOYMENT_OPTIONS.md** - Comparaison des options

---

## ✨ FÉLICITATIONS !

Votre application est maintenant prête à être déployée !

**Temps total estimé** : ~15 minutes  
**Coût** : 0€/mois  
**Support OTP** : ✅ Oui  
**Illimité** : ✅ Oui  

**Bon déploiement !** 🚀

---

**Date de début** : _______________

**Notes** :
_________________________________
_________________________________
_________________________________