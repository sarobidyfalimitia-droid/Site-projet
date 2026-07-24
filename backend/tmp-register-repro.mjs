import { register } from './src/controllers/auth.controller.ts'

async function main() {
    const req = {
        body: {
            name: 'Client Test',
            email: 'client-repro@example.com',
            password: 'Test1234',
            company: 'Test Company',
            phonePrefix: '+33',
            phoneNumber: '600000000',
            skipOtp: true,
        },
    }

    const res = {
        statusCode: 200,
        status(code) {
            this.statusCode = code
            return this
        },
        json(payload) {
            console.log('status', this.statusCode)
            console.log(JSON.stringify(payload))
            return payload
        },
    }

    try {
        await register(req, res)
    } catch (e) {
        console.error('threw', e)
        process.exitCode = 1
    }
}

main()
