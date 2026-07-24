# Exemple d'URL Neon et Où la Trouver

## ❌ Ce que je NE PEUX PAS faire

Je ne peux pas vous donner VOTRE URL de connexion car :
- Elle contient vos identifiants uniques (user, password)
- Elle est générée spécifiquement pour VOTRE compte
- Elle n'existe pas tant que vous n'avez pas créé le projet

## ✅ Ce que je PEUX vous donner

### Exemple d'URL (format uniquement)

Voici à quoi ressemble une URL Neon :

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

**Format** : `postgresql://[user]:[password]@[host]/[database]`

---

## 📍 OÙ TROUVER VOTRE URL (3 méthodes)

### Méthode 1 : Dashboard Neon (PLUS SIMPLE)

1. **Allez sur** : https://neon.tech
2. **Connectez-vous** avec GitHub
3. **Cliquez sur votre projet** `agency-platform`
4. **Regardez en haut de la page** : Vous voyez un **bloc noir** avec l'URL

**Capture d'écran imaginaire** :
```
┌─────────────────────────────────────────────────────────┐
│  postgresql://alex:AbC123dEf@ep-cool-darkness-123456... │
│                                    [Copy]                │
└─────────────────────────────────────────────────────────┘
```

5. **Cliquez sur [Copy]** pour copier l'URL

---

### Méthode 2 : Connection Details

1. Dans le dashboard Neon, regardez le **menu de gauche**
2. Cliquez sur **"Connection Details"**
3. Vous voyez une section **"Connection string"**
4. **Cliquez sur l'icône Copy** pour copier l'URL

---

### Méthode 3 : Avec Neon CLI

Si vous avez installé Neon CLI :

```bash
# Lister vos projets
neon projects list

# Obtenir les détails du projet
neon projects get agency-platform

# L'URL apparaîtra dans les détails
```

---

## 🎯 EXEMPLE COMPLET

### Si votre URL est :
```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

### Alors dans votre fichier `.env` :
```env
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

### Et dans `backend/.env.production` :
```env
DATABASE_URL=postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

---

## 🔍 VÉRIFIER QUE L'URL EST BONNE

Une URL Neon valide :
- ✅ Commence par `postgresql://`
- ✅ Contient un `user` et un `password` séparés par `:`
- ✅ Contient un `@` après le password
- ✅ Contient un `host` (généralement `ep-...aws.neon.tech`)
- ✅ Se termine par `/database` (généralement `/neondb`)

**Exemple valide** :
```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.eu-central-1.aws.neon.tech/neondb
```

---

## 🚀 ÉTAPES RAPIDES

1. **Allez sur** https://neon.tech
2. **Connectez-vous** avec GitHub
3. **Ouvrez votre projet** `agency-platform`
4. **Copiez l'URL** depuis le bloc noir en haut
5. **Collez-la** dans `.env` et `backend/.env.production`

---

## 💡 ASTUCE

Si vous avez déjà créé le projet mais avez perdu l'URL :

1. Retournez sur https://neon.tech
2. Cliquez sur votre projet
3. L'URL est toujours affichée en haut de la page
4. Ou allez dans **"Connection Details"**

---

## 📸 OÙ TROUVER L'URL (VISUEL)

```
Dashboard Neon
├── Projet: agency-platform
│   ├── [Bloc noir en haut avec l'URL]
│   │   └── postgresql://user:password@host/dbname
│   │       └── [Bouton Copy]
│   │
│   └── Menu gauche
│       └── Connection Details
│           └── Connection string
│               └── postgresql://user:password@host/dbname
│                   └── [Bouton Copy]
```

---

## ❓ FAQ

### Q : Je n'ai pas encore créé de projet Neon
**R** : Suivez `NEON_MANUAL_SETUP.md` pour créer le projet

### Q : J'ai créé le projet mais je ne trouve pas l'URL
**R** : Elle est en haut de la page du projet, dans un bloc noir

### Q : L'URL ne fonctionne pas
**R** : Vérifiez que vous avez copié toute l'URL (elle est longue)

### Q : Puis-je utiliser une URL locale ?
**R** : Non, vous devez utiliser l'URL Neon pour le déploiement cloud

---

## 🎯 RÉSUMÉ

1. **Allez sur** https://neon.tech
2. **Connectez-vous**
3. **Ouvrez votre projet**
4. **Copiez l'URL** depuis le bloc noir
5. **Collez-la** dans vos fichiers `.env`

**C'est aussi simple que ça !** 🚀

---

**Besoin d'aide ?** Consultez `NEON_MANUAL_SETUP.md` pour un guide détaillé.