import prisma from './lib/prisma.ts'

async function main() {
    await prisma.$connect()
    try {
        const result = await prisma.client.create({
            data: {
                name: 'Test',
                email: 'test-from-script@example.com',
                password: 'x',
                status: 'active',
            },
        })
        console.log('created', result)
    } catch (e) {
        console.error(e)
        process.exitCode = 1
    } finally {
        await prisma.$disconnect()
    }
}

main()
