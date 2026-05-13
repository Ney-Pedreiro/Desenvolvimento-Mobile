import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { hashPassword } from '../src/utils/password.js';

const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seedando banco de dados...');

  // Limpar dados existentes
  await prisma.user.deleteMany();

  // Criar usuários de teste
  const hashedPassword = await hashPassword('senha123');

  const user1 = await prisma.user.create({
    data: {
      email: 'joao@example.com',
      password: hashedPassword,
      name: 'João Silva',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      password: hashedPassword,
      name: 'Maria Santos',
    },
  });

  console.log('✅ Usuários criados com sucesso:');
  console.log(`   - ${user1.name} (${user1.email})`);
  console.log(`   - ${user2.name} (${user2.email})`);
  console.log('\n💡 Senha padrão: senha123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao seedar banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
