const path = require('path')
const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client')
const { PrismaClient } = require(clientPath)
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function main() {
    try {
        const email = 'admin@techno-logia.fr'
        const password = 'admin123'
        
        // Vérifier si l'admin existe déjà
        const existingAdmin = await prisma.admin.findUnique({ where: { email } })
        
        if (existingAdmin) {
            console.log('Admin existe déjà:')
            console.log('Email:', existingAdmin.email)
            console.log('ID:', existingAdmin.id)
            console.log('Créé le:', existingAdmin.createdAt)
            
            // Mettre à jour le mot de passe au cas où
            const hash = await bcrypt.hash(password, 12)
            await prisma.admin.update({ where: { email }, data: { password: hash } })
            console.log('Mot de passe mis à jour avec succès')
        } else {
            // Créer un nouvel admin
            const hash = await bcrypt.hash(password, 12)
            const admin = await prisma.admin.create({
                data: {
                    email,
                    password: hash,
                    refreshToken: null, // Champ qui doit être toujours vide
                    twoFactorEnabled: false
                }
            })
            console.log('Admin créé avec succès:')
            console.log('Email:', admin.email)
            console.log('ID:', admin.id)
            console.log('Créé le:', admin.createdAt)
        }
        
        console.log('\nIdentifiants de connexion:')
        console.log('Email:', email)
        console.log('Mot de passe:', password)
        console.log('\nNote: Le champ refreshToken est vide (null) par défaut comme requis.')
        
    } catch (e) {
        console.error('ERREUR:', e.message)
        console.error('Détails:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()