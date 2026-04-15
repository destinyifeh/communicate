import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
console.log('Prisma delegates:', Object.keys(prisma).filter(k => !k.startsWith('_')));
