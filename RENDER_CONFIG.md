# ⚙️ Configuration Render - Agency Platform Backend

## 📋 Valeurs à Remplir dans le Formulaire Render

D'après votre capture d'écran, voici ce qu'il faut mettre :

---

### 1. **Region** 
✅ **Oregon (US West)** - C'est bon, laissez comme ça

---

### 2. **Root Directory** (Optionnel)
```
backend
```

**Important** : Mettez `backend` car c'est le dossier qui contient le Dockerfile et le code du backend.

---

### 3. **Build Command**
```
npm install && npx prisma generate
```

**Explication** :
- `npm install` : Installe les dépendances
- `npx prisma generate` : Génère le client Prisma

---

### 4. **Start Command**
```
npm start
```

**Explication** : Lance le serveur avec la commande définie dans `backend/package.json`

---

## ✅ Configuration Complète

| Champ | Valeur |
|-------|--------|
| **Name** | `agency-platform-backend` |
| **Region** | Oregon (US West) |
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npx prisma generate` |
| **Start Command** | `npm start` |
| **Runtime** | Docker |
| **Dockerfile Path** | `Dockerfile` |
| **Plan** | Free |

---

## 📝 Variables d'Environnement à Ajouter

Après avoir cliqué sur "Create Web Service", ajoutez ces variables :

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
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://agency-platform-backend.onrender.com/api/auth/google/callback
```

**Remplacez** :
- `DATABASE_URL` : Votre URL Neon
- `JWT_REFRESH_SECRET` : Générez une clé secrète
- `GOOGLE_CLIENT_ID` : Votre Client ID Google
- `GOOGLE_CLIENT_SECRET` : Votre Client Secret Google

---

## 🚀 Étapes Suivantes

1. **Remplissez le formulaire** avec les valeurs ci-dessus
2. **Cliquez sur "Create Web Service"**
3. **Attendez 3-5 minutes** pour le déploiement
4. **Vérifiez les logs** pour vous assurer qu'il n'y a pas d'erreurs
5. **Exécutez les migrations** :
   - Allez dans votre service → Shell
   - Exécutez : `npx prisma migrate deploy`

---

## ✅ Vérification

Une fois déployé, testez :
```bash
curl https://agency-platform-backend.onrender.com/api/health
```

Vous devriez voir : `{"status":"ok","timestamp":"..."}`

---

**Bon déploiement !** 🚀