# Guide de Déploiement - Agency Platform

## 📋 Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 14
- Docker & Docker Compose (pour déploiement conteneurisé)
- Git

## 🚀 Déploiement Local

### 1. Cloner le projet

```bash
git clone <repository-url>
cd agency-platform
```

### 2. Configuration Backend

```bash
cd backend
cp .env.example .env
# Éditer .env avec vos credentials
npm install
npx prisma db push
npm run dev
```

### 3. Configuration Frontend

```bash
cd frontend
cp .env.example .env.local
# Éditer .env.local
npm install
npm run dev
```

## 🐳 Déploiement Docker

### Développement

```bash
docker-compose up -d
```

### Production

```bash
# Copier et configurer les variables d'environnement
cp .env.prod .env
# Éditer .env avec vos credentials de production

# Lancer les conteneurs
docker-compose -f docker-compose.prod.yml up -d
```

## 🐧 Déploiement WSL Ubuntu

Utiliser le script d'installation automatique:

```bash
chmod +x wsl-setup.sh
./wsl-setup.sh
```

Ou installation manuelle:

```bash
# Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql

# Configurer la base de données
sudo -u postgres psql -c "CREATE DATABASE agency_platform;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'votre_mot_de_passe';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE agency_platform TO postgres;"

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

## 🔧 Configuration SMTP

Pour l'envoi d'emails (OTP, notifications):

### Option 1: Gmail SMTP

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password
SMTP_FROM="Techno-logia <noreply@techno-logia.fr>"
SMTP_DISABLED=false
```

**Note:** Utiliser un "App Password" Google, pas le mot de passe du compte.

### Option 2: SendGrid

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.votre_clé_api
SMTP_FROM="Techno-logia <noreply@techno-logia.fr>"
SMTP_DISABLED=false
```

### Option 3: MailHog (Développement)

```
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Techno-logia <noreply@techno-logia.fr>"
SMTP_DISABLED=false
```

## 🔒 Sécurité Production

1. **Changer les secrets par défaut**
   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - POSTGRES_PASSWORD

2. **Activer HTTPS**
   - Configurer SSL/TLS avec Let's Encrypt
   - Mettre à jour nginx.conf avec les certificats

3. **Variables d'environnement**
   - Ne jamais commiter .env
   - Utiliser des secrets Docker ou gestionnaire de secrets

4. **Rate Limiting**
   - Configuré par défaut (20 requêtes / 15 minutes)
   - Ajuster selon vos besoins

## 📊 Monitoring

### Health Checks

```bash
# Backend
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:3000
```

### Logs Docker

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔄 CI/CD avec Jenkins

Le Jenkinsfile est configuré pour:
- Build backend et frontend
- Créer les images Docker
- Push sur Docker Hub
- Déployer sur VPS

**Credentials Jenkins requis:**
- docker-hub-credentials
- postgres-password
- jwt-secret
- jwt-refresh-secret
- vps-host
- vps-user
- vps-deploy-path
- vps-ssh-credentials

## 🌐 Normes Internationales

Ce projet respecte les standards:

- **OWASP Top 10**: Sécurité web
- **GDPR**: Protection des données personnelles
- **REST API**: Architecture RESTful
- **Docker**: Conteneurisation standard
- **TypeScript**: Typage strict
- **ESLint + Prettier**: Code quality

## 📞 Support

Pour les problèmes de déploiement:
1. Vérifier les logs: `docker-compose logs`
2. Vérifier les variables d'environnement
3. Tester la connexion PostgreSQL
4. Vérifier les ports disponibles (3000, 3001, 5432)
