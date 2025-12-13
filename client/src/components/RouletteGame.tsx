import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

/**
 * Componente do Jogo de Roleta
 * Com animação de roda girando, apostas e resultados
 */

const NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36
const COLORS: Record<number, string> = {
  0: 'green',
  ...Object.fromEntries(
    Array.from({ length: 36 }, (_, i) => [
      i + 1,
      (i + 1) % 2 === 0 ? 'red' : 'black',
    ])
  ),
};

const COLOR_NAMES: Record<string, string> = {
  red: 'Vermelho',
  black: 'Preto',
  green: 'Verde',
};

interface RouletteBet {
  type: 'number' | 'color' | 'even_odd';
  value: number | string;
  amount: number;
}

interface RouletteGameProps {
  betAmount: number;
  onBet: (amount: number) => void;
  onResult: (won: boolean, payout: number) => void;
  isLoading?: boolean;
}

export function RouletteGame({ betAmount, onBet, onResult, isLoading = false }: RouletteGameProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedBet, setSelectedBet] = useState<RouletteBet | null>(null);
  const [lastResult, setLastResult] = useState<{ number: number; color: string; won: boolean; payout: number } | null>(null);
  const [spinHistory, setSpinHistory] = useState<Array<{ number: number; won: boolean }>>([]);

  const playSound = useCallback((type: 'spin' | 'win') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'spin') {
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } else if (type === 'win') {
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    }
  }, []);

  const spin = useCallback(async () => {
    if (isSpinning || isLoading || !selectedBet || betAmount <= 0) return;

    setIsSpinning(true);
    playSound('spin');

    // Rotação aleatória da roda
    const winningNumber = Math.floor(Math.random() * 37);
    const finalRotation = (360 * 5) + (winningNumber * (360 / 37)); // 5 voltas + posição final

    // Animação suave
    let currentRotation = rotation;
    const rotationStep = (finalRotation - currentRotation) / 60;
    let steps = 0;

    const rotationInterval = setInterval(() => {
      steps++;
      currentRotation += rotationStep;
      setRotation(currentRotation);

      if (steps >= 60) {
        clearInterval(rotationInterval);
        setRotation(finalRotation);

        // Verificar resultado
        const winningColor = COLORS[winningNumber];
        let won = false;

        if (selectedBet.type === 'number') {
          won = selectedBet.value === winningNumber;
        } else if (selectedBet.type === 'color') {
          won = selectedBet.value === winningColor;
        } else if (selectedBet.type === 'even_odd') {
          const isEven = winningNumber % 2 === 0 && winningNumber !== 0;
          won = (selectedBet.value === 'even' && isEven) || (selectedBet.value === 'odd' && !isEven && winningNumber !== 0);
        }

        const payout = won ? betAmount * (selectedBet.type === 'number' ? 36 : 2) : 0;

        setLastResult({
          number: winningNumber,
          color: winningColor,
          won,
          payout,
        });

        setSpinHistory((prev) => [{ number: winningNumber, won }, ...prev.slice(0, 9)]);

        if (won) {
          playSound('win');
        }

        onResult(won, payout);
        setIsSpinning(false);
      }
    }, 16); // ~60fps
  }, [isSpinning, isLoading, selectedBet, betAmount, rotation, playSound, onResult]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card-neon mb-6">
        {/* Título */}
        <h2 className="text-2xl font-orbitron font-bold text-center mb-6 neon-text">
          🎡 ROLETA 🎡
        </h2>

        {/* Roda de Roleta */}
        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-64">
            {/* Roda */}
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              {NUMBERS.map((num) => {
                const angle = (num * 360) / 37;
                const color = COLORS[num];
                const colorMap: Record<string, string> = {
                  red: '#ef4444',
                  black: '#000000',
                  green: '#22c55e',
                };

                return (
                  <g key={num}>
                    <path
                      d={`M 100,100 L ${100 + 90 * Math.cos((angle - 4.86) * (Math.PI / 180))},${
                        100 + 90 * Math.sin((angle - 4.86) * (Math.PI / 180))
                      } A 90,90 0 0,1 ${100 + 90 * Math.cos((angle + 4.86) * (Math.PI / 180))},${
                        100 + 90 * Math.sin((angle + 4.86) * (Math.PI / 180))
                      } Z`}
                      fill={colorMap[color]}
                      stroke="rgba(0, 255, 255, 0.3)"
                      strokeWidth="0.5"
                    />
                    <text
                      x={100 + 65 * Math.cos((angle) * (Math.PI / 180))}
                      y={100 + 65 * Math.sin((angle) * (Math.PI / 180))}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fill="white"
                      fontWeight="bold"
                    >
                      {num}
                    </text>
                  </g>
                );
              })}

              {/* Centro */}
              <circle cx="100" cy="100" r="10" fill="rgba(0, 255, 255, 0.5)" stroke="rgba(0, 255, 255, 0.8)" strokeWidth="2" />
            </svg>

            {/* Indicador (bola) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full glow-cyan" />
          </div>
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
            <div className="text-lg font-bold mb-2">
              Número: <span className="text-2xl">{lastResult.number}</span> ({COLOR_NAMES[lastResult.color]})
            </div>
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

        {/* Seleção de Apostas */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-cyan-300">Tipo de Aposta</label>
            <div className="grid grid-cols-3 gap-2">
              {/* Números */}
              <button
                onClick={() => setSelectedBet({ type: 'number', value: Math.floor(Math.random() * 37), amount: betAmount })}
                className={`p-2 rounded text-sm font-bold transition-all ${
                  selectedBet?.type === 'number'
                    ? 'bg-cyan-500 text-gray-900 border-2 border-cyan-400'
                    : 'bg-gray-800 border border-cyan-500/30 hover:border-cyan-500'
                }`}
              >
                Número (36:1)
              </button>

              {/* Cores */}
              <button
                onClick={() => setSelectedBet({ type: 'color', value: 'red', amount: betAmount })}
                className={`p-2 rounded text-sm font-bold transition-all ${
                  selectedBet?.type === 'color'
                    ? 'bg-red-500 text-white border-2 border-red-400'
                    : 'bg-gray-800 border border-red-500/30 hover:border-red-500'
                }`}
              >
                Vermelho (2:1)
              </button>

              <button
                onClick={() => setSelectedBet({ type: 'color', value: 'black', amount: betAmount })}
                className={`p-2 rounded text-sm font-bold transition-all ${
                  selectedBet?.type === 'color' && selectedBet?.value === 'black'
                    ? 'bg-black text-white border-2 border-gray-400'
                    : 'bg-gray-800 border border-gray-500/30 hover:border-gray-500'
                }`}
              >
                Preto (2:1)
              </button>

              {/* Par/Ímpar */}
              <button
                onClick={() => setSelectedBet({ type: 'even_odd', value: 'even', amount: betAmount })}
                className={`p-2 rounded text-sm font-bold transition-all ${
                  selectedBet?.type === 'even_odd' && selectedBet?.value === 'even'
                    ? 'bg-cyan-500 text-gray-900 border-2 border-cyan-400'
                    : 'bg-gray-800 border border-cyan-500/30 hover:border-cyan-500'
                }`}
              >
                Par (2:1)
              </button>

              <button
                onClick={() => setSelectedBet({ type: 'even_odd', value: 'odd', amount: betAmount })}
                className={`p-2 rounded text-sm font-bold transition-all ${
                  selectedBet?.type === 'even_odd' && selectedBet?.value === 'odd'
                    ? 'bg-pink-500 text-gray-900 border-2 border-pink-400'
                    : 'bg-gray-800 border border-pink-500/30 hover:border-pink-500'
                }`}
              >
                Ímpar (2:1)
              </button>

              <button
                onClick={() => setSelectedBet({ type: 'color', value: 'green', amount: betAmount })}
                className={`p-2 rounded text-sm font-bold transition-all ${
                  selectedBet?.type === 'color' && selectedBet?.value === 'green'
                    ? 'bg-green-500 text-gray-900 border-2 border-green-400'
                    : 'bg-gray-800 border border-green-500/30 hover:border-green-500'
                }`}
              >
                Verde (36:1)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-cyan-300">Valor da Aposta</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => onBet(Math.max(0, Number(e.target.value)))}
              disabled={isSpinning}
              className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-700/50 focus:border-cyan-500 focus:outline-none"
              placeholder="Valor da aposta"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Botão de Girar */}
        <Button
          onClick={spin}
          disabled={isSpinning || isLoading || !selectedBet || betAmount <= 0}
          className="w-full btn-neon"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isSpinning ? 'GIRANDO...' : 'GIRAR'}
        </Button>
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
                <span>Número: {spin.number}</span>
                <span className="font-bold">{spin.won ? '✓ WIN' : '✗ LOSS'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
