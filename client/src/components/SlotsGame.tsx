import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Coins, Settings, Zap, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WinAnimation } from '@/components/WinAnimation';


/**
 * Componente do Jogo de Caça-níqueis (Slots)
 * Com animações de spin, símbolos e efeitos visuais
 */

const SYMBOLS = ['🍒', '🍊', '🍋', '🎰', '💎', '👑'];
const WINNING_COMBOS = [
  ['🍒', '🍒', '🍒'],
  ['🍊', '🍊', '🍊'],
  ['🍋', '🍋', '🍋'],
  ['🎰', '🎰', '🎰'],
  ['💎', '💎', '💎'],
  ['👑', '👑', '👑'],
];

interface SlotsGameProps {
  gameType: 'slots';
  betAmount: number;
  onBet: (amount: number) => void;
  onResult: (won: boolean, payout: number) => void;
  isLoading?: boolean;
}

export function SlotsGame({ betAmount, onBet, onResult, isLoading = false, gameType }: SlotsGameProps) {
  const { data: gameLimits } = trpc.admin.getGameLimits.useQuery();
  const { data: gamePools } = trpc.admin.getGamePools.useQuery();

  const minBet = gameLimits?.[gameType]?.minBet ?? 0.01;
  const maxBet = gameLimits?.[gameType]?.maxBet ?? 100;
  const poolLiquidity = gamePools?.[gameType]?.liquidity ?? 10000;
  const [reels, setReels] = useState<string[]>(['🍒', '🍊', '🍋']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lastResult, setLastResult] = useState<{ won: boolean; payout: number } | null>(null);
  const [spinHistory, setSpinHistory] = useState<Array<{ reels: string[]; won: boolean }>>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  const playSound = useCallback((type: 'spin' | 'win' | 'lose') => {
    if (isMuted) return;

    // Simular sons (em produção, usar Web Audio API)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'spin') {
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'win') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, [isMuted]);

  const spin = useCallback(async () => {
    if (isSpinning || isLoading || betAmount <= 0) return;

    setIsSpinning(true);
    playSound('spin');

    // Animação de spin
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      spinCount++;

      if (spinCount > 20) {
        clearInterval(spinInterval);

        // Resultado final
        const finalReels = [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ];

        setReels(finalReels);

        // Verificar se ganhou
        const won = WINNING_COMBOS.some(
          (combo) =>
            combo[0] === finalReels[0] &&
            combo[1] === finalReels[1] &&
            combo[2] === finalReels[2]
        );

        const payout = won ? betAmount * 3 : 0; // 3x payout para vitória

        setLastResult({ won, payout });
        setSpinHistory((prev) => [{ reels: finalReels, won }, ...prev.slice(0, 9)]);

        if (won) {
          playSound('win');
          setWinAmount(payout);
          setShowWinAnimation(true);
        } else {
          playSound('lose');
        }

        onResult(won, payout);
        setIsSpinning(false);
      }
    }, 100);
  }, [isSpinning, isLoading, betAmount, playSound, onResult]);

	  return (
	    <>
	      <WinAnimation
	        isVisible={showWinAnimation}
	        amount={winAmount}
	        onAnimationComplete={() => setShowWinAnimation(false)}
	      />
	    <div className="w-full max-w-md mx-auto">
	      <div className="card-neon mb-6">
	        {/* Título */}
	        <h2 className="text-2xl font-orbitron font-bold text-center mb-6 neon-text">
	          🎰 CAÇA-NÍQUEIS 🎰
	        </h2>

	        {/* Informações do Pool e Limites */}
	        <div className="grid grid-cols-2 gap-4 mb-6">
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
	        </div>

	        {/* Reels */}
        <div className="flex justify-center gap-4 mb-8 p-6 bg-gray-900/50 rounded-lg border border-cyan-500/30">
          {reels.map((symbol, idx) => (
            <div
              key={idx}
              className={`w-20 h-20 flex items-center justify-center text-4xl rounded-lg border-2 border-cyan-500 bg-gray-800 ${
                isSpinning ? 'animate-spin-slow' : ''
              } ${lastResult?.won ? 'glow-cyan' : ''}`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Resultado */}
        {lastResult && (
          <div
            className={`text-center mb-6 p-4 rounded-lg border-2 ${
              lastResult.won
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                : 'border-red-500 bg-red-500/10 text-red-300'
            }`}
          >
            {lastResult.won ? (
              <>
                <div className="text-xl font-bold mb-2">🎉 VOCÊ GANHOU! 🎉</div>
                <div className="text-2xl font-orbitron neon-text">
                  +${lastResult.payout.toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-lg font-bold">Tente novamente!</div>
            )}
          </div>
        )}

        {/* Controles */}
        <div className="space-y-4">
	          <div className="flex gap-2">
	            <input
	              type="number"
	              value={betAmount}
	              onChange={(e) => onBet(Math.max(minBet, Math.min(maxBet, Number(e.target.value))))}
	              disabled={isSpinning}
	              className="flex-1 px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-700/50 focus:border-cyan-500 focus:outline-none"
	              placeholder="Valor da aposta"
	              min={minBet}
	              step="0.01"
	              max={maxBet}
	            />
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg hover:border-cyan-500 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <Button
            onClick={spin}
            disabled={isSpinning || isLoading || betAmount <= 0}
            className="w-full btn-neon"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isSpinning ? 'GIRANDO...' : 'GIRAR'}
          </Button>
        </div>
      </div>

	      {/* Histórico */}
	      {spinHistory.length > 0 && (
	        <div className="card-neon">
	          <h3 className="text-lg font-orbitron font-bold mb-4 neon-text">Últimos Spins</h3>
	          <div className="space-y-2 max-h-48 overflow-y-auto">
	            {spinHistory.map((spin, idx) => (
	              <div
	                key={idx}
	                className={`p-2 rounded text-sm font-mono flex justify-between items-center ${
	                  spin.won
	                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
	                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/30'
	                }`}
	              >
	                <span>{spin.reels.join(' ')}</span>
	                <span className="font-bold">{spin.won ? '✓ WIN' : '✗ LOSS'}</span>
	              </div>
	            ))}
	          </div>
	        </div>
	      )}

	      {/* Regras */}
	      <div className="card-neon mt-6">
	        <h3 className="text-lg font-bold text-cyan-300 mb-2">📋 Regras</h3>
	        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
	          <li>Objetivo: Obter 3 símbolos iguais na linha central.</li>
	          <li>Vitória (3 símbolos iguais): 3x</li>
	          <li>Derrota: Perde a aposta</li>
	        </ul>
	      </div>
	    </div>
	    </>
	  );
	}
