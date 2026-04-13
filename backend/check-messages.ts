import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { conversation: { select: { channel: true } } }
  });
  console.log(JSON.stringify(messages, null, 2));
}

main().finally(() => prisma.$disconnect());
