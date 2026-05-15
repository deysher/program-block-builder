const { PrismaClient } = require('@prisma/client');

console.log('PrismaClient:', typeof PrismaClient);

const prisma = new PrismaClient();

console.log('prisma.trainer:', typeof prisma.trainer);

module.exports = prisma;