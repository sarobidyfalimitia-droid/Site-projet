const http = require('http')
const https = require('https')
const { URL } = require('url')

const BASE = process.env.BASE_URL || 'http://localhost:3001/api'
const ROUTES = ['/quotes/public', '/messages/public']

function postJson(path, payload = {}) {
    return new Promise((resolve, reject) => {
        try {
            const url = new URL(path, BASE)
            const data = JSON.stringify(payload)
            const lib = url.protocol === 'https:' ? https : http
            const options = {
                method: 'POST',
                hostname: url.hostname,
                port: url.port || (url.protocol === 'https:' ? 443 : 80),
                path: url.pathname + url.search,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data),
                },
                timeout: 10000,
            }

            const start = Date.now()
            const req = lib.request(options, (res) => {
                res.on('data', () => { })
                res.on('end', () => {
                    const duration = Date.now() - start
                    resolve({ status: res.statusCode, duration })
                })
            })

            req.on('error', (err) => reject(err))
            req.on('timeout', () => {
                req.destroy()
                reject(new Error('timeout'))
            })

            req.write(data)
            req.end()
        } catch (err) {
            reject(err)
        }
    })
}

function stats(values) {
    values.sort((a, b) => a - b)
    const sum = values.reduce((s, v) => s + v, 0)
    const avg = sum / values.length
    const p = (p) => values[Math.floor((p / 100) * (values.length - 1))]
    return { count: values.length, min: values[0], max: values[values.length - 1], avg, p50: p(50), p95: p(95) }
}

async function runSequential(route, n = 30) {
    const results = []
    for (let i = 0; i < n; i++) {
        try {
            const res = await postJson(route, { test: true })
            results.push(res)
            process.stdout.write('.')
        } catch (err) {
            results.push({ status: 0, duration: 0, error: err.message })
            process.stdout.write('E')
        }
    }
    process.stdout.write('\n')
    return results
}

async function runConcurrent(route, concurrency = 10, rounds = 10) {
    const results = []
    for (let r = 0; r < rounds; r++) {
        const promises = []
        for (let i = 0; i < concurrency; i++) promises.push(postJson(route, { test: true }).catch((e) => ({ status: 0, duration: 0, error: e.message })))
        const batch = await Promise.all(promises)
        batch.forEach(b => results.push(b))
        process.stdout.write('C')
    }
    process.stdout.write('\n')
    return results
}

; (async () => {
    console.log('Benchmarking base:', BASE)
    for (const route of ROUTES) {
        console.log('\nRoute:', route)
        console.log('Sequential 30 requests:')
        const seq = await runSequential(route, 30)
        const seqDur = seq.filter(r => r.duration).map(r => r.duration)
        console.log('Responses:', seq.length, 'successes:', seqDur.length)
        console.log(stats(seqDur))

        console.log('Concurrent 10x10:')
        const conc = await runConcurrent(route, 10, 10)
        const concDur = conc.filter(r => r.duration).map(r => r.duration)
        console.log('Responses:', conc.length, 'successes:', concDur.length)
        console.log(stats(concDur))
    }
})().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
