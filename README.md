# Agency Platform — Full Stack

Plateforme professionnelle pour agence digitale avec Next.js 14, TanStack Query/Table, Express.js et PostgreSQL.

## Stack technique

### Frontend
- **Next.js 14** (App Router, Server Components)
- **TanStack Query v5** — gestion des requêtes / cache
- **TanStack Table v8** — tableaux de données avancés
- **Zustand** — gestion d'état global (auth)
- **Framer Motion** — animations
- **Tailwind CSS** — styles
- **TypeScript**

### Backend
- **Express.js** + TypeScript
- **Prisma ORM** + PostgreSQL
- **JWT** + Refresh Tokens
- **Socket.io** — notifications temps réel
- **Multer** — upload de fichiers

## Démarrage rapide

### 1. Prérequis

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm ou yarn

### 2. Backend

```bash
cd backend
cp .env.example .env
# Éditez .env : DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET

npm install

# Créer les tables
npx prisma db push

# Seed (admin + données de démo)
npm run db:seed

npm run dev
# Serveur sur http://localhost:3001
```

**Comptes de démo :**
- Admin : `admin@techno-logia.fr` / `admin123`
- Client : `client@demo.fr` / `client123`

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# Éditez .env.local : NEXT_PUBLIC_API_URL

npm install
npm run dev
# Application sur http://localhost:3000
```

## Structure des dossiers

```
agency-platform/
├── frontend/
│   └── src/
│       ├── app/                    # Next.js App Router
│       │   ├── (public)/           # Pages publiques
│       │   ├── admin/              # Back-office admin
│       │   ├── client/             # Espace client
│       │   └── auth/               # Authentification
│       ├── components/
│       │   ├── admin/              # Composants admin
│       │   ├── client/             # Composants client
│       │   ├── layout/             # Navbar, Footer
│       │   ├── public/             # Hero, Services, etc.
│       │   └── shared/             # DataTable (TanStack Table)
│       ├── hooks/                  # Hooks TanStack Query
│       ├── lib/                    # api.ts, utils.ts, query-provider
│       ├── services/               # Services API (axios)
│       ├── store/                  # Zustand stores
│       └── types/                  # TypeScript types
│
└── backend/
    ├── prisma/
    │   ├── schema.prisma           # Schéma DB complet
    │   └── seed.ts                 # Données initiales
    └── src/
        ├── controllers/            # Logique métier
        ├── middleware/             # Auth JWT
        ├── routes/                 # Routes Express
        └── lib/                    # Prisma client
```

## Fonctionnalités

### Front-office (public)
- Page d'accueil avec hero, stats animées, services, projets, témoignages
- Catalogue projets avec recherche et filtres
- Page détail projet
- Présentation équipe
- Blog & articles
- Page contact
- Formulaire de devis complet avec upload

### Espace Admin
- Dashboard avec statistiques et graphiques (Recharts)
- CRUD complet : Projets, Clients, Catégories, Équipe, Blog, Témoignages
- Gestion devis (approbation/refus)
- Gestion factures + génération PDF
- Gestion contrats
- Gestion rendez-vous (confirmation + Google Meet)
- Médiathèque
- Messages reçus
- Paramètres

### Espace Client
- Tableau de bord personnel
- Suivi de projets
- Consultation devis et factures
- Consultation contrats
- Prise de rendez-vous
- Notifications

### Sécurité
- JWT Access Token (15 min) + Refresh Token (30 jours)
- Bcrypt pour les mots de passe
- Rate limiting (express-rate-limit)
- Helmet (headers sécurité)
- Validation Zod côté client
- Routes protégées par rôle (admin/client)

## Variables d'environnement

### Backend (.env)
```
DATABASE_URL="postgresql://user:pass@localhost:5432/agency_platform"
JWT_SECRET="secret-key"
JWT_REFRESH_SECRET="refresh-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### OpenRouter (optionnel)

Si vous utilisez le provider OpenRouter pour des modèles LLM, définissez la variable d'environnement suivante dans le backend (ou dans Docker / votre CI) :

```
OPENROUTER_API_KEY="votre_cle_openrouter_ici"
```

Ne commitez jamais votre clé privée dans le dépôt. Utilisez `.env` local ou les secrets des conteneurs.

### Redémarrage de VS Code

Après avoir défini la clé dans Windows avec `setx`, fermez totalement Visual Studio Code puis rouvrez-le. Sans redémarrage complet, les extensions et le terminal intégré ne verront pas toujours la nouvelle variable d'environnement.

Dans VS Code, vérifiez ensuite dans un terminal intégré :

```powershell
echo $env:OPENROUTER_API_KEY
```

La valeur doit être votre clé OpenRouter réelle, pas un placeholder.


### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Commandes utiles

```bash
# Backend
npm run db:push       # Appliquer le schéma
npm run db:migrate    # Créer une migration
npm run db:seed       # Insérer les données de démo
npm run db:studio     # Ouvrir Prisma Studio

# Frontend
npm run dev           # Démarrer en développement
npm run build         # Build de production
npm run lint          # Linter
```
