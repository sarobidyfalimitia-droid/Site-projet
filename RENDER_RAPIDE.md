# ⚡ Configuration Rapide Render

## 🎯 Copiez-Coller ces Valeurs

### Formulaire Render

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

## 📝 Variables d'Environnement

Copiez ces variables dans Render :

```env
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

**⚠️ Remplacez** :
- `DATABASE_URL` → Votre URL Neon
- `JWT_REFRESH_SECRET` → Générez une clé
- `GOOGLE_CLIENT_ID` → Votre Client ID Google
- `GOOGLE_CLIENT_SECRET` → Votre Client Secret Google

---

## ✅ Après le Déploiement

### 1. Migrations
```bash
npx prisma migrate deploy
```

### 2. Test
```bash
curl https://agency-platform-backend.onrender.com/api/health
```

---

## 🎉 C'est Tout !

**Temps** : ~10 minutes  
**Coût** : 0€/mois

---

**Guide complet** : `GUIDE_FINAL_DEPLOIEMENT.md`