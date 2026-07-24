# Démarrage Rapide - Déploiement 100% GRATUIT

Guide express pour déployer votre application en 15 minutes sans dépenser un centime.

## 🎯 Stack 100% Gratuite

- **Frontend** → Vercel (illimité)
- **Backend** → Fly.io (3 VMs gratuites)
- **Base de données** → Neon (3GB PostgreSQL gratuit)
- **Emails OTP** → Gmail SMTP (gratuit)

**Coût total : 0€/mois** 🎉

---

## ⚡ Déploiement en 5 Étapes

### Étape 1 : Base de Données (2 min)

1. Allez sur https://neon.tech
2. Créez un compte avec GitHub
3. Créez un projet : `agency-platform`
4. Copiez l'URL de connexion (Connection String)

**Format attendu** : `postgres://user:password@host/dbname`

---

### Étape 2 : Backend sur Fly.io (5 min)

#### 2.1 Installer Fly.io CLI

```bash
# Windows PowerShell
iwr https://fly.io/install.ps1 -UseBasicParsing | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

#### 2.2 Déployer

```bash
# Aller dans le dossier backend
cd agency-platform/backend

# Login
fly auth login

# Initialiser (répondez aux questions)
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

✅ **Backend déployé** : https://agency-platform-backend.fly.dev

---

### Étape 3 : Migrations Base de Données (1 min)

```bash
# Exécuter les migrations
cd agency-platform/backend
npx prisma migrate deploy

# Ou via Fly.io
fly ssh console
npx prisma migrate deploy
```

---

### Étape 4 : Frontend sur Vercel (5 min)

#### 4.1 Installer Vercel CLI

```bash
npm i -g vercel
```

#### 4.2 Déployer

```bash
# Aller à la racine du projet
cd agency-platform

# Déployer (suivez les instructions)
vercel --prod
```

#### 4.3 Configurer les Variables d'Environnement

Dans le dashboard Vercel :
1. Allez dans votre projet
2. **Settings** → **Environment Variables**
3. Ajoutez ces variables :

```
NEXT_PUBLIC_API_URL = https://agency-platform-backend.fly.dev/api
NEXT_PUBLIC_SOCKET_URL = https://agency-platform-backend.fly.dev
NEXT_PUBLIC_SITE_URL = https://agency-platform-frontend.vercel.app
```

4. Redéployez : `vercel --prod`

✅ **Frontend déployé** : https://agency-platform-frontend.vercel.app

---

### Étape 5 : Configuration OTP (2 min)

#### Option A : Gmail (Recommandé)

1. Activez la 2FA sur votre compte Google
2. Générez un mot de passe d'application :
   - https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" → "Autre (nom personnalisé)"
   - Copiez le mot de passe (16 caractères)
3. Mettez à jour les secrets Fly.io :

```bash
fly secrets set \
  SMTP_USER="votre-email@gmail.com" \
  SMTP_PASS="mot-de-passe-16-caracteres"
```

#### Option B : SendGrid (100 emails/jour gratuits)

1. Créez un compte sur https://sendgrid.com
2. Créez une clé API
3. Mettez à jour les secrets :

```bash
fly secrets set \
  SMTP_HOST="smtp.sendgrid.net" \
  SMTP_PORT="587" \
  SMTP_USER="apikey" \
  SMTP_PASS="votre-cle-api-sendgrid"
```

---

## ✅ Vérifications Finales

### Tests à Effectuer

```bash
# 1. Tester le backend
curl https://agency-platform-backend.fly.dev/api/health

# 2. Tester le frontend
# Ouvrez https://agency-platform-frontend.vercel.app dans votre navigateur

# 3. Tester l'inscription
# Créez un compte sur le frontend

# 4. Tester l'OTP
# Vérifiez que vous recevez l'email de confirmation
```

### Vérifier les Logs

```bash
# Logs backend
fly logs

# Logs frontend (via dashboard Vercel)
vercel logs
```

---

## 🔧 Dépannage Express

### Backend ne démarre pas

```bash
# Vérifier les logs
fly logs

# Vérifier la configuration
fly status

# Redéployer
fly deploy
```

### Frontend ne peut pas appeler le backend

1. Vérifiez `NEXT_PUBLIC_API_URL` sur Vercel
2. Vérifiez CORS dans le backend
3. Vérifiez que le backend est accessible

### OTP ne fonctionne pas

