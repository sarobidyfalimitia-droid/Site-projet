# Guide Visuel de Déploiement - Agency Platform

## 🎯 Objectif
Déployer votre application sur **Vercel + Fly.io + Neon** (100% GRATUIT)

---

## 📋 ÉTAPES À SUIVRE (dans l'ordre)

### ✅ ÉTAPE 1 : Créer la Base de Données (Neon)
**Temps** : 2 minutes  
**Coût** : Gratuit

1. Ouvrez votre navigateur
2. Allez sur : **https://neon.tech**
3. Cliquez sur **"Sign Up"** (en haut à droite)
4. Choisissez **"Sign up with GitHub"**
5. Autorisez Neon à accéder à votre compte GitHub
6. Une fois connecté, cliquez sur **"New Project"**
7. Nom du projet : `agency-platform`
8. Region : Choisissez `Europe (Frankfurt)` ou `Europe (Paris)`
9. Cliquez sur **"Create Project"**
10. **COPIEZ L'URL DE CONNEXION** (elle ressemble à : `postgres://user:password@host/dbname`)
    - Elle est affichée dans un bloc noir en haut de la page
    - Ou allez dans **"Connection Details"** et copiez **"Connection string"**

✅ **Vous avez maintenant** : `DATABASE_URL = postgres://...`

---

### ✅ ÉTAPE 2 : Déployer le Backend (Fly.io)
**Temps** : 5 minutes  
**Coût** : Gratuit

#### 2.1 Installer Fly.io CLI

**Option A - PowerShell (Windows)** :
```powershell
iwr https://fly.io/install.ps1 -UseBasicParsing | iex
```

**Option B - Manuel** :
1. Allez sur https://fly.io/docs/hands-on/install-flyctl/
2. Téléchargez et installez pour Windows

#### 2.2 Se connecter à Fly.io

```bash
fly auth login
```
- Cela ouvrira votre navigateur
- Connectez-vous avec GitHub
- Autorisez Fly.io

#### 2.3 Déployer le Backend

```bash
# Aller dans le dossier backend
cd agency-platform/backend

# Initialiser l'application (NE PAS déployer tout de suite)
fly launch --no-deploy
```

