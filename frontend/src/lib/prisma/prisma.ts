// Placeholder Prisma client - will be connected when backend is ready
// For now, this is a no-op to avoid build errors

const globalForPrisma = globalThis as unknown as { prisma: unknown };

export const prisma = globalForPrisma.prisma || null;
