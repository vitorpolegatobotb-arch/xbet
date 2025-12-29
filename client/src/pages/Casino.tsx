import { useState } from 'react';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { WalletConnect } from '@/components/WalletConnect';
import { SlotsGame } from '@/components/SlotsGame';
import { BlackjackGame } from '@/components/BlackjackGame';
import { CrashGame } from '@/components/CrashGame';
import { MinesGame } from '@/components/MinesGame';
import { RiskWarningCard } from '@/components/RiskWarningCard';
import { AdminPanel } from '@/components/AdminPanel';
import { RankingPage } from '@/components/RankingPage';

import { Settings, Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Zap, Coins, TrendingUp } from 'lucide-react';

/**
 * Página Principal do Cassino Web3
 * Lobby com seleção de jogos e integração Web3
 */

type GameType = 'lobby' | 'slots' | 'blackjack' | 'crash' | 'mines' | 'admin' | 'ranking';

const gameNames: Record<GameType, string> = {
  lobby: 'Lobby',
  slots: 'Caça-Níqueis',
  blackjack: 'Blackjack',
  crash: 'Neon Rocket',
  mines: 'Diamond Mines',
  admin: 'Admin',
  ranking: 'Ranking',
};

interface PlayerStats {
  totalBet: number;
  totalWinnings: number;
  balance: number;
}