**Répondez aux questions** :
- App name : `agency-platform-backend` (ou laissez par défaut)
- Organization : `personal` (votre compte)
- Region : `fra` (Frankfurt) ou `par` (Paris)
- Postgres : `n` (NON, on utilise Neon)
- Redis : `n` (NON, pas besoin pour l'instant)

#### 2.4 Configurer les Secrets

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
- `votre-url-neon` : L'URL que vous avez copiée depuis Neon
- `votre-email@gmail.com` : Votre email Gmail
- `votre-mot-de-passe-app-gmail` : Mot de passe d'application Gmail (voir Étape 5)
- `votre-cle-openrouter` : Votre clé API OpenRouter (optionnel)

#### 2.5 Déployer

```bash
fly deploy
```

Attendez 2-3 minutes que le déploiement se termine.

✅ **Vous avez maintenant** : Backend accessible sur https://agency-platform-backend.fly.dev

---

### ✅ ÉTAPE 3 : Configurer la Base de Données
**Temps** : 1 minute  
**Coût** : Gratuit

```bash
# Exécuter les migrations Prisma
cd agency-platform/backend
npx prisma migrate deploy
```

Ou via Fly.io :
```bash
fly ssh console
npx prisma migrate deploy
exit
```

✅ **Vous avez maintenant** : Base de données avec toutes les tables créées

---

### ✅ ÉTAPE 4 : Déployer le Frontend (Vercel)
**Temps** : 5 minutes  
**Coût** : Gratuit

#### 4.1 Installer Vercel CLI

```bash
npm i -g vercel
```

#### 4.2 Se connecter à Vercel

```bash
vercel login
```
- Cela ouvrira votre navigateur
- Connectez-vous avec GitHub

#### 4.3 Déployer

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
- Project name? `agency-platform` (ou laissez par défaut)
- In which directory is your code located? `./` (racine)
- Want to override settings? `n`

#### 4.4 Configurer les Variables d'Environnement

1. Allez sur https://vercel.com
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

✅ **Vous avez maintenant** : Frontend accessible sur https://agency-platform-frontend.vercel.app

---

### ✅ ÉTAPE 5 : Configurer Gmail SMTP (pour OTP)
**Temps** : 2 minutes  
**Coût** : Gratuit

#### 5.1 Activer l'authentification à 2 facteurs

1. Allez sur https://myaccount.google.com/security
2. Cliquez sur **"Validation en deux étapes"**
3. Suivez les instructions pour l'activer

#### 5.2 Générer un mot de passe d'application

1. Allez sur https://myaccount.google.com/apppasswords
2. Cliquez sur **"Sélectionner une application"** → **"Autre (nom personnalisé)"**
3. Entrez : `Agency Platform`
4. Cliquez sur **"Générer"**
5. **COPIEZ LE MOT DE PASSE** (16 caractères, sans espaces)
   - Exemple : `abcdefghijklmnop`

#### 5.3 Mettre à jour les secrets Fly.io

```bash
fly secrets set \
  SMTP_USER="votre-email@gmail.com" \
  SMTP_PASS="mot-de-passe-16-caracteres"
```

✅ **Vous avez maintenant** : OTP fonctionnel !

---

### ✅ ÉTAPE 6 : Tester l'Application
**Temps** : 2 minutes  
**Coût** : Gratuit

#### 6.1 Tester le Backend

```bash
# Health check
curl https://agency-platform-backend.fly.dev/api/health

# Vous devriez voir : {"status":"ok","timestamp":"..."}
```

#### 6.2 Tester le Frontend

1. Ouvrez https://agency-platform-frontend.vercel.app dans votre navigateur
2. La page d'accueil devrait se charger
3. Testez l'inscription d'un nouvel utilisateur
4. Vérifiez que vous recevez l'email de confirmation (OTP)

#### 6.3 Vérifier les Logs

```bash
# Logs backend
fly logs

# Logs frontend (via dashboard Vercel)
vercel logs
```

✅ **Application déployée et fonctionnelle !**

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

## 🔄 Mises à Jour Futures

### Frontend (Vercel)

Chaque fois que vous faites un push sur `main` :
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel déploiera automatiquement les changements.

### Backend (Fly.io)

Pour déployer les changements du backend :
```bash
cd agency-platform/backend
fly deploy
```

### Base de Données (Neon)

Pour ajouter des migrations :
```bash
cd agency-platform/backend
npx prisma migrate dev --name nom-de-la-migration
```

---

## 🆘 Dépannage

### Backend ne démarre pas

```bash
# Vérifier les logs
fly logs

# Vérifier le statut
fly status

# Redéployer
fly deploy
```

### Frontend ne peut pas appeler le backend

1. Vérifiez `NEXT_PUBLIC_API_URL` sur Vercel
2. Vérifiez CORS dans `backend/index.ts`
3. Vérifiez que le backend est accessible : https://agency-platform-backend.fly.dev/api/health

### OTP ne fonctionne pas

1. Vérifiez `SMTP_USER` et `SMTP_PASS` sur Fly.io
2. Vérifiez les logs : `fly logs`
3. Testez avec Mailtrap pour debug

### Uploads ne fonctionnent pas

Les uploads sont stockés temporairement. Pour du stockage persistant :
- Utilisez Cloudflare R2 (10GB gratuit)
- Ou Backblaze B2 (10GB gratuit)

---

## 📞 Support

### Documentation

- **Fly.io** : https://fly.io/docs
- **Vercel** : https://vercel.com/docs
- **Neon** : https://neon.tech/docs

### Communauté

- **Fly.io** : https://community.fly.io
- **Vercel** : https://vercel.com/discord
- **Neon** : https://discord.gg/neon

---

## ✨ Félicitations !

Votre application est maintenant déployée et accessible gratuitement !

**Temps total** : ~15 minutes  
**Coût** : 0€/mois  
**Support OTP** : ✅ Oui  
**Illimité** : ✅ Oui  

**Bon déploiement !** 🚀