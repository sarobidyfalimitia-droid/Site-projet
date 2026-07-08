const path = require('path')
const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client')
const { PrismaClient } = require(clientPath)
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function main() {
    try {
        const email = 'admin@techno-logia.fr'
        const admin = await prisma.admin.findUnique({ where: { email } })
        if (!admin) {
            console.log('Admin not found')
            return
        }
        const hash = await bcrypt.hash('admin123', 12)
        await prisma.admin.update({ where: { email }, data: { password: hash } })
        console.log('Admin password updated to hashed value')
    } catch (e) {
        console.error('ERROR:', e.message)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
