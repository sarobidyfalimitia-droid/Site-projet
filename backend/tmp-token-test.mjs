import prisma from './lib/prisma.ts'
import jwt from 'jsonwebtoken'

async function main() {
    await prisma.$connect()
    try {
        const client = await prisma.client.create({
            data: { name: 'TokenTest', email: 'token-test2@example.com', password: 'x', status: 'active' },
        })
        const secret = process.env.JWT_SECRET || 'dev-secret'
        const accessToken = jwt.sign({ id: client.id, email: client.email, role: 'client' }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' })
        const refreshToken = jwt.sign({ id: client.id, email: client.email, role: 'client' }, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret', { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' })
        console.log({ accessToken, refreshToken })
        await prisma.client.update({ where: { id: client.id }, data: { refreshToken } })
    } catch (e) {
        console.error(e)
        process.exitCode = 1
    } finally {
        await prisma.$disconnect()
    }
}

main()
