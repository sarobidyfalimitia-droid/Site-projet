# Guide de Déploiement 100% GRATUIT et ILLIMITÉ

Stack recommandée :
- **Frontend** : Vercel (gratuit, illimité)
- **Backend** : Fly.io ou Railway (gratuit avec crédits mensuels)
- **Base de données** : Neon (PostgreSQL gratuit) ou Supabase
- **Stockage** : Cloudflare R2 ou Backblaze B2 (gratuit)

## 🎯 Option 1 : Vercel (Frontend) + Fly.io (Backend) + Neon (DB)

### Avantages
- ✅ 100% gratuit pour commencer
- ✅ Illimité dans le temps (pas de limite de temps)
- ✅ Support OTP (SMTP configurable)
- ✅ SSL automatique
- ✅ Déploiement automatique depuis Git

---

## 📦 Étape 1 : Déployer le Backend sur Fly.io

### 1.1 Créer un compte Fly.io

1. Allez sur https://fly.io
2. Créez un compte avec GitHub
3. Installez la CLI Fly.io :
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -UseBasicParsing | iex
   
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   ```

### 1.2 Préparer le Backend

Créez un fichier `fly.toml` dans le dossier `backend/` :

```toml
app = "agency-platform-backend"
primary_region = "fra"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "3001"
  UPLOAD_DIR = "/app/uploads"
  SMTP_HOST = "smtp.gmail.com"
  SMTP_PORT = "587"
  SMTP_FROM = "Techno-logia <noreply@techno-logia.fr>"
  SMTP_DISABLED = "false"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1
```

### 1.3 Configurer les Secrets

```bash
cd backend

# Login Fly.io
fly auth login

# Initialiser l'application
fly launch --no-deploy

# Configurer les variables d'environnement
fly secrets set \
  DATABASE_URL="postgres://postgres:password@host:5432/agency_platform" \
  JWT_SECRET="your-super-secret-jwt-key" \
  JWT_REFRESH_SECRET="your-super-secret-refresh-key" \
  JWT_EXPIRES_IN="15m" \
  JWT_REFRESH_EXPIRES_IN="30d" \
  FRONTEND_URL="https://agency-platform-frontend.vercel.app" \
  SMTP_USER="your-email@gmail.com" \
  SMTP_PASS="your-app-password" \
  OPENROUTER_API_KEY="your-openrouter-key"
```

### 1.4 Déployer le Backend

```bash
fly deploy
```

Votre backend sera accessible sur : `https://agency-platform-backend.fly.dev`

---

## 📦 Étape 2 : Configurer la Base de Données sur Neon

### 2.1 Créer un compte Neon

1. Allez sur https://neon.tech
2. Créez un compte avec GitHub
3. Créez un nouveau projet : `agency-platform`

### 2.2 Obtenir l'URL de connexion

1. Dans le dashboard Neon, allez dans **"Connection Details"**
2. Copiez l'URL de connexion (format : `postgres://user:pass@host/db`)
3. Mettez à jour le secret Fly.io :
   ```bash
   fly secrets set DATABASE_URL="votre-url-neon"
   ```

### 2.3 Exécuter les Migrations

```bash
# Option 1 : Localement
cd backend
npx prisma migrate deploy

# Option 2 : Via Fly.io
fly ssh console
npx prisma migrate deploy
```

---

## 📦 Étape 3 : Déployer le Frontend sur Vercel

### 3.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Créez un compte avec GitHub

### 3.2 Configurer le Frontend

Créez un fichier `vercel.json` à la racine du projet (déjà créé) :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://agency-platform-backend.fly.dev/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### 3.3 Variables d'Environnement sur Vercel

Dans le dashboard Vercel :
1. Importez le projet
2. Allez dans **Settings** → **Environment Variables**
3. Ajoutez :
   ```
   NEXT_PUBLIC_API_URL = https://agency-platform-backend.fly.dev/api
   NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.fly.dev
   NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
   ```

