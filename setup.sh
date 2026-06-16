#!/bin/bash

# Script para setup completo do projeto ClimaTech

echo "🚀 Setup do Projeto ClimaTech"
echo "=============================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "📝 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale em https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Instalar dependências da app
echo ""
echo "📦 Instalando dependências da app..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências da app${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependências da app instaladas${NC}"

# Instalar dependências da API
echo ""
echo "📦 Instalando dependências da API..."
cd api
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências da API${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependências da API instaladas${NC}"

# Criar .env.development se não existir
if [ ! -f ".env.development" ]; then
    echo ""
    echo "⚙️  Criando arquivo .env.development..."
    cat > .env.development << EOF
NODE_ENV=development
PORT=3000

# Database (SQLite)
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=clima-tech-dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8081,http://localhost:3000,http://localhost:19000,http://localhost:19001,exp://192.168.6.191:8081,http://192.168.6.191:8081,http://192.168.6.191:19000,http://192.168.6.191:19001
EOF
    echo -e "${GREEN}✅ Arquivo .env.development criado${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env.development já existe${NC}"
fi

# Aplicar migrações
echo ""
echo "🗄️  Aplicando migrações do banco de dados..."
npx prisma migrate deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao aplicar migrações${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Migrações aplicadas${NC}"

# Seedar banco de dados
echo ""
echo "🌱 Populando banco de dados com dados de teste..."
npx tsx prisma/seed.ts
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao seedar banco de dados${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Banco de dados populado${NC}"

# Voltar para raiz
cd ..

# Criar .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚙️  Criando arquivo .env.local..."
    cat > .env.local << EOF
# API Backend URL (MUDE PARA O IP DO SEU PC!)
# 
# Exemplo se o PC está em 192.168.6.191:
EXPO_PUBLIC_API_URL=http://192.168.6.191:3000
#
# Se o PC está em outro IP, substitua:
# EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3000
#
# Para descobrir seu IP:
# - Windows: ipconfig (procure por "IPv4 Address")
# - Linux/Mac: ifconfig ou hostname -I
EOF
    echo -e "${GREEN}✅ Arquivo .env.local criado${NC}"
    echo -e "${YELLOW}⚠️  Edite o .env.local com seu IP do PC!${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env.local já existe${NC}"
fi

# Resumo final
echo ""
echo "=============================="
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo "=============================="
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1️⃣  Terminal 1 - Rodar a API:"
echo "   cd api"
echo "   npm run dev"
echo ""
echo "2️⃣  Terminal 2 - Rodar o Expo:"
echo "   npm start"
echo ""
echo "3️⃣  No celular:"
echo "   - Abrir Expo Go"
echo "   - Escanear QR code ou digitar exp://[SEU_IP]:8081"
echo ""
echo "📚 Credenciais de teste:"
echo "   Email: joao@example.com"
echo "   Senha: senha123"
echo ""
echo "📖 Documentação:"
echo "   - API: api/API_DOCS.md"
echo "   - Arquitetura: ARQUITETURA.md"
echo "   - Setup: SETUP_API.md"
echo ""
