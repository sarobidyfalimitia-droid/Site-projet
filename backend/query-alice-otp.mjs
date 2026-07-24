import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const otps = await prisma.authOtp.findMany({
    where: { email: 'alice@test.fr' },
    orderBy: { id: 'desc' },
    take: 1,
});
console.log(JSON.stringify(otps, null, 2));
await prisma.$disconnect();