### 3.4 Déployer

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd agency-platform
vercel --prod
```

Ou utilisez l'interface web Vercel pour importer le repository GitHub.

---

## 🎯 Option 2 : Vercel (Frontend) + Railway (Backend) + Neon (DB)

Railway offre un crédit gratuit de $5/mois (renouvelable).

### 2.1 Déployer le Backend sur Railway

1. Allez sur https://railway.app
2. Créez un compte avec GitHub
3. Cliquez sur **"New Project"** → **"Deploy from GitHub repo"**
4. Sélectionnez votre repository
5. Choisissez le dossier `backend`
6. Railway détectera automatiquement le Dockerfile

### 2.2 Configurer les Variables

Dans Railway :
1. Allez dans **Variables**
2. Ajoutez toutes les variables d'environnement du backend
3. Pour `DATABASE_URL`, utilisez l'URL Neon

### 2.3 Ajouter un Volume pour les Uploads

1. Allez dans **Volumes**
2. Créez un volume de 1GB
3. Montez-le sur `/app/uploads`

---

## 🔐 Configuration OTP (Email)

### Option A : Gmail SMTP (Gratuit)

1. Activez l'authentification à 2 facteurs sur votre compte Google
2. Générez un mot de passe d'application :
   - https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et votre appareil
3. Utilisez ce mot de passe dans `SMTP_PASS`

### Option B : SendGrid (Gratuit - 100 emails/jour)

1. Créez un compte sur https://sendgrid.com
2. Créez une clé API
3. Configurez :
   ```
   SMTP_HOST = smtp.sendgrid.net
   SMTP_PORT = 587
   SMTP_USER = apikey
   SMTP_PASS = votre-clé-api-sendgrid
   ```

### Option C : Mailgun (Gratuit - 100 emails/jour)

1. Créez un compte sur https://www.mailgun.com
2. Configurez :
   ```
   SMTP_HOST = smtp.mailgun.org
   SMTP_PORT = 587
   SMTP_USER = votre-domaine
   SMTP_PASS = votre-clé-api
   ```

---

## 📊 Comparaison des Plateformes

| Plateforme | Frontend | Backend | Base de Données | Coût | Limites |
|------------|----------|---------|-----------------|------|---------|
| **Vercel** | ✅ | ❌ | ❌ | Gratuit | Illimité |
| **Fly.io** | ❌ | ✅ | ❌ | Gratuit (3 VMs) | 3 apps, 256MB RAM chacune |
| **Railway** | ❌ | ✅ | ✅ | $5 crédit/mois | ~500h/mois |
| **Neon** | ❌ | ❌ | ✅ | Gratuit | 3GB stockage |
| **Supabase** | ❌ | ❌ | ✅ | Gratuit | 500MB stockage |
| **Render** | ❌ | ✅ | ✅ | $7/mois | 750h/mois |

---

## 🚀 Déploiement Automatique

### Frontend (Vercel)

1. Connectez votre repository GitHub à Vercel
2. Configurez le projet pour utiliser le dossier `frontend/`
3. Ajoutez les variables d'environnement
4. Chaque push sur `main` déclenche un déploiement automatique

### Backend (Fly.io)

```bash
# Activer les déploiements automatiques
fly machine update --auto-start true --auto-stop true

# Ou utilisez GitHub Actions (voir ci-dessous)
```

### Backend (Railway)

Railway déploie automatiquement à chaque push sur GitHub.

---

## 🔄 CI/CD avec GitHub Actions (Optionnel)

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions@1.3
        with:
          command: deploy
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

---

## ✅ Vérifications Post-Déploiement

### Tests à Effectuer

- [ ] Frontend accessible : https://agency-platform-frontend.vercel.app
- [ ] Backend accessible : https://agency-platform-backend.fly.dev
- [ ] API Health check : https://agency-platform-backend.fly.dev/api/health
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] OTP/Email fonctionne
- [ ] Upload de fichiers fonctionne
- [ ] Base de données accessible

### Vérifier les Logs

**Fly.io** :
```bash
fly logs
```

**Vercel** :
- Dashboard → Votre projet → Logs

**Neon** :
- Dashboard → Query Editor pour exécuter des requêtes SQL

---

## 🆘 Dépannage

### Backend ne démarre pas

1. Vérifiez les logs : `fly logs`
2. Vérifiez que `DATABASE_URL` est correct
3. Vérifiez que le port est 3001

### Frontend ne peut pas appeler le backend

1. Vérifiez `NEXT_PUBLIC_API_URL` sur Vercel
2. Vérifiez CORS sur le backend
3. Vérifiez que le backend est accessible

### OTP ne fonctionne pas

1. Vérifiez `SMTP_USER` et `SMTP_PASS`
2. Vérifiez les logs backend pour les erreurs SMTP
3. Testez avec un service comme Mailtrap pour debug

### Uploads ne fonctionnent pas

1. Vérifiez que le volume est monté sur `/app/uploads`
2. Vérifiez les permissions
3. Consultez les logs

---

## 💰 Coûts Totaux

### Stack 100% Gratuite

- **Vercel** : $0/mois (illimité)
- **Fly.io** : $0/mois (3 VPs gratuites)
- **Neon** : $0/mois (3GB PostgreSQL)
- **Total** : **$0/mois** 🎉

### Si vous dépassez les limites

- **Fly.io** : ~$5/mois pour plus de ressources
- **Neon** : ~$19/mois pour plus de stockage
- **Vercel** : $20/mois pour Pro (si nécessaire)

---

## 📝 Recommandations

### Pour Commencer (Gratuit)

1. Utilisez **Vercel** pour le frontend
2. Utilisez **Fly.io** pour le backend
3. Utilisez **Neon** pour la base de données
4. Utilisez **Gmail SMTP** pour les emails (gratuit)

### Pour Passer à l'Échelle

1. Migrez vers **Railway** si vous avez besoin de plus de ressources
2. Utilisez **Supabase** si vous avez besoin de plus que PostgreSQL
3. Utilisez **Cloudflare R2** pour le stockage fichiers (10GB gratuit)

---

## 🎓 Ressources

- **Vercel Docs** : https://vercel.com/docs
- **Fly.io Docs** : https://fly.io/docs
- **Neon Docs** : https://neon.tech/docs
- **Railway Docs** : https://docs.railway.app

---

## ✨ Avantages de cette Stack

- ✅ **100% gratuit** pour commencer
- ✅ **Illimité dans le temps** (pas de date d'expiration)
- ✅ **Support OTP** complet (SMTP configurable)
- ✅ **SSL automatique** sur toutes les plateformes
- ✅ **Déploiement automatique** depuis Git
- ✅ **Scaling automatique** selon la charge
- ✅ **Monitoring et logs** inclus
- ✅ **Communauté active** et documentation complète

**Cette stack est utilisée par des milliers de startups et projets open-source à travers le monde !**