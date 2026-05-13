# ClimateTech API

API de autenticação para o aplicativo ClimateTech com banco de dados SQLite e Prisma ORM.

## 🎯 Features

✅ Autenticação com JWT
✅ Hash de senhas com bcryptjs
✅ Banco de dados SQLite com Prisma ORM
✅ Validação de email e senha
✅ TypeScript com tipagem forte
✅ CORS habilitado
✅ Error handling robusto

## 📋 Pré-requisitos

- Node.js v20+
- npm v10+

## 🚀 Início Rápido

### 1. Instalar dependências

```bash
cd api
npm install
```

### 2. Configurar banco de dados

```bash
# Criar banco e aplicar migrações
npm run prisma migrate dev

# Popular com dados de teste
npm run db:seed
```

### 3. Iniciar servidor

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Ou modo produção
npm run build
npm start
```

O servidor estará em: `http://localhost:3000`

## 📚 Endpoints

### Autenticação

#### Registrar
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### Verificar Token
```
GET /api/auth/verify
Authorization: Bearer <token>
```

#### Health Check
```
GET /health
```

## �️ Scripts

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run start` - Executa versão compilada
- `npm run typecheck` - Verifica tipos
- `npm run lint` - ESLint
- `npm run db:studio` - Abre interface visual do banco
- `npm run db:seed` - Popula banco com dados de teste
- `npm run db:reset` - Reseta banco completamente

## 🗄️ Banco de Dados

### Tecnologias
- **SQLite** - Banco de dados
- **Prisma ORM** - Query builder type-safe
- **Better SQLite3** - Driver nativo

### Esquema

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

Veja `DATABASE.md` para mais detalhes.

## 🔐 Segurança

- Senhas com hash bcryptjs (10 salt rounds)
- JWT com expiração configurável (padrão: 7 dias)
- Validação de email formato
- Senha mínima de 6 caracteres
- Unique constraint em email

## 📁 Estrutura

```
api/
├── src/
│   ├── controllers/     # Lógica dos endpoints
│   ├── middlewares/     # Auth, erro handling
│   ├── routes/         # Rotas
│   ├── services/       # Lógica de negócio
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # JWT, password, erros
│   ├── lib/            # Prisma client
│   └── index.ts        # Express app
├── prisma/
│   ├── schema.prisma   # Modelo de dados
│   ├── seed.ts         # Seed
│   └── migrations/     # Histórico
├── dist/               # Build
└── dev.db             # SQLite database
```

## 📦 Dependências Principais

- **express** - Framework web
- **prisma** - ORM
- **jsonwebtoken** - JWT
- **bcryptjs** - Hash de senhas
- **cors** - CORS
- **dotenv** - Variáveis de ambiente
- **typescript** - Tipagem estática
- **tsx** - Execução TS direto

## � Próximos Passos

- [ ] Adicionar refresh tokens
- [ ] Implementar 2FA
- [ ] Rate limiting
- [ ] Testes com Jest
- [ ] Autenticação OAuth (Google, GitHub)
- [ ] Criar tabela de Dispositivos
- [ ] Integrar com app mobile

## 📖 Documentação Adicional

- [DATABASE.md](./DATABASE.md) - Guia completo do banco de dados
- [TESTING.md](./TESTING.md) - Como testar os endpoints
