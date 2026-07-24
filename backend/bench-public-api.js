const quoteUrl = 'http://localhost:3001/api/quotes/public';
const messageUrl = 'http://localhost:3001/api/messages/public';
const quoteBody = {
    title: 'Test',
    description: 'Benchmark test',
    budgetRange: '2 000 - 5 000 €',
    status: 'PENDING',
    contactName: 'Test User',
    contactEmail: 'test@example.com',
    contactPhone: '+33123456789',
    company: 'Test Co',
};
const messageBody = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Benchmark',
    body: 'Benchmark message',
};

const run = async () => {
    for (let i = 1; i <= 5; i += 1) {
        const start = Date.now();
        const res = await fetch(quoteUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quoteBody),
        });
        const text = await res.text();
        const duration = Date.now() - start;
        console.log(`quote attempt ${i}: ${duration} ms status=${res.status} body=${text}`);
    }

    for (let i = 1; i <= 5; i += 1) {
        const start = Date.now();
        const res = await fetch(messageUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageBody),
        });
        const text = await res.text();
        const duration = Date.now() - start;
        console.log(`message attempt ${i}: ${duration} ms status=${res.status} body=${text}`);
    }
};

run().catch((err) => {
    console.error('Benchmark failed:', err);
    process.exit(1);
});