import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.findFirst();
  console.log('BusinessId:', business?.id);
}

main().finally(() => prisma.$disconnect());
