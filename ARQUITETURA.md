# 🚀 Entendendo a Arquitetura da App

## Duas Coisas Diferentes Rodando em Portas Diferentes

```
┌─────────────────────────────────────────────────────────────┐
│              CELULAR DO PROFESSOR                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  APP (React Native)                                  │   │
│  │  - Tela de Login                                     │   │
│  │  - Lista de Dispositivos                             │   │
│  │  - etc...                                            │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓ Faz requisições HTTP para                       │
│           ↓                                                  │
│  exp://192.168.6.191:8081                                   │
│  (Expo Metro - baixa o código JavaScript)                   │
│                                                              │
│           ↓ Faz requisições HTTP para                       │
│           ↓                                                  │
│  http://192.168.6.191:3000                                  │
│  (API Backend - salva dados no banco)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            PC DO PROFESSOR (192.168.6.191)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Porta 8081: npm start                                      │
│  ├─ Expo Metro Bundler                                      │
│  ├─ Compila React Native → JavaScript                       │
│  └─ Envia para o celular                                    │
│                                                              │
│  Porta 3000: npm run dev (pasta api/)                       │
│  ├─ API Backend (Node.js + Express)                         │
│  ├─ Banco de dados SQLite (dev.db)                          │
│  └─ Salva login, dispositivos, tarefas, etc.                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Como Funciona o Fluxo

1. **Professor inicia Expo no PC**: `npm start`
   - Expo Metro começa a rodar em `exp://192.168.6.191:8081`
   - Fica esperando celulares se conectarem

2. **Professor abre app no celular**
   - Celular conecta em `exp://192.168.6.191:8081`
   - Baixa o código JavaScript da app
   - App carrega na tela

3. **Usuário faz login na app**
   - App envia email + senha para `http://192.168.6.191:3000/api/auth/login`
   - Backend valida e retorna token JWT
   - Token é salvo no AsyncStorage do celular

4. **Dados persistem**
   - Todos os dados salvos no SQLite (`dev.db`) no PC
   - Qualquer celular conectado consegue acessar

## 🔧 Configuração Necessária

### No PC do Professor:

**Terminal 1 - Expo Metro:**
```bash
npm start
# Saída: 📱 Expo Go - exp://192.168.6.191:8081
```

**Terminal 2 - API Backend:**
```bash
cd api
npm run dev
# Saída: 🚀 Server running on http://192.168.6.191:3000
```

### No Celular do Professor:

Abrir o app Expo Go:
- Escanear QR code da porta 8081
- Ou digitar: `exp://192.168.6.191:8081`

### Arquivo de Configuração:

`.env.local` (raiz do projeto):
```bash
EXPO_PUBLIC_API_URL=http://192.168.6.191:3000
```

Este arquivo diz para a app onde encontrar a API backend.

## ❓ Resumo

| Coisa | Porta | Função | Para Quem |
|-------|-------|--------|-----------|
| **Expo Metro** | 8081 | Serve código JavaScript | Celular (baixa a app) |
| **API Backend** | 3000 | Salva dados no banco | App (faz login, busca dados) |

A URL `exp://192.168.6.191:8081` é só para baixar o código. Dados são salvos em `http://192.168.6.191:3000`.