export default function Casino() {
  const { isConnected, address } = useWeb3Wallet();
  const [currentGame, setCurrentGame] = useState<GameType>('lobby');
  const [pendingGame, setPendingGame] = useState<GameType | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalBet: 0,
    totalWinnings: 0,
    balance: 1000, // Mock balance
  });

  const handleGameResult = (won: boolean, payout: number) => {
    setPlayerStats((prev) => ({
      ...prev,
      totalBet: prev.totalBet + betAmount,
      totalWinnings: prev.totalWinnings + payout,
      balance: prev.balance - betAmount + payout,
    }));
  };

  const handleSelectGame = (game: GameType) => {
    if (game === 'admin' || game === 'ranking') {
      setCurrentGame(game);
    } else {
      setPendingGame(game);
    }
  };

  const handleContinueGame = () => {
    if (pendingGame) {
      setCurrentGame(pendingGame);
      setPendingGame(null);
    }
  };

  const handleCancelGame = () => {
    setPendingGame(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">House Casino</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              onClick={() => setCurrentGame('ranking')} 
              variant="outline" 
              size="sm"
              className="hidden sm:flex"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Ranking
            </Button>
            {address?.toLowerCase() === '0xad1e0c6495ac38d3b88f2ad32f963e491926ec33'.toLowerCase() && (
              <Button 
                onClick={() => setCurrentGame('admin')} 
                variant="outline" 
                size="sm"
                className="hidden sm:flex"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 sm:py-8">
        {!isConnected ? (
          // Tela de Conexão
          <div className="max-w-2xl mx-auto">
            <div className="bg-card/50 border border-border rounded-lg p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
                Bem-vindo ao House Casino
              </h2>
              <p className="text-muted-foreground mb-8 text-base sm:text-lg">
                Conecte sua carteira para começar a jogar e ganhar prêmios em USDC na rede Arbitrum
              </p>
              <div className="bg-background/50 border border-border rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Recursos</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>✓ Jogos modernos com gráficos profissionais</li>
                  <li>✓ Transações seguras na blockchain</li>
                  <li>✓ Suporte a MetaMask e WalletConnect</li>
                  <li>✓ Histórico completo de apostas</li>
                  <li>✓ Comunidade ativa em tempo real</li>
                </ul>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Usando Arbitrum Sepolia (testnet) com mock USDC para testes
              </p>
              <WalletConnect />
            </div>
          </div>
        ) : currentGame === 'lobby' ? (
          // Lobby
          <div>
            {/* Jackpot Display */}
            <div className="bg-card/50 border border-border rounded-lg p-4 sm:p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">JACKPOT ACUMULADO</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-500">$5,000.00 USDC</p>
                </div>
              </div>
              <div className="text-right w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-muted-foreground">Próxima Distribuição em</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">06d 23h 59m 59s</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card/50 border border-border rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">Saldo</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">${playerStats.balance.toFixed(2)}</div>
              </div>

              <div className="bg-card/50 border border-border rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">Total Apostado</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">${playerStats.totalBet.toFixed(2)}</div>
              </div>

              <div className="bg-card/50 border border-border rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">Total Ganho</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">${playerStats.totalWinnings.toFixed(2)}</div>
              </div>
            </div>

            {/* Endereço da Carteira */}
            <div className="bg-card/50 border border-border rounded-lg p-4 sm:p-6 mb-8 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Carteira Conectada</p>
              <p className="font-mono text-primary break-all text-xs sm:text-sm">{address}</p>
            </div>

            {/* Seleção de Jogos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {/* Caça-níqueis */}
              <div
                className="bg-card/50 border border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-card transition-all group"
                onClick={() => handleSelectGame('slots')}
              >
                <div className="text-5xl text-center mb-4">🎰</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-foreground">
                  CAÇA-NÍQUEIS
                </h3>
                <p className="text-muted-foreground text-center mb-4 text-sm">
                  Gire os rolos e tente ganhar o jackpot!
                </p>
                <div className="bg-background/50 rounded p-3 mb-4 text-center">
                  <p className="text-xs text-muted-foreground">House Edge</p>
                  <p className="text-lg font-bold text-primary">5%</p>
                </div>
                <Button className="w-full">Jogar Agora</Button>
              </div>

              {/* Blackjack */}
              <div
                className="bg-card/50 border border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-card transition-all group"
                onClick={() => handleSelectGame('blackjack')}
              >
                <div className="text-5xl text-center mb-4">🃏</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-foreground">
                  BLACKJACK
                </h3>
                <p className="text-muted-foreground text-center mb-4 text-sm">
                  Chegue a 21 sem ultrapassar. Blackjack paga 2.5x!
                </p>
                <div className="bg-background/50 rounded p-3 mb-4 text-center">
                  <p className="text-xs text-muted-foreground">House Edge</p>
                  <p className="text-lg font-bold text-primary">2%</p>
                </div>
                <Button className="w-full">Jogar Agora</Button>
              </div>

              {/* Crash Game */}
              <div
                className="bg-card/50 border border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-card transition-all group"
                onClick={() => handleSelectGame('crash')}
              >
                <div className="text-5xl text-center mb-4">🚀</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-foreground">
                  NEON ROCKET
                </h3>
                <p className="text-muted-foreground text-center mb-4 text-sm">
                  Decole e retire antes do crash para ganhar!
                </p>
                <div className="bg-background/50 rounded p-3 mb-4 text-center">
                  <p className="text-xs text-muted-foreground">House Edge</p>
                  <p className="text-lg font-bold text-primary">5%</p>
                </div>
                <Button className="w-full">Jogar Agora</Button>
              </div>

              {/* Mines Game */}
              <div
                className="bg-card/50 border border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-card transition-all group"
                onClick={() => handleSelectGame('mines')}
              >
                <div className="text-5xl text-center mb-4">💎</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-foreground">
                  DIAMOND MINES
                </h3>
                <p className="text-muted-foreground text-center mb-4 text-sm">
                  Clique nos quadrados seguros! Mais minas = maior risco
                </p>
                <div className="bg-background/50 rounded p-3 mb-4 text-center">
                  <p className="text-xs text-muted-foreground">House Edge</p>
                  <p className="text-lg font-bold text-primary">5%</p>
                </div>
                <Button className="w-full">Jogar Agora</Button>
              </div>
            </div>

            {/* Informações */}
            <div className="bg-card/50 border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">ℹ️ Informações</h3>
              <div className="space-y-3 text-muted-foreground text-sm">
                <p>
                  <strong className="text-foreground">Rede:</strong> Arbitrum Sepolia (Testnet)
                </p>
                <p>
                  <strong className="text-foreground">Token:</strong> Mock USDC (6 decimais)
                </p>
                <p>
                  <strong className="text-foreground">House Edge:</strong> 5% em Slots, 2% em Blackjack, 5% em Crash, 5% em Mines
                </p>
                <p>
                  <strong className="text-foreground">Seed Capital:</strong> Garante prêmios iniciais atraentes
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Tela de Jogo
          <div>
            <Button
              onClick={() => setCurrentGame('lobby')}
              variant="outline"
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Lobby
            </Button>

            {currentGame === 'slots' && (
              <SlotsGame
                gameType="slots"
                betAmount={betAmount}
                onBet={setBetAmount}
                onResult={handleGameResult}
              />
            )}

            {currentGame === 'blackjack' && (
              <BlackjackGame
                gameType="blackjack"
                betAmount={betAmount}
                onBet={setBetAmount}
                onResult={handleGameResult}
              />
            )}

            {currentGame === 'crash' && (
              <CrashGame
                gameType="crash"
                betAmount={betAmount}
                onBet={setBetAmount}
                onResult={handleGameResult}
              />
            )}

            {currentGame === 'mines' && (
              <MinesGame
                gameType="mines"
                betAmount={betAmount}
                onBet={setBetAmount}
                onResult={handleGameResult}
              />
            )}

            {currentGame === 'admin' && (
              <AdminPanel />
            )}

            {currentGame === 'ranking' && (
              <RankingPage />
            )}
          </div>
        )}

      </main>

      {pendingGame && (
        <RiskWarningCard
          gameName={gameNames[pendingGame as keyof typeof gameNames]}
          onContinue={handleContinueGame}
          onCancel={handleCancelGame}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12 sm:mt-20">
        <div className="container py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            House Casino © 2024 | Powered by Arbitrum | Web3 Descentralizado
          </p>
        </div>
      </footer>
    </div>
  );
}
