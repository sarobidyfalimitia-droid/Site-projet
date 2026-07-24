import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const otps = await prisma.authOtp.findMany({
    orderBy: { id: 'desc' },
    take: 5,
});
console.log(JSON.stringify(otps, null, 2));
await prisma.$disconnect();
