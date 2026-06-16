# Configuração da API para Teste Remoto

## 🚀 Endereço da API do Professor

A app está configurada para se conectar à API no endereço: **http://192.168.6.191:3000**

## 📱 Passo a Passo para Testar no Celular do Professor

### 1. **API rodando no PC do professor**
```bash
cd api
npm install
npm run dev
```

A API deve estar rodando em: `http://192.168.6.191:3000`

### 2. **Certificar que a rede está correta**
- Ambos os dispositivos (PC e celular) precisam estar na **mesma rede WiFi**
- Verificar o IP do PC (Windows: `ipconfig`, Linux/Mac: `ifconfig`)

### 3. **Atualizar arquivo de configuração se necessário**
Se o IP mudar, editar o arquivo `.env.local` na raiz do projeto:

```bash
EXPO_PUBLIC_API_URL=http://[IP_DO_PROFESSOR]:3000
```

### 4. **Iniciar o Expo**
```bash
npm start
```

Depois abrir no celular com o app do Expo.

## ✅ Dados Persistem?

Sim! A API usa **SQLite** (`dev.db`) que persiste os dados localmente no PC do professor.

- ✅ Login/Register → salvo no banco de dados
- ✅ Dispositivos → salvo no banco de dados  
- ✅ Tarefas → salvo no banco de dados

## 🔒 CORS Configurado

O arquivo `api/.env.development` foi atualizado para aceitar requisições de:
- `http://192.168.6.191:8081`
- `http://192.168.6.191:19000`
- `http://192.168.6.191:19001`
- Localhost (para desenvolvimento local)

## 🐛 Se não funcionar

1. Verificar se o firewall do PC não está bloqueando a porta 3000
2. Testar a conexão: abrir `http://192.168.6.191:3000/health` no navegador do celular
3. Ver os logs da API no terminal

