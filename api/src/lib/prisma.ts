import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';

const adapter = databaseUrl.startsWith('postgres') || databaseUrl.startsWith('postgresql')
  ? new PrismaPg(new pg.Pool({ connectionString: databaseUrl }))
  : new PrismaBetterSqlite3({ url: databaseUrl });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export function getPrismaClient(): PrismaClient {
  return prisma;
}

export default prisma;
