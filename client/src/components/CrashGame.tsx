import { useState, useCallback, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Coins, Settings, Zap, RotateCcw, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';


/**
 * Componente do Jogo Crash - NEON ROCKET (CORRIGIDO)
 * Foguete neon que decola com um multiplicador único
 * Jogador deve retirar antes do crash para ganhar
 * Sistema de auto-retirada opcional
 */

interface GameState {
  gameActive: boolean;
  multiplier: number;
  crashed: boolean;
  crashMultiplier: number | null;
  playerRetired: boolean;
  payout: number;
  status: 'idle' | 'playing' | 'won' | 'lost';
}

const generateCrashPoint = (): number => {
  // Gera um ponto de crash aleatório entre 1.01 e 100x
  // Com probabilidade maior para valores menores (mais realista)
  const random = Math.random();
  const crash = Math.pow(random, -1.1) * 1.01;
  return Math.min(crash, 100);
};

interface CrashGameProps {
  gameType: 'crash';
  betAmount: number;
  onBet: (amount: number) => void;
  onResult: (won: boolean, payout: number) => void;
  isLoading?: boolean;
}

export function CrashGame({ betAmount, onBet, onResult, isLoading = false, gameType }: CrashGameProps) {
  const { data: gameLimits } = trpc.admin.getGameLimits.useQuery();
  const { data: gamePools } = trpc.admin.getGamePools.useQuery();

  const minBet = gameLimits?.[gameType]?.minBet ?? 0.5;
  const maxBet = gameLimits?.[gameType]?.maxBet ?? 200;
  const poolLiquidity = gamePools?.[gameType]?.liquidity ?? 5000;
  const [gameState, setGameState] = useState<GameState>({
    gameActive: false,
    multiplier: 1.0,
    crashed: false,
    crashMultiplier: null,
    playerRetired: false,
    payout: 0,
    status: 'idle',
  });

  const [autoRetireMultiplier, setAutoRetireMultiplier] = useState(2.0);
  const [useAutoRetire, setUseAutoRetire] = useState(false);
  const [gameHistory, setGameHistory] = useState<Array<{ crash: number; result: 'won' | 'lost'; multiplier?: number }>>([]);
  const [rocketY, setRocketY] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const crashPointRef = useRef<number>(0);

  const playSound = useCallback((type: 'launch' | 'crash' | 'win') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'launch') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else if (type === 'crash') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'win') {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (e) {
      console.warn('Audio context not available');
    }
  }, []);

  const startGame = useCallback(() => {
    if (betAmount <= 0 || gameState.gameActive) return;

    const crashPoint = generateCrashPoint();
    crashPointRef.current = crashPoint;

    setGameState({
      gameActive: true,
      multiplier: 1.0,
      crashed: false,
      crashMultiplier: null,
      playerRetired: false,
      payout: 0,
      status: 'playing',
    });

    setRocketY(0);
    playSound('launch');

    // Animação do foguete e multiplicador
    let currentMultiplier = 1.0;
    let frameCount = 0;

    gameLoopRef.current = setInterval(() => {
      frameCount++;
      currentMultiplier = 1.0 + (frameCount / 100) * 0.5; // Crescimento exponencial

      setRocketY((frameCount * 2) % 400);
      
      setGameState((prev) => {
        const newState = {
          ...prev,
          multiplier: currentMultiplier,
        };

        // Verificar auto-retirada
        if (useAutoRetire && currentMultiplier >= autoRetireMultiplier && !prev.playerRetired) {
          handleRetire(currentMultiplier, newState);
          return newState;
        }

        return newState;
      });

      // Verificar crash
      if (currentMultiplier >= crashPoint) {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = null;
        }
        playSound('crash');

        // Gerar partículas de explosão
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
          id: i,
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
        }));
        setParticles(newParticles);

        setGameState((prev) => {
          if (prev.playerRetired) {
            // Jogador já retirou, então ganhou
            return prev;
          } else {
            // Jogador não retirou, perdeu tudo
            const newState = {
              ...prev,
              crashed: true,
              gameActive: false,
              crashMultiplier: crashPoint,
              status: 'lost' as const,
              payout: 0,
            };

            setGameHistory((history) => [
              {
                crash: crashPoint,
                result: 'lost',
              },
              ...history.slice(0, 9),
            ]);

            onResult(false, 0);
            return newState;
          }
        });

        // Limpar partículas após 1 segundo
        setTimeout(() => setParticles([]), 1000);
      }
    }, 50);
  }, [betAmount, gameState.gameActive, useAutoRetire, autoRetireMultiplier, playSound, onResult]);

  const handleRetire = useCallback((currentMultiplier: number, currentGameState?: GameState) => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    playSound('win');

    // Calcular payout: Aposta × Multiplicador (a dedução do rake será feita pelo contrato)
    const payout = betAmount * currentMultiplier;

    const newState = {
      gameActive: false,
      multiplier: currentMultiplier,
      crashed: false,
      crashMultiplier: null,
      playerRetired: true,
      payout: payout,
      status: 'won' as const,
    };

    setGameState(newState);

    setGameHistory((history) => [
      {
        crash: currentMultiplier,
        result: 'won',
        multiplier: currentMultiplier,
      },
      ...history.slice(0, 9),
    ]);

    onResult(true, payout);

    // Gerar partículas de vitória
    const winParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setParticles(winParticles);
    setTimeout(() => setParticles([]), 1500);
  }, [betAmount, playSound, onResult]);

  const retire = useCallback(() => {
    if (!gameState.gameActive || gameState.playerRetired) return;
    handleRetire(gameState.multiplier);
  }, [gameState.gameActive, gameState.playerRetired, gameState.multiplier, handleRetire]);

  const reset = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setGameState({
      gameActive: false,
      multiplier: 1.0,
      crashed: false,
      crashMultiplier: null,
      playerRetired: false,
      payout: 0,
      status: 'idle',
    });
    setRocketY(0);
    setParticles([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card-neon mb-6 flex flex-col lg:flex-row">
        {/* Coluna da Esquerda: Arena de Jogo */}
        <div className="flex-1 lg:mr-6">
          {/* Título */}
          <h2 className="text-2xl font-orbitron font-bold text-center mb-6 neon-text flex items-center justify-center gap-2">
            <Rocket className="w-8 h-8" />
            NEON ROCKET
            <Rocket className="w-8 h-8" />
          </h2>

          {/* Arena de Jogo */}
          <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg border-2 border-cyan-500/30 overflow-hidden" style={{ height: '400px' }}>
            {/* Fundo com stars */}
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                />
              ))}
            </div>

            {/* Foguete */}
            {gameState.gameActive && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 transition-all"
                style={{ top: `${rocketY}px` }}
              >
                <div className="text-4xl animate-pulse-glow">🚀</div>
                {/* Trilha de fogo */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-12 bg-gradient-to-b from-orange-500 to-transparent blur-md" />
              </div>
            )}

            {/* Partículas de explosão/vitória */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                style={{
                  left: `calc(50% + ${particle.x}px)`,
                  top: `calc(50% + ${particle.y}px)`,
                }}
              />
            ))}

            {/* Multiplicador */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-6xl font-orbitron font-bold neon-text ${gameState.crashed ? 'text-red-500' : 'text-cyan-500'}`}>
                {gameState.crashed ? `${gameState.crashMultiplier?.toFixed(2) ?? 0.00}x` : `${gameState.multiplier.toFixed(2)}x`}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Controles e Histórico */}
        <div className="w-full lg:w-80 lg:ml-6 mt-6 lg:mt-0">
	          {/* Controles */}
	          <div className="card-neon mb-6">
	            {/* Informações do Pool */}
	            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 text-center mb-4">
	              <Coins className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
	              <p className="text-sm text-gray-400">Pool Liquidez (Mock)</p>
	              <p className="text-lg font-bold text-cyan-300">${poolLiquidity.toFixed(2)}</p>
	            </div>
            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-between gap-4">
                <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 flex-1">
                  <p className="text-xs font-bold text-pink-300 mb-1">MULTIPLICADOR</p>
                  <p className="text-lg font-bold text-pink-300">{gameState.multiplier.toFixed(2)}x</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 flex-1">
                  <p className="text-xs font-bold text-cyan-300 mb-1">PAYOUT</p>
                  <p className="text-lg font-bold text-cyan-300">${gameState.payout.toFixed(2)}</p>
                </div>
              </div>

	              {/* Valor da Aposta */}
	              <div className="mb-6">
	                <label className="block text-sm font-bold mb-2 text-cyan-300">Valor da Aposta (Min: ${minBet.toFixed(2)} / Max: ${maxBet.toFixed(2)})</label>
	                <input
	                  type="number"
	                  value={betAmount}
	                  onChange={(e) => onBet(Math.max(minBet, Math.min(maxBet, Number(e.target.value))))}
	                  disabled={gameState.gameActive}
	                  className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-700/50 focus:border-cyan-500 focus:outline-none"
	                  placeholder="Valor da aposta"
	                  min={minBet}
	                  step="0.01"
	                  max={maxBet}
	                />
	              </div>

              {/* Auto-Retirada */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="autoRetire"
                    checked={useAutoRetire}
                    onChange={(e) => setUseAutoRetire(e.target.checked)}
                    disabled={gameState.gameActive}
                    className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="autoRetire" className="text-sm font-medium text-cyan-300">
                    Auto-Retirada
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={autoRetireMultiplier}
                    onChange={(e) => setAutoRetireMultiplier(Math.max(1.01, Number(e.target.value)))}
                    disabled={!useAutoRetire || gameState.gameActive}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-cyan-300 placeholder-cyan-700/50 focus:border-cyan-500 focus:outline-none"
                    min="1.01"
                  />
                  <span className="text-cyan-300 font-bold py-2">x</span>
                </div>
              </div>

              {/* Botões de Ação */}
              {!gameState.gameActive ? (
                <Button
                  onClick={startGame}
                  disabled={gameState.gameActive || isLoading || betAmount <= 0}
                  className="w-full btn-neon"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  DECOLAR
                </Button>
              ) : (
                <Button
                  onClick={retire}
                  disabled={!gameState.gameActive || gameState.playerRetired}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  💰 RETIRAR @ {gameState.multiplier.toFixed(2)}x
                </Button>
              )}
            </div>
          </div>

          {/* Histórico */}
          {gameHistory.length > 0 && (
            <div className="card-neon mt-6">
              <h3 className="text-lg font-orbitron font-bold mb-4 neon-text">Histórico de Rodadas</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gameHistory.map((round, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded text-sm font-mono flex justify-between items-center border ${
                      round.result === 'won'
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div>
                      <span className={round.result === 'won' ? 'text-cyan-300 font-bold' : 'text-red-300 font-bold'}>
                        {round.result === 'won' ? '✓ GANHOU' : '✗ PERDEU'}
                      </span>
                      <span className="text-gray-400 ml-4">
                        Crash: {round.crash.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regras */}
      <div className="card-neon mt-6">
        <h3 className="text-lg font-orbitron font-bold mb-3 neon-text">📋 Regras</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>• Defina sua aposta e clique em DECOLAR.</li>
          <li>• O foguete decola e o multiplicador aumenta a cada instante.</li>
          <li>• Clique em RETIRAR antes que o foguete caia (crash).</li>
          <li>• Se você retirar, seu ganho é: Aposta × Multiplicador.</li>
          <li>• Se o foguete cair antes de você retirar, você perde a aposta.</li>
          <li>• Você pode configurar a Auto-Retirada para sacar automaticamente em um multiplicador específico.</li>
        </ul>
      </div>
    </div>
  );
}
