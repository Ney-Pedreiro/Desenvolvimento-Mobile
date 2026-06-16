# 🌡️ ClimaTech - Sistema de Monitoramento de Clima IoT

Um aplicativo mobile completo para monitoramento e controle de dispositivos IoT de clima, desenvolvido com React Native (Expo) e Node.js.

## 📦 Estrutura do Projeto

```
├── app/                    # Aplicativo mobile (React Native/Expo)
├── api/                    # API backend (Node.js/Express)
├── components/             # Componentes reutilizáveis
├── contexts/               # Context API para estado global
├── constants/              # Constantes do app
├── hooks/                  # Custom hooks
└── assets/                 # Imagens e ícones
```

## 🚀 Iniciando Rápido

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Android Studio / Xcode (opcional, para emulador)

### Instalação

```bash
# Instalar dependências da app
npm install

# Instalar dependências da API
cd api
npm install
cd ..
```

### Rodando a Aplicação

**Terminal 1 - API Backend:**
```bash
cd api
npm run dev
# Saída: 🚀 Server running on http://localhost:3000
```

**Terminal 2 - Expo Metro:**
```bash
npm start
# Escanear QR code ou digitar exp://[SEU_IP]:8081
```

**Terminal 3 (Opcional) - Prisma Studio:**
```bash
cd api
npm run db:studio
# Abre GUI para ver/editar dados
```

## 🔐 Autenticação

### Credenciais de Teste

Email: `joao@example.com`
Senha: `senha123`

### Como Registrar Novo Usuário

Na tela de login, clique em "Criar uma Conta" e preencha:
- Nome completo
- Email
- Senha (mín. 6 caracteres)

## 📱 Funcionalidades

### ✅ Implementadas

- [x] **Autenticação**: Login/Register com JWT
- [x] **Dispositivos**: CRUD completo de dispositivos IoT
- [x] **Tarefas**: Criar, editar, concluir tarefas de manutenção
- [x] **Sincronização**: Dados sincronizados em tempo real com API
- [x] **Cache Local**: Funciona offline com AsyncStorage
- [x] **Temas**: Dark/Light mode automático
- [x] **Responsivo**: Funciona em qualquer tamanho de tela

### 🔄 Contextos Globais

- `AuthContext`: Gerencia autenticação e sessão
- `DevicesContext`: Sincroniza dispositivos com API
- `TasksContext`: Sincroniza tarefas com API
- `ThemeContext`: Gerencia tema (dark/light)

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Criar conta
- `GET /api/auth/verify` - Verificar token

### Dispositivos
- `GET /api/devices` - Listar dispositivos
- `GET /api/devices/:id` - Obter dispositivo
- `POST /api/devices` - Criar dispositivo
- `PUT /api/devices/:id` - Atualizar dispositivo
- `DELETE /api/devices/:id` - Deletar dispositivo

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `GET /api/tasks/:id` - Obter tarefa
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

Veja a documentação completa em [`api/API_DOCS.md`](api/API_DOCS.md)

## 🗄️ Banco de Dados

### Modelos

**User**
- `id` - Identificador único
- `email` - Email do usuário (único)
- `password` - Senha hasheada
- `name` - Nome do usuário
- `createdAt` - Data de criação
- `updatedAt` - Data de última atualização

**Device**
- `id` - Identificador único
- `name` - Nome do dispositivo
- `location` - Localização
- `type` - Tipo (climate, temperature, weather)
- `temperature` - Temperatura em °C
- `humidity` - Umidade em %
- `status` - Status (online/offline)
- `userId` - ID do proprietário

**Task**
- `id` - Identificador único
- `title` - Título da tarefa
- `completed` - Status de conclusão
- `userId` - ID do proprietário

### Comandos Úteis

```bash
cd api

# Ver dados no Prisma Studio
npm run db:studio

# Resetar banco (cuidado: apaga tudo!)
npm run db:reset

# Popular com dados de teste
npm run db:seed

# Ver status das migrações
npm run migrate:status
```

## 🔧 Configuração de Rede

### Para Testar em Múltiplos Dispositivos

1. **Editar `.env.local` na raiz do projeto:**
```bash
EXPO_PUBLIC_API_URL=http://[IP_DO_SEU_PC]:3000
```

2. **Descobrir IP do PC:**
```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig
```

3. **No celular:**
- Abrir app Expo Go
- Escanear QR code ou digitar `exp://[IP]:8081`

## 🔒 Segurança

- **JWT**: Tokens expirão em 7 dias
- **Hashing**: Senhas hasheadas com bcrypt
- **CORS**: Configurável por ambiente
- **Validação**: Todos os inputs validados
- **Autorização**: Usuários só acessam seus dados

## 📊 Arquitetura

```
┌────────────────────────────────────┐
│       Mobile App (React Native)    │
│  - Login/Register                  │
│  - Listar/Adicionar Dispositivos   │
│  - Gerenciar Tarefas               │
│  - Sincronização em Tempo Real     │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │  API Backend    │
        │  (Express)      │
        │                 │
        │  /api/auth      │
        │  /api/devices   │
        │  /api/tasks     │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │  SQLite DB      │
        │  (dev.db)       │
        │                 │
        │  Users          │
        │  Devices        │
        │  Tasks          │
        └─────────────────┘
```

## 🐛 Troubleshooting

### App não conecta na API

1. Verificar se a API está rodando: `curl http://localhost:3000/health`
2. Verificar firewall do PC (porta 3000)
3. Confirmar que PC e celular estão na mesma rede WiFi
4. Verificar `.env.local` tem o IP certo

### Erro "EADDRINUSE: address already in use :::3000"

```bash
# Matar processo usando porta 3000
lsof -i :3000
kill -9 [PID]

# Ou usar outra porta
PORT=3001 npm run dev
```

### Dados não sincronizam

1. Verificar conexão de internet
2. Fazer logout e login novamente
3. Limpar cache do app: `npm run reset-project`
4. Resetar banco: `cd api && npm run db:reset`

## 📖 Documentação Adicional

- [`api/API_DOCS.md`](api/API_DOCS.md) - Documentação completa da API
- [`ARQUITETURA.md`](ARQUITETURA.md) - Explicação da arquitetura
- [`SETUP_API.md`](SETUP_API.md) - Setup detalhado da API

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/AmazingFeature`
2. Commit suas mudanças: `git commit -m 'Add some AmazingFeature'`
3. Push para a branch: `git push origin feature/AmazingFeature`
4. Abra um Pull Request

## 📝 Roadmap

- [ ] Gráficos de temperatura/umidade
- [ ] Notificações em tempo real
- [ ] Controle de dispositivos (ligar/desligar)
- [ ] Histórico de dados
- [ ] Exportar dados em CSV/PDF
- [ ] App web (React)
- [ ] Integração com MQTT

## 📄 Licença

MIT

## 👨‍💻 Desenvolvido por

[Seu Nome/Time]

## 💬 Suporte

Para dúvidas ou problemas, abra uma issue ou entre em contato.

---

**Status**: 🚀 Em produção
**Última atualização**: Junho de 2025
