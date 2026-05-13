# 🔗 Integração Backend + Frontend

## ✅ Status da Integração

✅ **Backend (API)** - Pronto e testado
✅ **Frontend (App Mobile)** - Integrado com AuthContext
✅ **AuthContext** - Conectado à API com AsyncStorage

## 🎯 O que foi feito

### 1. AuthContext Atualizado
- ✅ `login()` - Faz requisição POST para `/api/auth/login`
- ✅ `register()` - Faz requisição POST para `/api/auth/register`
- ✅ `logout()` - Remove token do AsyncStorage
- ✅ `checkAuth()` - Verifica token salvo ao iniciar app
- ✅ Salva token JWT no AsyncStorage após login/registro
- ✅ Envia token no header Authorization para endpoints protegidos

### 2. Telas Atualizadas
- ✅ `app/login.tsx` - Agora chama API real
- ✅ `app/register.tsx` - Agora chama API real
- ✅ Ambas lidam com erros da API

### 3. Variáveis de Ambiente
- ✅ `.env` criado com `EXPO_PUBLIC_API_URL=http://localhost:3000`
- ✅ AuthContext lê a URL da API automaticamente

## 🚀 Como Testar

### Pré-requisitos

1. **API rodando** na porta 3000:
```bash
cd api
npm run dev
```

2. **App mobile rodando**:
```bash
# Em outro terminal
npm run dev  # ou expo start
```

### Teste 1: Login com usuário de teste

1. Abra o app mobile
2. Vá para tela de Login
3. Preencha com:
   - Email: `joao@example.com`
   - Senha: `senha123`
4. Clique em "Entrar"
5. ✅ Deve logar com sucesso e ir para `/tabs`

### Teste 2: Registrar novo usuário

1. Na tela de Login, clique em "Criar uma conta"
2. Preencha:
   - Nome: `Seu Nome`
   - Email: `seuemail@example.com`
   - Senha: `senha123`
   - Confirmar Senha: `senha123`
3. Clique em "Registrar"
4. ✅ Deve registrar e fazer login automaticamente

### Teste 3: Persistência de sessão

1. Faça login
2. Feche o app completamente
3. Reabra o app
4. ✅ Deve manter a sessão (já estar autenticado)

### Teste 4: Logout

1. Na tela autenticada (tabs)
2. Logout do app
3. ✅ Deve voltar para tela de login

## 🔄 Fluxo de Dados

```
App → Login/Register Screen
        ↓
    useAuth() hook
        ↓
    AuthContext (contexts/AuthContext.tsx)
        ↓
    Requisição HTTP para API
        ↓
    API Backend (api/src)
        ↓
    Banco de dados SQLite
        ↓
    Retorna JWT token
        ↓
    AsyncStorage (salva token)
        ↓
    AuthContext atualiza estado
        ↓
    App redirecionado para /(tabs)
```

## 🐛 Troubleshooting

### Erro: "Cannot connect to localhost:3000"

**Solução:**
1. Certifique-se que a API está rodando (`npm run dev` na pasta api)
2. Verifique se está na mesma rede (Wi-Fi)
3. Para Android no emulador: use `10.0.2.2:3000` em vez de `localhost:3000`
4. Para iOS no simulador: `localhost:3000` funciona normalmente

**Alterar URL no `.env`:**
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000  # Android
EXPO_PUBLIC_API_URL=http://seu-ip:3000     # Physical device
```

### Erro: "Email already registered"

**Solução:** Use um email diferente ou resete o banco da API:
```bash
cd api
npm run db:reset
npm run db:seed
```

### Token expirado

**Solução:** Faça login novamente. O token padrão expira em 7 dias.

### CORS Error

**Solução:** Verifique se a API tem CORS configurado corretamente:
```bash
# No arquivo .env da API
CORS_ORIGIN=http://localhost:3000,http://localhost:19000,http://localhost:19001
```

## 📊 Estrutura de Dados

### User (no banco)
```
{
  id: string (cuid)
  email: string (unique)
  password: string (hashed)
  name: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### JWT Token (salvo no AsyncStorage)
```
{
  id: string
  email: string
  name: string
  iat: number (issued at)
  exp: number (expiration)
}
```

## 🔐 Segurança

✅ Token salvo no AsyncStorage (async-storage)
✅ Senha NUNCA é salva no cliente
✅ JWT validado a cada requisição
✅ CORS restritivo na API
✅ Token expirado automaticamente

## 🎯 Próximos Passos

1. **Adicionar mais endpoints:**
   - Atualizar perfil do usuário
   - Alterar senha
   - Deletar conta

2. **Implementar refresh tokens:**
   - Token curto (15 min) + refresh token (7 dias)
   - Renovar automaticamente

3. **Adicionar 2FA:**
   - Autenticação de dois fatores
   - Google Authenticator ou SMS

4. **Criar mais funcionalidades:**
   - Tabela de Dispositivos
   - Tabela de Manutenção
   - Integrar endpoints existentes

## 📝 Arquivos Modificados

- ✅ `contexts/AuthContext.tsx` - Integração com API
- ✅ `app/login.tsx` - Usa novo AuthContext
- ✅ `app/register.tsx` - Usa novo AuthContext
- ✅ `.env` - URL da API

## 💡 Dicas

- Use **Insomnia** ou **Postman** para testar API diretamente
- Use **React DevTools** para inspecionar AuthContext
- Use **AsyncStorage debugger** para ver tokens salvos
- Console logs aparecem em `npm run dev`

---

**Status:** ✅ Backend + Frontend integrados e funcionando!
