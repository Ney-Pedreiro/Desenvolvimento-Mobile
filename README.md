# Clima Tech

Aplicativo mobile para monitoramento de dispositivos climáticos e meteorológicos, desenvolvido com React Native e Expo.

## Sobre o projeto

O Clima Tech permite cadastrar e acompanhar sensores de temperatura, clima e condições meteorológicas em diferentes locais. O app conta com autenticação de usuário, gerenciamento de dispositivos via formulário ou leitura de QR Code, lista de manutenção e suporte a tema claro/escuro.

## Funcionalidades

- Autenticação (login e cadastro)
- Dashboard com listagem e busca de dispositivos
- Cadastro de dispositivo manual ou via câmera (QR Code)
- Tipos de sensor: Temperatura, Clima (temp + umidade) e Meteorológico externo
- Indicador de cor por faixa de temperatura
- Lista de tarefas de manutenção
- Configurações de tema (claro, escuro, sistema)
- Logout

## Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (SDK 54)
- [Expo Router](https://expo.github.io/router/) (navegação por arquivos)
- TypeScript

## Como executar

**Pré-requisitos:** Node.js e Expo CLI instalados.

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npx expo start
```

Escaneie o QR Code com o app **Expo Go** (Android/iOS) ou rode em emulador:

```bash
npx expo start --android
npx expo start --ios
```

## Estrutura de pastas

```
app/
  (tabs)/        # Telas principais (home, agenda, manutenção, configurações)
  login.tsx
  register.tsx
  add-device.tsx
  scan-device.tsx
components/
  atoms/         # Componentes base (texto, botão, input)
  molecules/     # Composições simples
  organisms/     # Componentes complexos (TopBar)
contexts/        # Estado global (Auth, Devices, Tasks, Theme)
```
