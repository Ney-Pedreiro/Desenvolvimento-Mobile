# 🚀 COMECE AQUI - Guia Rápido

## ⏱️ 5 Minutos para Rodar Tudo

### Opção 1: Automático (Recomendado)
```bash
bash setup.sh
```

### Opção 2: Manual

**Terminal 1 - API:**
```bash
cd api
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

**Terminal 2 - Expo:**
```bash
npm install
npm start
```

**No celular:** Escanear QR code ou digitar `exp://[IP]:8081`

---

## 📱 Credenciais de Teste

Email: `joao@example.com`
Senha: `senha123`

---

## 📚 Documentação

- **Rápido:** Este arquivo (COMECE_AQUI.md)
- **Endpoints:** `api/API_DOCS.md`
- **Arquitetura:** `ARQUITETURA.md`
- **Troubleshooting:** `FAQ_TROUBLESHOOTING.md`
- **Completo:** `README_COMPLETO.md`

---

## ✅ O Que Foi Implementado

### API Backend
- ✅ 15 endpoints (Auth, Devices, Tasks)
- ✅ Autenticação JWT
- ✅ Banco SQLite com Prisma
- ✅ Dados persistem

### Mobile App
- ✅ Sincronização automática
- ✅ Cache offline
- ✅ DevicesContext (CRUD)
- ✅ TasksContext (CRUD)

### Rede
- ✅ Funciona em qualquer IP
- ✅ Suporte a múltiplos celulares
- ✅ CORS configurável

---

## 🧪 Testar Rápido

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'
```

---

## 🎯 Fluxo Principal

1. Usuário faz login
2. AuthContext obtém JWT
3. DevicesContext sincroniza dados
4. TasksContext sincroniza dados
5. Tudo persiste no SQLite

---

## 💾 Seu IP

Para descobrir seu IP (necessário para celular se conectar):

```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig
```

Depois editar `.env.local` com esse IP.

---

## 🚨 Problemas?

1. API não conecta? → Verificar se está rodando (`npm run dev`)
2. Dados não sincronizam? → Fazer logout e login novamente
3. Erro CORS? → Verificar IP em `.env.local` e `api/.env.development`

Ver `FAQ_TROUBLESHOOTING.md` para soluções completas.

---

## 🎉 Pronto!

A API está **100% completa e funcional**. Todos os dados persistem automaticamente.

Divirta-se! 🚀
