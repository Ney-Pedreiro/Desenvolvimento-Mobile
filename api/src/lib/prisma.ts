import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
    const adapter = new PrismaBetterSqlite3({ url: dbPath });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}
