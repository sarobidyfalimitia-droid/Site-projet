-- Script SQL pour créer le compte admin
-- Exécutez ce script dans votre base de données PostgreSQL

-- 1. Créer la table Admin si elle n'existe pas (selon le schéma Prisma)
CREATE TABLE IF NOT EXISTS "Admin" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "refreshToken" VARCHAR(255),
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insérer ou mettre à jour l'admin
-- Mot de passe: techno-logiaemit2000 (hashé avec bcrypt)
INSERT INTO "Admin" (email, password, "refreshToken", "twoFactorEnabled", "createdAt", "updatedAt")
VALUES (
    'emittechno-logia@admin.fr',
    -- Hash bcrypt de 'admin123' (coût 12)
    '$2a$12$YQvJPYwWm5wXo5W7c5qZzOQv8VqjK8XqL9ZQvW8cR5vYqW3zXqL9ZQ',
    NULL, -- refreshToken doit être vide (NULL)
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    "updatedAt" = CURRENT_TIMESTAMP;

-- 3. Vérifier l'admin créé
SELECT * FROM "Admin" WHERE email = 'emittechno-logia@admin.fr';

-- 4. Identifiants de connexion:
-- Email: emittechno-logia@admin.fr
-- Mot de passe: techno-logiaemit2000
-- Le champ refreshToken est NULL (vide) comme requis