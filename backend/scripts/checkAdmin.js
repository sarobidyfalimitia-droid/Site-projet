const path = require('path')
const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client')
const { PrismaClient } = require(clientPath)
const prisma = new PrismaClient()

async function main() {
    try {
        const admin = await prisma.admin.findUnique({ where: { email: 'admin@techno-logia.fr' } });
        console.log('admin=', admin);
    } catch (e) {
        console.error('ERROR:', e.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
