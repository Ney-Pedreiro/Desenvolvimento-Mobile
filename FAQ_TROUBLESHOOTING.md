# 🆘 FAQ & Troubleshooting

## ❓ Perguntas Frequentes

### P: Os dados persistem se eu reiniciar a API?
**R:** Sim! Todos os dados estão salvos no SQLite (`api/dev.db`). Mesmo desligando e ligando a API, os dados continuam lá.

### P: Posso testar com múltiplos celulares?
**R:** Sim! Todos na mesma rede WiFi. Só altere o IP no `.env.local` se necessário.

### P: Qual é a senha padrão do teste?
**R:** Email: `joao@example.com`, Senha: `senha123`

### P: Como registrar novos usuários?
**R:** Na tela de login, clique em "Criar uma Conta" e preencha os dados.

### P: Posso deletar usuários e seus dados?
**R:** Não há endpoint DELETE de usuários por segurança, mas você pode deletar pelo Prisma Studio:
```bash
cd api
npm run db:studio
```

### P: Como resetar o banco completamente?
**R:** ⚠️ Cuidado - isso apaga TUDO!
```bash
cd api
npm run db:reset
```

### P: Os dados funcionam offline?
**R:** Parcialmente. O cache local (AsyncStorage) funciona, mas não sincroniza com o backend até conectar novamente.

### P: Posso mudar a porta da API?
**R:** Sim, no arquivo `api/.env.development`:
```bash
PORT=3001
```
E atualizar `CORS_ORIGIN` também.

---

## 🐛 Erros Comuns & Soluções

### ❌ "Cannot connect to localhost:3000"

**Causa:** API não está rodando

**Solução:**
```bash
cd api
npm run dev
```

Verificar saída: `🚀 Server running on http://localhost:3000`

---

### ❌ "Network error during authentication"

**Causa:** Celular não consegue acessar PC

**Solução:**
1. Verificar se estão na mesma rede WiFi
2. Verificar firewall do PC (liberar porta 3000)
3. Verificar `.env.local` com IP correto
4. Testar: `ping [IP_DO_PC]` no celular

---

### ❌ "EADDRINUSE: address already in use :::3000"

**Causa:** Outra aplicação usando porta 3000

**Solução - Linux/Mac:**
```bash
lsof -i :3000
kill -9 [PID_DA_LISTA_ACIMA]
```

**Solução - Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

Ou usar outra porta:
```bash
PORT=3001 npm run dev
```

---

### ❌ "Token expired"

**Causa:** Token JWT com mais de 7 dias

**Solução:** Fazer login novamente

---

### ❌ "CORS error"

**Causa:** CORS não configurado para seu IP

**Solução:** Editar `api/.env.development`:
```bash
CORS_ORIGIN=http://localhost:3000,http://[SEU_IP]:8081,http://[SEU_IP]:19000
```

---

### ❌ "database is locked"

**Causa:** Prisma Studio aberto enquanto testa

**Solução:** Fechar Prisma Studio:
```bash
# Ctrl+C em outro terminal
```

---

### ❌ "Device not found" ao deletar

**Causa:** Dispositivo já foi deletado ou ID errado

**Solução:** Atualizar lista (pull to refresh)

---

### ❌ Dados não sincronizam

**Causa:** Problemas de conexão ou token inválido

**Soluções:**
1. Fazer logout e login novamente
2. Checar conexão de internet
3. Resetar cache: `npm run reset-project`
4. Verificar logs da API

---

## 🔧 Dicas de Debug

### Ver Logs da API

```bash
cd api
npm run dev
# Todos os erros aparecem aqui
```

### Ver Banco de Dados Graficamente

```bash
cd api
npm run db:studio
# Abre em http://localhost:5555
```

### Testar API com cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# Listar dispositivos (substituir TOKEN)
curl -X GET http://localhost:3000/api/devices \
  -H "Authorization: Bearer TOKEN_AQUI"

# Health check
curl http://localhost:3000/health
```

### Testar com Postman

1. Abrir Postman
2. URL: `http://localhost:3000`
3. Fazer login primeiro
4. Copiar token da resposta
5. Em "Authorization", escolher "Bearer Token"
6. Colar o token

---

## 📊 Verificar Status

### API está rodando?
```bash
curl http://localhost:3000/health
# Esperado: {"status":"ok","timestamp":"..."}
```

### Banco de dados existe?
```bash
ls -la api/dev.db
# Se não existe: npm run db:reset no diretório api
```

### Prisma Client atualizado?
```bash
cd api
npx prisma generate
```

### Migrações aplicadas?
```bash
cd api
npm run migrate:status
```

---

## 🔐 Segurança

### Mudar JWT Secret (importante em produção)

`api/.env.development`:
```bash
JWT_SECRET=sua_chave_super_segura_aqui
JWT_EXPIRES_IN=7d
```

### Mudar senha do usuário de teste

```bash
cd api
npm run db:studio
# Ir na tabela User
# Editar o campo password (mas está hasheado!)
# Melhor usar endpoint de atualização
```

---

## 🚀 Otimizações

### Para melhor performance

1. **Adicionar índices no banco:**
   - Já feito automaticamente no schema

2. **Limitar tamanho de requests:**
   ```javascript
   app.use(express.json({ limit: '1mb' }));
   ```

3. **Adicionar rate limiting:**
   ```bash
   npm install express-rate-limit
   ```

4. **Cachear com Redis** (avançado)

---

## 📱 Teste em Emulador

### Android Studio Emulator

```bash
# Verificar IP do PC
ifconfig | grep "inet "

# No emulator, acessar PC por:
http://10.0.2.2:3000
# (não é 127.0.0.1, é o gateway especial!)
```

### iOS Simulator

```bash
# Mesma rede WiFi
http://[IP_DO_SEU_PC]:3000
```

---

## 📈 Monitoramento

### Verificar uso de banco

```bash
cd api
npm run db:studio
# Ver quantos registros tem cada tabela
```

### Verificar tamanho do banco

```bash
# Linux/Mac
du -sh api/dev.db

# Windows
dir api/dev.db
```

---

## 🆘 Quando Tudo Falha

### Nuclear Option (reseta TUDO)

```bash
# Parar todos os servidores (Ctrl+C)

# Limpar node_modules e instalar novamente
rm -rf node_modules package-lock.json
npm install

cd api
rm -rf node_modules package-lock.json dev.db
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts

# Voltar e rodar
cd ..
npm start
```

### Pedir ajuda

Se tudo falhar, colete as informações:

```bash
# Versões
node --version
npm --version

# Estrutura
ls -la api/
ls -la .env.local

# Erros (copiar dos terminais)
```

---

## 📞 Contato para Suporte

1. Ver `api/API_DOCS.md`
2. Ver `ARQUITETURA.md`
3. Ver `README_COMPLETO.md`
4. Rodar `setup.sh` novamente

---

**Última atualização:** Junho de 2025

Got it! Feel free to ask if you need anything else. 🚀
