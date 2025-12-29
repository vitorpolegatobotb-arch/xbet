import { useState, useCallback, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Coins, Settings, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';


/**
 * Componente do Jogo Mines Neon
 * Campo minado com apostas - 5x5 com 8 minas fixas
 * Cada casa aberta soma +0.25x ao multiplicador
 */

interface GameState {
  gameActive: boolean;
  squaresRevealed: number;
  multiplier: number;
  hitMine: boolean;
  playerCashedOut: boolean;
  payout: number;
  status: 'idle' | 'playing' | 'won' | 'lost';
}

interface Square {
  id: number;
  hasMine: boolean;
  revealed: boolean;
  x: number;
  y: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface MinesGameProps {
  gameType: 'mines';
  betAmount: number;
  onBet: (amount: number) => void;
  onResult: (won: boolean, payout: number) => void;
  isLoading?: boolean;
}

// Função para gerar 8 posições de minas aleatórias e únicas em um tabuleiro 5x5 (25 quadrados)
const generateRandomMinePositions = (): number[] => {
  const totalSquares = 25;
  const numMines = 8;
  const positions = Array.from({ length: totalSquares }, (_, i) => i);
  
  // Algoritmo de Fisher-Yates (shuffle) e pega os primeiros 'numMines'
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  return positions.slice(0, numMines);
};

export function MinesGame({ betAmount, onBet, onResult, isLoading = false, gameType }: MinesGameProps) {
  const { data: gameLimits } = trpc.admin.getGameLimits.useQuery();
  const { data: gamePools } = trpc.admin.getGamePools.useQuery();

  const minBet = gameLimits?.[gameType]?.minBet ?? 2;
  const maxBet = gameLimits?.[gameType]?.maxBet ?? 150;
  const poolLiquidity = gamePools?.[gameType]?.liquidity ?? 15000;
  const [gameState, setGameState] = useState<GameState>({
    gameActive: false,
    squaresRevealed: 0,
    multiplier: 1.0,
    hitMine: false,
    playerCashedOut: false,
    payout: 0,
    status: 'idle',
  });

  const [squares, setSquares] = useState<Square[]>([]);
  const [gameHistory, setGameHistory] = useState<Array<{ revealed: number; multiplier: number; result: 'won' | 'lost' }>>([]);
  const [explosionParticles, setExplosionParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const musicLoopRef = useRef<NodeJS.Timeout | null>(null);
  const floatingTextIdRef = useRef(0);

  // Inicializar AudioContext
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not available');
    }
  }, []);

  const playSound = useCallback((type: 'click' | 'mine' | 'cashout' | 'music') => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;

    try {
      if (type === 'click') {
        // Som de clique suave
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'mine') {
        // Som de explosão
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'cashout') {
        // Som de vitória
        const notes = [600, 750, 900];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          const startTime = ctx.currentTime + idx * 0.1;
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.1, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

          osc.start(startTime);
          osc.stop(startTime + 0.1);
        });
      } else if (type === 'music') {
        // Música tensa - notas baixas e suspensivas
        const notes = [220, 247, 220, 277]; // A3, B3, A3, C#4
        const noteDuration = 0.2;

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          const startTime = ctx.currentTime + idx * noteDuration;
          osc.frequency.setValueAtTime(freq, startTime);
          
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.05, startTime + 0.05);
          gain.gain.linearRampToValueAtTime(0.05, startTime + noteDuration - 0.05);
          gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);

          osc.start(startTime);
          osc.stop(startTime + noteDuration);
        });
      }
    } catch (e) {
      console.warn('Sound playback error:', e);
    }
  }, []);

  const generateBoard = useCallback(() => {
    const totalSquares = 25; // 5x5
    const newSquares: Square[] = [];
    const minePositions = generateRandomMinePositions();

    // Criar quadrados
    for (let i = 0; i < totalSquares; i++) {
      newSquares.push({
        id: i,
        hasMine: minePositions.includes(i),
        revealed: false,
        x: i % 5,
        y: Math.floor(i / 5),
      });
    }

    return newSquares;
  }, []);

  const startGame = useCallback(() => {
    if (betAmount <= 0 || gameState.gameActive) return;

    const newBoard = generateBoard();
    setSquares(newBoard);

    setGameState({
      gameActive: true,
      squaresRevealed: 0,
      multiplier: 1.0,
      hitMine: false,
      playerCashedOut: false,
      payout: betAmount,
      status: 'playing',
    });

    setExplosionParticles([]);
    setFloatingTexts([]);
    playSound('music');

    // Música de fundo (loop)
    musicLoopRef.current = setInterval(() => {
      playSound('music');
    }, 800);
  }, [betAmount, gameState.gameActive, generateBoard, playSound]);

  const revealSquare = useCallback((squareId: number) => {
    if (!gameState.gameActive || gameState.hitMine || gameState.playerCashedOut) return;

    const square = squares.find((s) => s.id === squareId);
    if (!square || square.revealed) return;

    playSound('click');

    if (square.hasMine) {
      // Acertou uma mina
      if (musicLoopRef.current) clearInterval(musicLoopRef.current);
      playSound('mine');

      // Gerar partículas de explosão
      const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: square.x * 20 + 10 + (Math.random() - 0.5) * 40,
        y: square.y * 20 + 10 + (Math.random() - 0.5) * 40,
      }));
      setExplosionParticles(particles);

      // Revelar todas as minas
      const updatedSquares = squares.map((s) => ({
        ...s,
        revealed: s.hasMine ? true : s.revealed,
      }));
      setSquares(updatedSquares);

      setGameState((prev) => ({
        ...prev,
        gameActive: false,
        hitMine: true,
        status: 'lost',
        payout: 0,
      }));

      setGameHistory((prev) => [
        {
          revealed: gameState.squaresRevealed,
          multiplier: gameState.multiplier,
          result: 'lost',
        },
        ...prev.slice(0, 9),
      ]);

      onResult(false, 0);

      setTimeout(() => setExplosionParticles([]), 1000);
    } else {
      // Quadrado seguro
      const updatedSquares = squares.map((s) =>
        s.id === squareId ? { ...s, revealed: true } : s
      );

      // Animação de diamante
      const diamondElement = document.getElementById('square-' + squareId);
      if (diamondElement) {
        diamondElement.classList.add('animate-diamond');
        setTimeout(() => {
          diamondElement.classList.remove('animate-diamond');
        }, 500);
      }
      setSquares(updatedSquares);

      const newRevealed = gameState.squaresRevealed + 1;
      const newMultiplier = 1.0 + newRevealed * 0.25; // +0.25x por casa aberta
      const newPayout = betAmount * newMultiplier;

      // Criar texto flutuante "+0.25"
      const floatingId = floatingTextIdRef.current++;
      setFloatingTexts((prev) => [
        ...prev,
        {
          id: floatingId,
          x: square.x * 20 + 10,
          y: square.y * 20 + 10,
          text: '+0.25',
        },
      ]);

      // Remover texto flutuante após animação
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((t) => t.id !== floatingId));
      }, 1500);

      setGameState((prev) => ({
        ...prev,
        squaresRevealed: newRevealed,
        multiplier: newMultiplier,
        payout: newPayout,
      }));
    }
  }, [gameState, squares, betAmount, playSound, onResult]);

  const cashout = useCallback(() => {
    if (!gameState.gameActive || gameState.hitMine || gameState.playerCashedOut) return;

    if (musicLoopRef.current) clearInterval(musicLoopRef.current);
    playSound('cashout');

    const payout = gameState.payout;

    setGameState((prev) => ({
      ...prev,
      gameActive: false,
      playerCashedOut: true,
      payout: payout,
      status: 'won',
    }));

    setGameHistory((prev) => [
      {
        revealed: gameState.squaresRevealed,
        multiplier: gameState.multiplier,
        result: 'won',
      },
      ...prev.slice(0, 9),
    ]);

    onResult(true, payout);
  }, [gameState, playSound, onResult]);

  const reset = useCallback(() => {
    if (musicLoopRef.current) clearInterval(musicLoopRef.current);

    setGameState({
      gameActive: false,
      squaresRevealed: 0,
      multiplier: 1.0,
      hitMine: false,
      playerCashedOut: false,
      payout: 0,
      status: 'idle',
    });

    setSquares([]);
    setExplosionParticles([]);
    setFloatingTexts([]);
  }, []);

  useEffect(() => {
    return () => {
      if (musicLoopRef.current) clearInterval(musicLoopRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card-neon mb-6">
	        {/* Título */}
	        <h2 className="text-2xl font-orbitron font-bold text-center mb-6 neon-text">
	          💎 DIAMOND MINES 💎
	        </h2>

	        {/* Informações do Pool e Limites */}
	        <div className="grid grid-cols-3 gap-4 mb-6">
	          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 text-center">
	            <Coins className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
	            <p className="text-sm text-gray-400">Pool Liquidez (Mock)</p>
	            <p className="text-lg font-bold text-cyan-300">${poolLiquidity.toFixed(2)}</p>
	          </div>
	          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 text-center">
	            <Settings className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
	            <p className="text-sm text-gray-400">Limites</p>
	            <p className="text-lg font-bold text-cyan-300">${minBet.toFixed(2)} - ${maxBet.toFixed(2)}</p>
	          </div>
	          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 text-center">
	            <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
	            <p className="text-sm text-gray-400">House Edge</p>
	            <p className="text-lg font-bold text-cyan-300">5%</p>
	          </div>
	        </div>

        {/* Tabuleiro 5x5 */}
        <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-lg border-2 border-cyan-500/30 p-4 mb-6 mx-auto" style={{ width: '320px', height: '320px' }}>
          <div
            className="grid gap-1 w-full h-full"
            style={{
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
            }}
          >
            {squares.map((square) => (
              <button
                key={square.id}
                onClick={() => revealSquare(square.id)}
                disabled={square.revealed || !gameState.gameActive || gameState.hitMine || gameState.playerCashedOut}
                className={`
                  rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 relative
                  ${square.revealed
                    ? square.hasMine
                      ? 'bg-red-600 border-2 border-red-500 text-white cursor-default'
                      : 'bg-green-600 border-2 border-green-500 text-white cursor-default'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-cyan-400 text-white hover:from-cyan-400 hover:to-blue-500 cursor-pointer shadow-lg shadow-cyan-500/50'
                  }
                `}
                id={`square-${square.id}`}
              >
                {square.revealed ? (square.hasMine ? '💣' : '💎') : '?'}
              </button>
            ))}
          </div>

          {/* Textos flutuantes (+0.25) */}
          {floatingTexts.map((text) => (
            <div
              key={text.id}
              className="absolute font-bold text-cyan-300 pointer-events-none animate-pulse"
              style={{
                left: `${text.x}px`,
                top: `${text.y}px`,
                animation: 'float-up 1.5s ease-out forwards',
                fontSize: '14px',
                textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
              }}
            >
              {text.text}
            </div>
          ))}

          {/* Partículas de explosão */}
          {explosionParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
              }}
            />
          ))}

          {/* Status */}
          {gameState.hitMine && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">💥 BOOM! 💥</div>
                <div className="text-lg text-red-300">Você perdeu tudo!</div>
              </div>
            </div>
          )}

          {gameState.playerCashedOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">✓ CASHOUT! ✓</div>
                <div className="text-lg text-cyan-300">Você escapou!</div>
              </div>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-2">
            <p className="text-xs font-bold text-cyan-300 mb-1">APOSTA</p>
            <p className="text-sm font-bold text-cyan-300">${betAmount.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg border border-green-500/30 p-2">
            <p className="text-xs font-bold text-green-300 mb-1">ABERTOS</p>
            <p className="text-sm font-bold text-green-300">{gameState.squaresRevealed}/17</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-2">
            <p className="text-xs font-bold text-cyan-300 mb-1">MULTIPLICADOR</p>
            <p className="text-sm font-bold text-cyan-300">{gameState.multiplier.toFixed(2)}x</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-2">
            <p className="text-xs font-bold text-cyan-300 mb-1">PAYOUT</p>
            <p className="text-sm font-bold text-cyan-300">${gameState.payout.toFixed(2)}</p>
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

        {/* Botões */}
        <div className="flex gap-2">
          <Button
            onClick={startGame}
            disabled={gameState.gameActive || isLoading || betAmount <= 0}
            className="flex-1 btn-neon"
          >
            <Zap className="w-4 h-4 mr-2" />
            {gameState.gameActive ? 'JOGANDO...' : 'COMEÇAR'}
          </Button>

          <Button
            onClick={cashout}
            disabled={!gameState.gameActive || gameState.hitMine || gameState.playerCashedOut}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            💰 CASHOUT {gameState.multiplier.toFixed(2)}x
          </Button>

          {/* Botão de reset removido conforme solicitação */}
        </div>
      </div>

      {/* Histórico */}
      {gameHistory.length > 0 && (
        <div className="card-neon">
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
                    {round.result === 'won' ? '✓ CASHOUT' : '✗ BOOM'}
                  </span>
                  <span className="text-gray-400 ml-4">
                    {round.revealed} abertos - {round.multiplier.toFixed(2)}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regras */}
      <div className="card-neon mt-6">
        <h3 className="text-lg font-orbitron font-bold mb-3 neon-text">📋 Como Jogar</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>• Tabuleiro fixo: 5x5 com 8 minas fixas (17 quadrados seguros)</li>
          <li>• Cada quadrado aberto = +0.25x ao multiplicador</li>
          <li>• Defina o valor da aposta</li>
          <li>• Clique em COMEÇAR para iniciar</li>
          <li>• Clique nos quadrados para revelá-los</li>
          <li>• ✓ = Quadrado seguro (multiplicador aumenta)</li>
          <li>• 💣 = Mina (você perde tudo e o jogo acaba)</li>
          <li>• Clique em CASHOUT a qualquer momento para sacar seus ganhos</li>
          <li>• Payout = Aposta × Multiplicador</li>
          <li>• House Edge: 5% em todos os ganhos</li>
        </ul>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px);
          }
        }
        @keyframes diamond-pulse {
          0% { transform: scale(1); box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
          50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(0, 255, 255, 1); }
          100% { transform: scale(1); box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
        }
        .animate-diamond {
          animation: diamond-pulse 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
