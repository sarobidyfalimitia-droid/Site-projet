const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
    const prisma = new PrismaClient()
    
    try {
        const email = 'admin@techno-logia.fr'
        const password = 'admin123'
        
        console.log('Création du compte admin...')
        console.log('Email:', email)
        console.log('Mot de passe:', password)
        
        // Vérifier si l'admin existe déjà
        const existingAdmin = await prisma.admin.findUnique({ where: { email } })
        
        if (existingAdmin) {
            console.log('\n✅ Admin existe déjà:')
            console.log('   Email:', existingAdmin.email)
            console.log('   ID:', existingAdmin.id)
            console.log('   Créé le:', existingAdmin.createdAt)
            console.log('   RefreshToken:', existingAdmin.refreshToken || '(vide)')
            
            // Vérifier le mot de passe
            const isValid = await bcrypt.compare(password, existingAdmin.password)
            console.log('   Mot de passe valide:', isValid)
            
            if (!isValid) {
                const hash = await bcrypt.hash(password, 12)
                await prisma.admin.update({ where: { email }, data: { password: hash } })
                console.log('   ✅ Mot de passe mis à jour')
            }
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
            console.log('\n✅ Admin créé avec succès:')
            console.log('   Email:', admin.email)
            console.log('   ID:', admin.id)
            console.log('   Créé le:', admin.createdAt)
            console.log('   RefreshToken:', admin.refreshToken || '(vide)')
        }
        
        console.log('\n📋 IDENTIFIANTS DE CONNEXION ADMIN:')
        console.log('===================================')
        console.log('Email:    admin@techno-logia.fr')
        console.log('Mot de passe: admin123')
        console.log('===================================')
        console.log('\n⚠️  IMPORTANT:')
        console.log('- Le champ refreshToken est vide (null) par défaut')
        console.log('- Ce compte a accès au panel admin (/admin)')
        console.log('- Pour la production, changez le mot de passe immédiatement')
        
    } catch (error) {
        console.error('\n❌ ERREUR:', error.message)
        console.error('Détails:', error)
        
        // Suggestions de dépannage
        console.log('\n🔧 Dépannage:')
        console.log('1. Vérifiez que la base de données est en cours d\'exécution')
        console.log('2. Vérifiez la variable DATABASE_URL dans .env')
        console.log('3. Exécutez: npx prisma db push')
        console.log('4. Exécutez: npx prisma generate')
        
    } finally {
        await prisma.$disconnect()
    }
}

// Exécuter le script
main().catch(console.error)