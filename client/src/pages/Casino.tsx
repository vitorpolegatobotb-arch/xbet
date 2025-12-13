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

import { Settings, Trophy } from 'lucide-react';
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
      <header className="border-b border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-orbitron font-bold neon-text">CYBERPUNK CASINO</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setCurrentGame('ranking')} variant="outline" className="btn-neon-outline">
              <Trophy className="w-4 h-4 mr-2" />
              Ranking
            </Button>
            {address?.toLowerCase() === '0xad1e0c6495ac38d3b88f2ad32f963e491926ec33'.toLowerCase() && (
              <Button onClick={() => setCurrentGame('admin')} variant="outline" className="btn-neon-outline">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {!isConnected ? (
          // Tela de Conexão
          <div className="max-w-2xl mx-auto">
            <div className="card-neon text-center">
              <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-6 animate-pulse-scale" />
              <h2 className="text-3xl font-orbitron font-bold mb-4 neon-text">
                Bem-vindo ao Cassino Web3
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Conecte sua carteira para começar a jogar e ganhar prêmios em USDC na rede Arbitrum
              </p>
              <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-cyan-300">Recursos</h3>
                <ul className="text-left space-y-2 text-gray-300">
                  <li>✓ Jogos animados com gráficos cyberpunk</li>
                  <li>✓ Transações seguras na blockchain</li>
                  <li>✓ Suporte a MetaMask e WalletConnect</li>
                  <li>✓ Histórico completo de apostas</li>
                  <li>✓ Geração de avatares únicos</li>
                </ul>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                Usando Arbitrum Sepolia (testnet) com mock USDC para testes
              </p>
            </div>
          </div>
        ) : currentGame === 'lobby' ? (
          // Lobby
          <div>
            {/* Jackpot Display */}
            <div className="card-neon mb-8 p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-yellow-400 animate-pulse" />
                <div>
                  <p className="text-sm text-gray-400">JACKPOT ACUMULADO</p>
                  <p className="text-2xl font-orbitron font-bold text-yellow-400">$5,000.00 USDC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Próxima Distribuição em</p>
                <p className="text-2xl font-orbitron font-bold text-red-400">06d 23h 59m 59s</p>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="card-neon">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Saldo</span>
                </div>
                <div className="text-3xl font-bold neon-text">${playerStats.balance.toFixed(2)}</div>
              </div>

              <div className="card-neon">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Total Apostado</span>
                </div>
                <div className="text-3xl font-bold neon-text">${playerStats.totalBet.toFixed(2)}</div>
              </div>

              <div className="card-neon">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-400">Total Ganho</span>
                </div>
                <div className="text-3xl font-bold neon-text">${playerStats.totalWinnings.toFixed(2)}</div>
              </div>
            </div>

            {/* Endereço da Carteira */}
            <div className="card-neon mb-8 text-center">
              <p className="text-sm text-gray-400 mb-2">Carteira Conectada</p>
              <p className="font-mono text-cyan-300 break-all">{address}</p>
            </div>

            {/* Seleção de Jogos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Caça-níqueis */}
              <div
                className="card-neon cursor-pointer hover:border-cyan-500 transition-all group"
                onClick={() => handleSelectGame('slots')}
              >
                <div className="text-5xl text-center mb-4 group-hover:animate-bounce-in">🎰</div>
                <h3 className="text-2xl font-orbitron font-bold text-center mb-2 neon-text">
                  CAÇA-NÍQUEIS
                </h3>
                <p className="text-gray-300 text-center mb-4">
                  Gire os rolos e tente ganhar o jackpot!
                </p>
                <div className="bg-gray-800/50 rounded p-3 mb-4 text-center">
                  <p className="text-sm text-gray-400">House Edge</p>
                  <p className="text-lg font-bold text-cyan-300">5%</p>
                </div>
                <Button className="w-full btn-neon">Jogar Agora</Button>
              </div>

              {/* Blackjack */}
              <div
                className="card-neon cursor-pointer hover:border-cyan-500 transition-all group"
                onClick={() => handleSelectGame('blackjack')}
              >
                <div className="text-5xl text-center mb-4 group-hover:animate-bounce-in">🃏</div>
                <h3 className="text-2xl font-orbitron font-bold text-center mb-2 neon-text">
                  BLACKJACK
                </h3>
                <p className="text-gray-300 text-center mb-4">
                  Chegue a 21 sem ultrapassar. Blackjack paga 2.5x!
                </p>
                <div className="bg-gray-800/50 rounded p-3 mb-4 text-center">
                  <p className="text-sm text-gray-400">House Edge</p>
                  <p className="text-lg font-bold text-cyan-300">2%</p>
                </div>
                <Button className="w-full btn-neon">Jogar Agora</Button>
              </div>

              {/* Crash Game */}
              <div
                className="card-neon cursor-pointer hover:border-cyan-500 transition-all group"
                onClick={() => handleSelectGame('crash')}
              >
                <div className="text-5xl text-center mb-4 group-hover:animate-bounce-in">🚀</div>
                <h3 className="text-2xl font-orbitron font-bold text-center mb-2 neon-text">
                  NEON ROCKET
                </h3>
                <p className="text-gray-300 text-center mb-4">
                  Decole e retire antes do crash para ganhar!
                </p>
                <div className="bg-gray-800/50 rounded p-3 mb-4 text-center">
                  <p className="text-sm text-gray-400">House Edge</p>
                  <p className="text-lg font-bold text-cyan-300">5%</p>
                </div>
                <Button className="w-full btn-neon">Jogar Agora</Button>
              </div>

              {/* Mines Game */}
              <div
                className="card-neon cursor-pointer hover:border-cyan-500 transition-all group"
                onClick={() => handleSelectGame('mines')}
              >
                <div className="text-5xl text-center mb-4 group-hover:animate-bounce-in">💎</div>
                <h3 className="text-2xl font-orbitron font-bold text-center mb-2 neon-text">
                  DIAMOND MINES
                </h3>
                <p className="text-gray-300 text-center mb-4">
                  Clique nos quadrados seguros! Mais minas = maior risco
                </p>
                <div className="bg-gray-800/50 rounded p-3 mb-4 text-center">
                  <p className="text-sm text-gray-400">House Edge</p>
                  <p className="text-lg font-bold text-cyan-300">5%</p>
                </div>
                <Button className="w-full btn-neon">Jogar Agora</Button>
              </div>
            </div>

            {/* Informações */}
            <div className="card-neon">
              <h3 className="text-lg font-orbitron font-bold mb-4 neon-text">ℹ️ Informações</h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <strong className="text-cyan-300">Rede:</strong> Arbitrum Sepolia (Testnet)
                </p>
                <p>
                  <strong className="text-cyan-300">Token:</strong> Mock USDC (6 decimais)
                </p>
                <p>
                  <strong className="text-cyan-300">House Edge:</strong> 5% em Slots, 2% em Blackjack, 5% em Crash, 5% em Mines
                </p>
                <p>
                  <strong className="text-cyan-300">Seed Capital:</strong> Garante prêmios iniciais atraentes
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
              ← Voltar ao Lobby
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
      <footer className="border-t border-cyan-500/30 bg-gray-900/50 mt-12">
        <div className="container py-6 text-center text-sm text-gray-400">
          <p>
            Cassino Web3 © 2024 | Powered by Arbitrum | Tema Cyberpunk
          </p>
        </div>
      </footer>
    </div>
  );
}
