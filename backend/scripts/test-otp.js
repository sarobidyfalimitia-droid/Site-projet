const path = require('path')
const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

async function postJson(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const text = await res.text()
    let data = null
    try { data = JSON.parse(text) } catch (e) { data = text }
    return { status: res.status, data }
}

; (async () => {
    const prisma = new PrismaClient()
    console.log('Prisma models available:', Object.keys(prisma).filter(k => !k.startsWith('_')))
    try {
        const base = process.env.API_BASE || 'http://localhost:3001/api'
        const email = `test+otp+${Date.now()}@example.com`
        console.log('Using email:', email)


        // Create OTP directly in DB (avoid sending real emails during test)
        const bcrypt = require('bcryptjs')
        const code = String(Math.floor(100000 + Math.random() * 900000))
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        const hashedPassword = await bcrypt.hash('P@ssw0rd1', 12)

        console.log('Creating OTP record in DB...')
        await prisma.authOtp.create({
            data: {
                email,
                type: 'REGISTER',
                code,
                expiresAt,
                payload: {
                    name: 'Test User',
                    email,
                    password: hashedPassword,
                    company: 'TestCo',
                    phone: null,
                },
            },
        })

        // Wait a bit for DB write
        await new Promise((r) => setTimeout(r, 300))

        const otp = await prisma.authOtp.findFirst({ where: { email, type: 'REGISTER' }, orderBy: { createdAt: 'desc' } })

        if (!otp) {
            console.error('No OTP found in DB for', email)
            process.exit(1)
        }

        console.log('Found OTP in DB:', otp.code)

        console.log('Calling verify endpoint...')
        const verifyRes = await postJson(`${base}/auth/register/verify`, { email, code: otp.code })
        console.log('Verify response status', verifyRes.status, verifyRes.data)
    } catch (err) {
        console.error('Error', err)
    } finally {
        try { await prisma.$disconnect() } catch (e) { }
    }
})()
