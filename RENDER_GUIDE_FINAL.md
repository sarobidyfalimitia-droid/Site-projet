# 🎯 GUIDE FINAL RENDER - Agency Platform

## ✅ Projet Prêt à 100%

Toutes les modifications sont terminées. Voici exactement ce qu'il faut faire.

---

## 📋 CE QU'IL FAUT REMPLIR SUR RENDER

### Formulaire de création du Web Service

| Champ | Valeur à mettre |
|-------|----------------|
| **Name** | `agency-platform-backend` |
| **Region** | Oregon (US West) |
| **Root Directory** | `backend` |
| **Build Command** | `yarn build` |
| **Start Command** | `yarn start` |
| **Runtime** | Docker |
| **Dockerfile Path** | `Dockerfile` |
| **Plan** | Free |

---

## 📝 VARIABLES D'ENVIRONNEMENT À AJOUTER

### 🔴 Obligatoires (copiez ces 4 variables)

```
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:VOTRE_PASSWORD@ep-dry-bird-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=czR4eG1iYjd2cmJxaHpuNW9jenY3Y3Z4M3psZGl4YW8
SESSION_SECRET=generez-une-cle-secrete-pour-sessions
```

### 🟡 Google OAuth2 (si vous voulez la connexion Google)

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://agency-platform-backend.onrender.com/api/auth/google/callback
```

### 🟡 Autres variables utiles

```
JWT_REFRESH_SECRET=generez-une-autre-cle-secrete
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://agency-platform-frontend.vercel.app
UPLOAD_DIR=/app/uploads
```

---

## ⚠️ CE QU'IL FAUT REMPLACER

1. **DATABASE_URL** → Votre URL Neon (depuis https://neon.tech)
   - Allez sur Neon → Votre projet → Copiez l'URL de connexion

2. **JWT_SECRET** → Générez une clé sécurisée
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **SESSION_SECRET** → Générez une autre clé
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **JWT_REFRESH_SECRET** → Générez une autre clé

5. **GOOGLE_CLIENT_ID** → Votre Client ID Google (depuis https://console.cloud.google.com)

6. **GOOGLE_CLIENT_SECRET** → Votre Client Secret Google

---

## 🚀 ÉTAPES DE DÉPLOIEMENT

### 1. Créer le service Render (10 min)

1. Allez sur https://render.com
2. Sign up avec GitHub
3. New + → Web Service
4. Connectez `sarobidyfalimitia-droid/Site-projet`
5. Remplissez le formulaire avec les valeurs ci-dessus
6. Ajoutez les variables d'environnement
7. Cliquez sur "Create Web Service"
8. Attendez 3-5 minutes

### 2. Exécuter les migrations (2 min)

Dans Render → Votre service → Shell :

```bash
npx prisma migrate deploy
```

### 3. Tester le backend

```bash
curl https://agency-platform-backend.onrender.com/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

---

## 🎯 URLs Finales

- **Backend** : https://agency-platform-backend.onrender.com
- **API Health** : https://agency-platform-backend.onrender.com/api/health
- **Frontend** : https://agency-platform-frontend.vercel.app (après déploiement Vercel)

---

## 💰 Coût

**0€/mois** 🎉
- Aucune carte de crédit requise
- 100% gratuit pour toujours

---

## ⏱️ Temps Total

~15 minutes (backend seulement)

---

## 📚 Guides Disponibles

- `COMMENCER_ICI_RENDER.md` - Point de départ
- `RENDER_RAPPORT_FINAL.md` - Rapport détaillé
- `GOOGLE_AUTH_SETUP.md` - Configuration Google OAuth2
- `GUIDE_RENDER_COMPLET.md` - Guide complet

---

## 🆘 En Cas de Problème

1. Vérifiez les logs Render
2. Vérifiez que DATABASE_URL est correct
3. Vérifiez que toutes les variables sont ajoutées
4. Vérifiez que les migrations sont exécutées

---

**Bon déploiement !** 🚀

**Date** : 24/07/2026  
**Statut** : ✅ Projet 100% prêt  
**Coût** : 0€/mois