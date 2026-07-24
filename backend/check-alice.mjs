import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const client = await prisma.client.findUnique({
    where: { email: 'alice@test.fr' },
});
console.log(JSON.stringify(client, null, 2));
await prisma.$disconnect();
