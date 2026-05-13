# 🎯 API ClimateTech - Autenticação com SQLite + Prisma

## 📋 Resumo da Estrutura

```
api/
├── src/
│   ├── controllers/      # Lógica dos endpoints
│   ├── middlewares/      # Auth e erro handling
│   ├── routes/          # Definição das rotas
│   ├── services/        # Lógica de negócio (AuthService)
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # JWT, password, erros
│   ├── lib/             # Utilitários (Prisma client)
│   └── index.ts         # Servidor Express
├── prisma/
│   ├── schema.prisma    # Modelo de dados
│   ├── seed.ts          # Seed de dados
│   └── migrations/      # Histórico de migrações
├── dist/                # Build compilado
├── dev.db              # 🆕 Banco SQLite
├── .env                # Variáveis de ambiente
└── package.json        # Dependências
```

## 🗄️ Banco de Dados (SQLite + Prisma)

### O que foi configurado:

✅ **SQLite** - Banco de dados leve e sem servidor
✅ **Prisma ORM** - Query builder type-safe
✅ **Better SQLite3** - Driver nativo para melhor performance
✅ **Migrations** - Versionamento do schema do banco

### Modelo de Dados (User)

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

## 🚀 Quick Start

### 1. Instalar dependências

```bash
cd api
npm install
```

### 2. Criar/resetar banco de dados

```bash
# Criar banco e aplicar migrações
npm run prisma migrate dev

# OU resetar tudo (cuidado: deleta dados!)
npm run db:reset
```

### 3. Popular banco com dados de teste

```bash
npm run db:seed
```

Isso cria dois usuários:
- **João Silva** (joao@example.com) / senha123
- **Maria Santos** (maria@example.com) / senha123

### 4. Iniciar servidor

```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm run build
npm start
```

## 🔧 Comandos Úteis

```bash
# Ver banco em interface visual
npm run db:studio

# Compilar TypeScript
npm run build

# Verificar tipos
npm run typecheck

# Lint do código
npm run lint

# Resetar banco completamente
npm run db:reset

# Popular banco
npm run db:seed
```

## 📝 Testando Endpoints

### 1️⃣ Health Check
```bash
curl http://localhost:3000/health
```

### 2️⃣ Login (com usuário do seed)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clk1a2b3c4d5e6f7g8h9i0j1k",
      "email": "joao@example.com",
      "name": "João Silva"
    }
  }
}
```

### 3️⃣ Registrar Novo Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Usuário",
    "email": "novo@example.com",
    "password": "senha123"
  }'
```

### 4️⃣ Verificar Token (Protegido)
```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 📊 Visualizar Banco de Dados

```bash
npm run db:studio
```

Isso abre uma interface web em http://localhost:5555 onde você pode:
- Ver todos os usuários
- Criar/editar/deletar registros
- Executar queries

## 🔄 Fazer Migrações

Se você mudar o `schema.prisma`, execute:

```bash
npm run prisma migrate dev --name descricao_da_mudanca
```

Exemplos:
```bash
npm run prisma migrate dev --name "add user fields"
npm run prisma migrate dev --name "create devices table"
```

## 🐛 Troubleshooting

### Erro: "Database file not found"
```bash
npm run prisma migrate dev
npm run db:seed
```

### Erro: "Email already exists"
Significa que o usuário já existe. Use outro email ou resete o banco:
```bash
npm run db:reset
```

### Erro: "Invalid token"
O token pode ter expirado (padrão: 7 dias). Faça login novamente:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@example.com", "password": "senha123"}'
```

## 📚 Próximos Passos

- [ ] Adicionar refresh tokens
- [ ] Implementar 2FA
- [ ] Rate limiting por IP
- [ ] Logs de auditoria
- [ ] Criar tabela de Dispositivos
- [ ] Integrar com app mobile
