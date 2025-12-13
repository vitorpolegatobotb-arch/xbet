import { useEffect, useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

interface WinAnimationProps {
  isVisible: boolean;
  amount: number;
  onAnimationComplete?: () => void;
}

// Componente de confete
const Confetti = () => {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    size: 5 + Math.random() * 15,
  }));

  return (
    <>
      {confetti.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none"
          style={{
            left: `${item.left}%`,
            top: '-10px',
            animation: `fall ${item.duration}s linear ${item.delay}s forwards`,
            width: `${item.size}px`,
            height: `${item.size}px`,
          }}
        >
          <div
            className={`w-full h-full rounded-full ${
              ['bg-cyan-400', 'bg-pink-400', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400'][
                Math.floor(Math.random() * 5)
              ]
            } opacity-80 shadow-lg`}
          />
        </div>
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export function WinAnimation({ isVisible, amount, onAnimationComplete }: WinAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
        onAnimationComplete?.();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Confete */}
      <Confetti />

      {/* Fundo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-pink-500/10 to-transparent animate-pulse" />

      {/* Container central */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Círculos de luz pulsantes */}
        <div className="relative w-96 h-96">
          {/* Círculo 1 */}
          <div
            className="absolute inset-0 rounded-full border-4 border-cyan-400/50"
            style={{
              animation: 'pulse-ring 1.5s ease-out forwards',
            }}
          />

          {/* Círculo 2 */}
          <div
            className="absolute inset-0 rounded-full border-4 border-pink-400/50"
            style={{
              animation: 'pulse-ring 1.5s ease-out 0.3s forwards',
            }}
          />

          {/* Círculo 3 */}
          <div
            className="absolute inset-0 rounded-full border-4 border-yellow-400/50"
            style={{
              animation: 'pulse-ring 1.5s ease-out 0.6s forwards',
            }}
          />

          {/* Card de vitória */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              animation: 'scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            {/* Ícone de troféu */}
            <div className="mb-6 relative">
              <Trophy className="w-24 h-24 text-yellow-400 drop-shadow-lg" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-pink-400 animate-spin" />
            </div>

            {/* Texto de vitória */}
            <h2 className="text-5xl font-orbitron font-bold neon-text-pink mb-4 text-center drop-shadow-lg">
              VITÓRIA!
            </h2>

            {/* Valor ganho */}
            <div className="text-center">
              <p className="text-gray-300 text-lg mb-2">Você ganhou</p>
              <p className="text-5xl font-orbitron font-bold text-yellow-400 drop-shadow-lg">
                +${amount.toFixed(2)}
              </p>
              <p className="text-cyan-300 text-sm mt-2">USDC</p>
            </div>

            {/* Efeito de brilho */}
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 via-pink-400/20 to-yellow-400/20 blur-xl"
              style={{
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Estilos de animação */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.5;
            filter: blur(10px);
          }
          50% {
            opacity: 1;
            filter: blur(20px);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
