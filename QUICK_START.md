# 🚀 QUICK START - 30 SEGUNDOS

## Copie e Cole Isso:

```bash
# 1. Setup automático (2 min)
bash setup.sh

# 2. Terminal 1 - API
cd api && npm run dev

# 3. Terminal 2 - Expo
npm start

# 4. Celular
# Abrir Expo Go → Escanear QR code

# 5. Login
# Email: joao@example.com
# Senha: senha123
```

## Pronto! 🎉

A app está sincronizando com a API. Todos os dados persistem automaticamente!

---

## 📝 Se o IP mudar

Editar `.env.local`:
```bash
EXPO_PUBLIC_API_URL=http://[SEU_IP_NOVO]:3000
```

---

## 💡 Comandos Úteis

```bash
# Ver dados no banco
cd api && npm run db:studio

# Resetar banco
cd api && npm run db:reset

# Popular com dados
cd api && npm run db:seed

# Testar API
curl http://localhost:3000/health
```

---

## 🎓 Documentação

- 📖 `README_COMPLETO.md` - Guia completo
- 🏗️ `ARQUITETURA.md` - Como funciona
- 📚 `api/API_DOCS.md` - Endpoints
- ✅ `CONCLUSAO_API_COMPLETA.md` - Status final

---

**Tudo pronto! Divirta-se! 🚀**
