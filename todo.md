# Cassino Web3 - Project TODO

## Smart Contracts (Solidity/Arbitrum Sepolia)
- [x] Criar CasinoGame.sol com funções base (enterGame, payout, collectRake, fundSeedCapital)
- [x] Implementar integração com USDC (ERC20)
- [x] Adicionar validações de segurança e reentrancy guards
- [x] Criar contrato de teste e deploy script para Arbitrum Sepolia
- [x] Documentar endereços de contrato e mock USDC

## Frontend - Configuração Base
- [x] Instalar dependências Web3 (wagmi, viem, @web3modal/wagmi)
- [x] Configurar WalletConnect e MetaMask integration
- [x] Criar hook de conexão de carteira (useWeb3Wallet)
- [x] Implementar tema cyberpunk com Tailwind CSS
- [x] Configurar layout responsivo e navegação

## Frontend - Componentes UI Cyberpunk
- [x] Criar componentes de botões neon e cards
- [x] Implementar animações de entrada/saída
- [x] Criar componentes de formulário customizados
- [x] Implementar componente de conexão de carteira
- [x] Criar display de saldo e informações do jogador

## Jogo de Caça-níqueis (Slots)
- [x] Criar componente visual da máquina caça-níqueis
- [x] Implementar animação de spin dos rolos
- [x] Criar lógica de validação de vitória
- [ ] Integrar com smart contract para buy-in e payout
- [x] Implementar efeitos visuais de vitória (sons)
- [x] Adicionar histórico de spins

## Jogo de Blackjack
- [x] Criar componente visual do jogo (mesa, cartas, dealer)
- [x] Implementar lógica de jogo (hit, stand, double down)
- [x] Criar interface de apostas
- [ ] Integrar com smart contract para buy-in e payout
- [x] Implementar animação de cartas
- [x] Adicionar histórico de mãos

## Jogo Crash - NEON ROCKET
- [x] Criar componente visual do foguete neon
- [x] Implementar lógica de crash (exponencial)
- [x] CORRIGIR: Um único multiplicador (remover apostas duplas)
- [x] CORRIGIR: Botão RETIRAR para sacar antes do crash
- [x] CORRIGIR: Sistema de auto-retirada em multiplicador específico
- [x] Implementar animação de decolagem e crash
- [x] Adicionar efeitos de partículas e explosão
- [x] Criar histórico de rodadas com multiplicadores
- [x] Testes completos para garantir funcionamento

## Jogo Mines Neon
- [x] Criar componente visual do tabuleiro (5x5, 6x6, 8x8)
- [x] Implementar seleção de quantidade de minas (1-15)
- [x] Criar lógica de geração de minas aleatórias
- [x] Implementar cálculo de multiplicador progressivo
- [x] Criar animação de revelação de quadrados
- [x] Implementar efeito de explosão ao pisar em mina
- [x] Adicionar botão Cashout
- [x] Criar música tensa e envolvente
- [x] Implementar histórico de rodadas
- [x] Testes completos para garantir funcionamento
- [x] CORRIGIR: Tabuleiro fixo 5x5 com 8 minas fixas
- [x] CORRIGIR: Multiplicador +0.25x por casa aberta
- [x] CORRIGIR: Animação de "+0.25" flutuando no quadrado
- [x] CORRIGIR: Payout = Aposta × Multiplicador (sem 0.95)
- [x] CORRIGIR: Atualizar payout em tempo real

## Servidor Node.js - Lógica Off-chain
- [ ] Configurar servidor Express com WebSocket
- [ ] Implementar PRNG seguro para geração de números aleatórios
- [ ] Criar endpoints para validação de resultados de jogos
- [ ] Implementar sistema de seed management
- [ ] Adicionar logging e monitoramento

## Sistema de Prize Pool e Rake
- [ ] Implementar lógica de cálculo de rake (5%)
- [ ] Criar sistema de seed capital inicial
- [ ] Implementar distribuição automática de prêmios
- [ ] Criar painel de monitoramento do pool
- [ ] Adicionar alertas para reabastecimento

## Painel de Histórico e Estatísticas
- [ ] Criar página de histórico de apostas
- [ ] Implementar filtros por jogo e período
- [ ] Exibir estatísticas do jogador (total apostado, ganhos, taxa de vitória)
- [ ] Integrar com blockchain para verificação de transações
- [ ] Criar gráficos de performance

## Sistema de Avatares com IA
- [ ] Integrar com API de geração de imagens (usando Manus built-in)
- [ ] Criar lógica de geração baseada em endereço de carteira
- [ ] Implementar cache de avatares
- [ ] Exibir avatares no perfil do jogador
- [ ] Adicionar opção de regenerar avatar

## Sistema de Notificações
- [ ] Implementar notificações para o proprietário (grandes vitórias)
- [ ] Alertas de problemas no pool de prêmios
- [ ] Notificações de reabastecimento necessário
- [ ] Criar dashboard de eventos importantes
- [ ] Integrar com sistema de notificações do Manus

## Testes e Validação
- [ ] Testar conexão de carteira em Arbitrum Sepolia
- [ ] Testar fluxo completo de apostas (Slots + Blackjack + Crash + Mines)
- [ ] Validar cálculos de rake e payouts
- [ ] Testar animações e performance
- [ ] Testar responsividade em diferentes dispositivos

## Deploy e Documentação
- [x] Documentar processo de deploy do smart contract (DEPLOY_GUIDE.md)
- [x] Criar guia de migração para mainnet
- [x] Documentar variáveis de ambiente necessárias
- [x] Criar instruções de deploy no GitHub/Netlify
- [x] Preparar arquivo README com instruções completas
- [ ] Documentar como adicionar novos jogos
- [x] Publicar site online
- [x] Fornecer arquivos para produção

## Produção
- [ ] Revisar segurança de smart contracts
- [ ] Otimizar gas fees
- [ ] Configurar monitoramento de transações
- [ ] Preparar sistema de backup de dados
- [ ] Validar conformidade com regulamentações
