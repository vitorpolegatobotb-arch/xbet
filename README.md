# 🎰 Cyberpunk Web3 Casino

Um cassino descentralizado completo com tema cyberpunk, rodando na rede Arbitrum com transações em USDC. Inclui jogos animados, integração com carteiras Web3 e smart contracts para gerenciamento de apostas.

## ✨ Características

- 🎮 **Jogos Animados**
  - Caça-níqueis (Slots) com animações suaves
  - Blackjack com lógica completa (hit, stand, double down)
  - Crash Game (NEON ROCKET) com retirada antes do crash
  - Mines Neon com tabuleiro configurável e multiplicador progressivo
  - House edge de 5% em Slots, 2% em Blackjack, 5% em Crash, 5% em Mines

- 🔗 **Integração Web3**
  - Suporte a MetaMask e WalletConnect
  - Transações seguras na blockchain
  - Histórico completo de apostas on-chain

- 🎨 **Interface Cyberpunk**
  - Design neon com cores ciano e magenta
  - Animações fluidas e efeitos visuais
  - Responsivo para desktop e mobile
  - Fonte Orbitron customizada

- 💰 **Sistema de Apostas**
  - Seed capital inicial garantido
  - Prize pool dinâmico
  - Rake automático de 5%
  - Notificações de eventos importantes

- 🌐 **Multi-Rede**
  - Arbitrum Sepolia (testnet com MockUSDC)
  - Arbitrum One (mainnet com USDC real)
  - Fácil migração entre redes

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)
- MetaMask ou WalletConnect
- ETH de teste para Arbitrum Sepolia

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cyberpunk-web3-casino.git
cd cyberpunk-web3-casino

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp client/.env.example client/.env.local

# Edite client/.env.local com seus valores:
# VITE_WALLETCONNECT_PROJECT_ID=seu_project_id
# VITE_CASINO_CONTRACT_ADDRESS=seu_contrato
# VITE_USDC_CONTRACT_ADDRESS=seu_usdc
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
pnpm dev

# O site abrirá em http://localhost:3001
```

### Build para Produção

```bash
# Compile o projeto
pnpm build

