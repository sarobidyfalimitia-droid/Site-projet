# 🚀 Guide de Déploiement Complet - PAS À PAS

## 📸 VOTRE SITUATION ACTUELLE

D'après les captures d'écran :
- ✅ **Neon** : Projet `agency-platform` créé, vous avez l'URL de connexion
- ✅ **Fly.io** : Vous êtes sur la page de sélection du repository
- ⚠️ **À faire** : Installer les outils et configurer le déploiement

---

## 🎯 ÉTAPE 1 : Installer les Outils Nécessaires

### 1.1 Installer Fly.io CLI

**Ouvrez PowerShell en tant qu'administrateur** et exécutez :

```powershell
iwr https://fly.io/install.ps1 -UseBasicParsing | iex
```

Attendez la fin de l'installation (quelques secondes).

Vérifiez l'installation :
```powershell
fly --version
```

Vous devriez voir : `flyctl v0.0.XXX`

---

### 1.2 Installer Vercel CLI

Dans le même PowerShell :
```bash
npm i -g vercel
```

Vérifiez l'installation :
```bash
vercel --version
```

---

### 1.3 Installer Neon CLI (déjà fait)

Vous avez déjà `neon` d'installé, c'est parfait !

---

## 🎯 ÉTAPE 2 : Récupérer l'URL Neon

### Depuis votre capture d'écran Neon

Je vois que vous avez l'URL de connexion affichée. Elle ressemble à :

```
postgresql://neondb_owner:password@ep-dry-bird-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Action : COPIEZ CETTE URL

1. Dans la fenêtre Neon, **cliquez sur "Copier l'extrait"** (bouton en bas)
2. Ou **sélectionnez toute l'URL** et copiez-la (Ctrl+C)

### Collez l'URL dans les fichiers :

**Fichier 1** : `agency-platform/.env`
```env
DATABASE_URL=postgresql://neondb_owner:VOTRE_PASSWORD@ep-dry-bird-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Fichier 2** : `agency-platform/backend/.env.production`
```env
DATABASE_URL=postgresql://neondb_owner:VOTRE_PASSWORD@ep-dry-bird-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Remplacez** par votre URL complète copiée depuis Neon !

---

## 🎯 ÉTAPE 3 : Configurer Fly.io

### 3.1 Se connecter à Fly.io

Dans PowerShell :
```powershell
fly auth login
```

- Cela ouvrira votre navigateur
- Connectez-vous avec GitHub
- Autorisez Fly.io

### 3.2 Sélectionner le bon repository

Sur la page Fly.io que vous avez ouverte :

1. **Repository** : Sélectionnez `sarobidyfalimitia-droid/Site-projet`
2. **Nom de l'application** : `agency-platform-backend`
3. **Organisation** : `Personnel`
4. **Région** : Choisissez `fra` (Frankfurt) ou `par` (Paris)
5. **Cliquez sur "Ouvrir les options avancées"**

### 3.3 Configurer les options avancées

Dans "Options avancées" :
- **Dockerfile** : Sélectionnez `backend/Dockerfile`
- **Répertoire de travail** : `backend`
- **Port interne** : `3001`

### 3.4 Déployer

Cliquez sur **"Déployer"**

Attendez 2-3 minutes que le déploiement se termine.

---

## 🎯 ÉTAPE 4 : Configurer les Secrets Fly.io

Une fois le déploiement terminé, configurez les secrets :

```powershell
fly secrets set `
  DATABASE_URL="votre-url-neon-complete" `
  JWT_SECRET="$(openssl rand -base64 32)" `
  JWT_REFRESH_SECRET="$(openssl rand -base64 32)" `
  FRONTEND_URL="https://agency-platform-frontend.vercel.app" `
  SMTP_USER="sarobidyfalimitia@gmail.com" `
  SMTP_PASS="votre-mot-de-passe-app-gmail" `
  OPENROUTER_API_KEY="votre-cle-openrouter"
```

**Remplacez** :
- `votre-url-neon-complete` : L'URL que vous avez copiée depuis Neon
- `votre-mot-de-passe-app-gmail` : Mot de passe d'application Gmail (voir Étape 5)
- `votre-cle-openrouter` : Votre clé API OpenRouter (optionnel)

**Pour Windows** : Si `openssl` ne fonctionne pas, utilisez un générateur en ligne :
- https://www.random.org/strings/
- Générez 2 chaînes de 32 caractères

---

## 🎯 ÉTAPE 5 : Configurer Gmail SMTP (pour OTP)

### 5.1 Activer la 2FA

1. Allez sur https://myaccount.google.com/security
2. Activez **"Validation en deux étapes"**

### 5.2 Générer un mot de passe d'application

1. Allez sur https://myaccount.google.com/apppasswords
2. **Sélectionnez** : "Autre (nom personnalisé)" → `Agency Platform`
3. **Cliquez sur "Générer"**
4. **COPIEZ LE MOT DE PASSE** (16 caractères)

### 5.3 Mettre à jour les secrets Fly.io

```powershell
fly secrets set `
  SMTP_USER="sarobidyfalimitia@gmail.com" `
  SMTP_PASS="mot-de-passe-16-caracteres"
```

---

## 🎯 ÉTAPE 6 : Migrations Base de Données

```powershell
cd agency-platform/backend
npx prisma migrate deploy
```

---

## 🎯 ÉTAPE 7 : Déployer le Frontend (Vercel)

### 7.1 Se connecter à Vercel

```bash
vercel login
```

- Cela ouvrira votre navigateur
- Connectez-vous avec GitHub

### 7.2 Déployer

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

### 7.3 Configurer les variables d'environnement

1. Allez sur https://vercel.com
2. Ouvrez votre projet `agency-platform`
3. **Settings** → **Environment Variables**
4. Ajoutez ces 3 variables :

```
NEXT_PUBLIC_API_URL = https://agency-platform-backend.fly.dev/api
NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.fly.dev
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
```

5. **Redeploy** : Deployments → 3 points → Redeploy

---

## ✅ VÉRIFICATIONS FINALES

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

## 🎉 RÉCAPITULATIF

### URLs Finales

- **Frontend** : https://agency-platform-frontend.vercel.app
- **Backend** : https://agency-platform-backend.fly.dev
- **API Health** : https://agency-platform-backend.fly.dev/api/health

### Comptes Créés

- ✅ **Neon** : https://neon.tech (Base de données)
- ✅ **Fly.io** : https://fly.io (Backend)
- ✅ **Vercel** : https://vercel.com (Frontend)
- ✅ **Gmail** : https://gmail.com (SMTP pour OTP)

### Coût Total

**0€/mois** 🎉

---

## 🆘 Dépannage

### Fly.io ne trouve pas le repository

Vérifiez que :
1. Le repository `sarobidyfalimitia-droid/Site-projet` existe sur GitHub
2. Vous avez les droits d'accès
3. Le repository contient bien le dossier `backend/`

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

## 📞 Support

- **Fly.io** : https://community.fly.io
- **Vercel** : https://vercel.com/discord
- **Neon** : https://discord.gg/neon

---

**Bon déploiement !** 🚀