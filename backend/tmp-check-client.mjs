import prisma from './lib/prisma.ts'

async function main() {
    await prisma.$connect()
    try {
        const client = await prisma.client.findUnique({ where: { email: 'client-test2@example.com' } })
        console.log(JSON.stringify(client, null, 2))
    } finally {
        await prisma.$disconnect()
    }
}

main()