# Visualize a build
pnpm start
```

## 📋 Estrutura do Projeto

```
cyberpunk-web3-casino/
├── contracts/                 # Smart Contracts Solidity
│   ├── CasinoGame.sol        # Contrato principal
│   ├── MockUSDC.sol          # Token para testes
│   └── deploy.js             # Script de deploy
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── SlotsGame.tsx  # Jogo de slots
│   │   │   ├── RouletteGame.tsx # Jogo de roleta
│   │   │   └── WalletConnect.tsx # Conexão Web3
│   │   ├── pages/
│   │   │   └── Casino.tsx     # Página principal
│   │   ├── hooks/
│   │   │   └── useWeb3Wallet.ts # Hook de carteira
│   │   ├── lib/
│   │   │   └── web3Config.ts  # Configuração Web3
│   │   └── index.css          # Estilos cyberpunk
│   └── .env.example           # Variáveis de exemplo
├── server/                    # Backend Node.js
│   ├── routers.ts            # Endpoints tRPC
│   └── db.ts                 # Queries do banco
├── drizzle/                   # Migrações de banco
├── DEPLOY_GUIDE.md           # Guia completo de deploy
└── README.md                 # Este arquivo
```

## 🎮 Como Jogar

### 1. Conectar Carteira
- Clique em "Conectar Carteira"
- Selecione MetaMask ou WalletConnect
- Confirme a conexão

### 2. Obter USDC de Teste
- Para Sepolia: Acesse o contrato MockUSDC em Remix
- Clique em "mint" e insira seu endereço
- Você receberá 10000 USDC de teste

### 3. Escolher um Jogo
- **Caça-níqueis:** Gire os rolos e tente ganhar 3 símbolos iguais
- **Blackjack:** Chegue a 21 sem ultrapassar. Blackjack (21 em 2 cartas) paga 2.5x!
- **NEON ROCKET:** Decole o foguete e retire antes do crash para ganhar!
- **MINES NEON:** Clique nos quadrados seguros! Quanto mais minas, maior o risco e recompensa

### 4. Fazer Apostas
- Insira o valor da aposta (1-1000 USDC)
- Clique em "INICIAR JOGO", "GIRAR", "DECOLAR" ou "COMEÇAR"
- Use HIT/STAND no Blackjack, clique RETIRAR no Crash, clique nos quadrados no Mines
- Veja o resultado e seu saldo atualizar

## 💡 Configuração Web3

### WalletConnect Project ID
```
de212cc59e8b3a1e0d67265121b2bddd
```

### Endereços de Contrato

**Arbitrum Sepolia (Testnet):**
```
CasinoGame: [Seu endereço após deploy]
MockUSDC: [Seu endereço após deploy]
```

**Arbitrum One (Mainnet):**
```
CasinoGame: [Seu endereço após deploy]
USDC: 0xaf88d065e77c8cC2239327C5EDb3A432268e5831
```

## 📖 Documentação

### Deploy
Veja [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) para instruções completas de:
- Deploy dos smart contracts em Remix
- Configuração do frontend
- Migração para mainnet
- Deploy no GitHub/Netlify

### Smart Contracts
- **CasinoGame.sol:** Gerencia apostas, prêmios e rake
- **MockUSDC.sol:** Token ERC20 para testes

### API tRPC
Os endpoints disponíveis estão em `server/routers.ts`

## 🔐 Segurança

- ✅ Smart contracts com ReentrancyGuard
- ✅ Validação de entrada em todos os endpoints
- ✅ Transações seguras com Wagmi
- ✅ Variáveis sensíveis em .env.local
- ✅ Histórico completo de transações

### Antes de Produção
- [ ] Auditar smart contracts
- [ ] Testar extensivamente em testnet
- [ ] Implementar rate limiting
- [ ] Configurar monitoramento
- [ ] Implementar backup de dados

## 🌐 Redes Suportadas

| Rede | Chain ID | RPC | Token |
|------|----------|-----|-------|
| Arbitrum Sepolia | 421614 | https://sepolia-rollup.arbitrum.io/rpc | MockUSDC |
| Arbitrum One | 42161 | https://arb1.arbitrum.io/rpc | USDC Real |

## 📊 Estatísticas do Jogo

| Jogo | House Edge | Min Bet | Max Bet | Payout |
|------|-----------|---------|---------|--------|
| Caça-níqueis | 5% | 1 USDC | 1000 USDC | 3x |
| Blackjack | 2% | 1 USDC | 1000 USDC | 2x-2.5x |
| Crash (NEON ROCKET) | 5% | 1 USDC | 1000 USDC | Variável (1.01x-100x) |
| Mines Neon | 5% | 1 USDC | 1000 USDC | Variável (1.1x-100x) |

## 🛠️ Tecnologias

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- Wagmi + Viem
- WalletConnect
- Lucide Icons

### Backend
- Node.js
- Express
- tRPC
- Drizzle ORM
- MySQL/TiDB

### Smart Contracts
- Solidity 0.8.20
- OpenZeppelin Contracts
- Arbitrum

## 📝 Variáveis de Ambiente

```env
# Web3
VITE_WALLETCONNECT_PROJECT_ID=seu_project_id
VITE_CASINO_CONTRACT_ADDRESS=0x...
VITE_USDC_CONTRACT_ADDRESS=0x...

# API
VITE_API_URL=http://localhost:3001/api
```

## 🚨 Troubleshooting

### Erro: "Network mismatch"
- Verifique se o MetaMask está na rede correta
- Adicione a rede ao MetaMask

### Erro: "Contract not found"
- Verifique o endereço do contrato
- Confirme que está na rede correta

### Transação lenta
- Aumente o gas price
- Verifique em https://arbiscan.io

## 📞 Suporte

- 📖 Leia [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
- 🔗 Visite https://docs.arbitrum.io
- 💬 Procure ajuda na comunidade Arbitrum

## 📄 Licença

MIT

## 🙏 Agradecimentos

- Arbitrum por fornecer uma rede rápida e barata
- OpenZeppelin pelos contratos seguros
- Wagmi pela integração Web3 simplificada
- Comunidade Ethereum/Arbitrum

---

**Status:** ✅ Pronto para Deploy  
**Versão:** 1.0.0  
**Data:** 2024

Divirta-se jogando! 🎰✨
