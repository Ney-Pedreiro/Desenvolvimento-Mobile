# 📚 API ClimaTech - Documentação Completa

## 🚀 Endpoints

A API está disponível em `http://[IP_DO_SERVIDOR]:3000`

### 🔐 Autenticação

#### POST `/api/auth/register`
Registrar novo usuário

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "clx123...",
      "email": "joao@example.com",
      "name": "João Silva"
    }
  }
}
```

#### POST `/api/auth/login`
Fazer login

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "clx123...",
      "email": "joao@example.com",
      "name": "João Silva"
    }
  }
}
```

#### GET `/api/auth/verify`
Verificar token (requer autenticação)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123...",
      "email": "joao@example.com",
      "name": "João Silva"
    }
  }
}
```

---

### 📱 Dispositivos

#### GET `/api/devices`
Listar todos os dispositivos do usuário

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx456...",
      "name": "Sensor Sala",
      "location": "Sala de Estar",
      "type": "climate",
      "temperature": 23.5,
      "humidity": 45,
      "status": "online",
      "userId": "clx123...",
      "createdAt": "2025-06-14T10:30:00Z",
      "updatedAt": "2025-06-14T10:30:00Z"
    }
  ]
}
```

#### GET `/api/devices/:id`
Obter dispositivo específico

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx456...",
    "name": "Sensor Sala",
    "location": "Sala de Estar",
    "type": "climate",
    "temperature": 23.5,
    "humidity": 45,
    "status": "online",
    "userId": "clx123...",
    "createdAt": "2025-06-14T10:30:00Z",
    "updatedAt": "2025-06-14T10:30:00Z"
  }
}
```

#### POST `/api/devices`
Criar novo dispositivo

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Sensor Quarto",
  "location": "Quarto Principal",
  "type": "climate",
  "temperature": 21.0,
  "humidity": 50
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx789...",
    "name": "Sensor Quarto",
    "location": "Quarto Principal",
    "type": "climate",
    "temperature": 21.0,
    "humidity": 50,
    "status": "offline",
    "userId": "clx123...",
    "createdAt": "2025-06-14T10:35:00Z",
    "updatedAt": "2025-06-14T10:35:00Z"
  }
}
```

#### PUT `/api/devices/:id`
Atualizar dispositivo

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Sensor Quarto Atualizado",
  "status": "online",
  "temperature": 22.5
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx789...",
    "name": "Sensor Quarto Atualizado",
    "location": "Quarto Principal",
    "type": "climate",
    "temperature": 22.5,
    "humidity": 50,
    "status": "online",
    "userId": "clx123...",
    "createdAt": "2025-06-14T10:35:00Z",
    "updatedAt": "2025-06-14T10:40:00Z"
  }
}
```

#### DELETE `/api/devices/:id`
Deletar dispositivo

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Device deleted successfully"
}
```

---

### ✅ Tarefas

#### GET `/api/tasks`
Listar todas as tarefas do usuário

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx111...",
      "title": "Verificar sensor da sala",
      "completed": false,
      "userId": "clx123...",
      "createdAt": "2025-06-14T10:45:00Z",
      "updatedAt": "2025-06-14T10:45:00Z"
    }
  ]
}
```

#### GET `/api/tasks/:id`
Obter tarefa específica

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx111...",
    "title": "Verificar sensor da sala",
    "completed": false,
    "userId": "clx123...",
    "createdAt": "2025-06-14T10:45:00Z",
    "updatedAt": "2025-06-14T10:45:00Z"
  }
}
```

#### POST `/api/tasks`
Criar nova tarefa

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Revisar temperatura do quarto"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "clx222...",
    "title": "Revisar temperatura do quarto",
    "completed": false,
    "userId": "clx123...",
    "createdAt": "2025-06-14T10:50:00Z",
    "updatedAt": "2025-06-14T10:50:00Z"
  }
}
```

#### PUT `/api/tasks/:id`
Atualizar tarefa

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "title": "Revisar temperatura do quarto (URGENTE)",
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "clx222...",
    "title": "Revisar temperatura do quarto (URGENTE)",
    "completed": true,
    "userId": "clx123...",
    "createdAt": "2025-06-14T10:50:00Z",
    "updatedAt": "2025-06-14T10:55:00Z"
  }
}
```

#### DELETE `/api/tasks/:id`
Deletar tarefa

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 🏥 Health Check

#### GET `/health`
Verificar se a API está funcionando

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-06-14T10:55:00Z"
}
```

---

## 🔒 Segurança

- **Autenticação**: JWT (JSON Web Token)
- **CORS**: Configurável via `.env.development`
- **Validação**: Todos os inputs são validados
- **Autorização**: Usuários só podem acessar seus próprios dados

---

## 📋 Códigos de Erro

| Código | Status HTTP | Descrição |
|--------|------------|-----------|
| `INVALID_EMAIL` | 400 | Email inválido |
| `WEAK_PASSWORD` | 400 | Senha fraca (mín. 6 caracteres) |
| `INVALID_INPUT` | 400 | Dados obrigatórios faltando |
| `USER_ALREADY_EXISTS` | 409 | Email já registrado |
| `INVALID_CREDENTIALS` | 401 | Email ou senha incorretos |
| `UNAUTHORIZED` | 401 | Token faltando ou inválido |
| `FORBIDDEN` | 403 | Sem permissão para acessar |
| `DEVICE_NOT_FOUND` | 404 | Dispositivo não encontrado |
| `TASK_NOT_FOUND` | 404 | Tarefa não encontrada |
| `NOT_FOUND` | 404 | Rota não encontrada |
| `INTERNAL_SERVER_ERROR` | 500 | Erro no servidor |

---

## 💾 Dados Persistem?

**SIM!** Todos os dados são salvos em um banco de dados SQLite (`dev.db`):

- ✅ Usuários
- ✅ Dispositivos
- ✅ Tarefas
- ✅ Tokens JWT (lógica)

Os dados persistem mesmo após reiniciar o servidor!

---

## 🧪 Testando a API

### Com cURL:
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Criar dispositivo
curl -X POST http://localhost:3000/api/devices \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sensor","location":"Sala","type":"climate"}'
```

### Com Postman/Insomnia:
1. Importe a URL: `http://localhost:3000`
2. Use os exemplos acima
3. Salve o token do login
4. Use `Bearer {token}` nas requisições

---

## 🚀 Iniciando a API

```bash
cd api
npm install
npm run dev
```

A API estará disponível em `http://localhost:3000`