1. Vérifiez `SMTP_USER` et `SMTP_PASS`
2. Vérifiez les logs : `fly logs`
3. Testez avec Mailtrap pour debug

### Uploads ne fonctionnent pas

Les uploads sont stockés temporairement. Pour un stockage persistant gratuit, utilisez Cloudflare R2 ou Backblaze B2.

---

## 📊 Monitoring

### Fly.io

```bash
# Voir les logs en temps réel
fly logs

# Voir le statut
fly status

# Redémarrer l'app
fly machine restart
```

### Vercel

- Dashboard → Projet → Analytics
- Dashboard → Projet → Logs

### Neon

- Dashboard → Query Editor
- Dashboard → Monitoring

---

## 🚀 Mises à Jour Automatiques

### Frontend (Vercel)

Chaque push sur `main` déclenche un déploiement automatique.

### Backend (Fly.io)

Activez les déploiements automatiques :

```bash
# Créer un GitHub Action (voir FREE_DEPLOY.md)
# Ou déployez manuellement :
fly deploy
```

---

## 💰 Limites Gratuites

### Fly.io
- ✅ 3 VMs gratuites
- ✅ 256MB RAM par VM
- ✅ 160GB sortie/mois
- ⚠️ Mise en veille après 5 min d'inactivité

### Vercel
- ✅ Bande passante illimitée
- ✅ Déploiements illimités
- ✅ SSL automatique
- ⚠️ 100GB bande passante/mois (suffisant pour débuter)

### Neon
- ✅ 3GB stockage PostgreSQL
- ✅ 100 requêtes/seconde
- ✅ Backup automatique
- ⚠️ Mise en veille après 5 min d'inactivité

---

## 🎓 Prochaines Étapes

### 1. Ajouter un Domaine Personnalisé (Optionnel)

**Vercel** :
```bash
vercel domains add votredomaine.com
```

**Fly.io** :
```bash
fly certs add votredomaine.com
```

### 2. Configurer le Stockage Fichiers (Optionnel)

Utilisez Cloudflare R2 (10GB gratuit) :
1. Créez un compte sur https://www.cloudflare.com
2. Créez un bucket R2
3. Configurez le backend pour utiliser R2

### 3. Ajouter un CDN (Optionnel)

Vercel inclut un CDN automatique. Pour le backend, utilisez Cloudflare.

### 4. Monitoring Avancé (Optionnel)

- **Sentry** pour les erreurs (gratuit pour 5k errors/mois)
- **UptimeRobot** pour monitoring uptime (gratuit pour 50 monitors)

---

## 📞 Support

### Documentation

- **Fly.io** : https://fly.io/docs
- **Vercel** : https://vercel.com/docs
- **Neon** : https://neon.tech/docs

### Communauté

- **Fly.io Community** : https://community.fly.io
- **Vercel Discord** : https://vercel.com/discord
- **Neon Discord** : https://discord.gg/neon

---

## 🎉 Félicitations !

Votre application est maintenant déployée et accessible gratuitement !

**URLs** :
- Frontend : https://agency-platform-frontend.vercel.app
- Backend : https://agency-platform-backend.fly.dev
- API Health : https://agency-platform-backend.fly.dev/api/health

**Prochaines étapes** :
1. Testez toutes les fonctionnalités
2. Configurez un domaine personnalisé (optionnel)
3. Partagez avec vos utilisateurs !
4. Monitorz les performances

---

## 💡 Astuces

### Optimiser les Coûts (si nécessaire)

Si vous dépassez les limites gratuites :
- **Fly.io** : ~$5/mois pour plus de ressources
- **Neon** : ~$19/mois pour plus de stockage
- **Vercel** : $20/mois pour Pro

### Sécurité

- ✅ Changez les JWT_SECRET générés
- ✅ Utilisez des mots de passe forts
- ✅ Activez la 2FA sur tous les comptes
- ✅ Limitez les accès aux secrets

### Performance

- ✅ Activez la compression gzip/brotli
- ✅ Utilisez un CDN (inclus dans Vercel)
- ✅ Optimisez les images (Next.js Image Optimization)
- ✅ Cachez les requêtes fréquentes

---

**Temps total de déploiement** : ~15 minutes  
**Coût** : 0€/mois  
**Support OTP** : ✅ Oui  
**Illimité** : ✅ Oui  

**Bon déploiement !** 🚀