import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle } from 'lucide-react';

interface RiskWarningCardProps {
  gameName: string;
  onContinue: () => void;
  onCancel: () => void;
}

export function RiskWarningCard({ gameName, onContinue, onCancel }: RiskWarningCardProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="card-neon max-w-lg w-full text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse-scale" />
        <h2 className="text-3xl font-orbitron font-bold mb-4 neon-text text-red-400">
          AVISO DE RISCO
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Você está prestes a iniciar o jogo **{gameName}**.
        </p>
        <div className="bg-gray-800/50 border border-red-500/30 rounded-lg p-6 mb-8">
          <p className="text-sm text-red-300 font-bold mb-2">
            ESTE É UM JOGO DE DINHEIRO REAL EM USDC.
          </p>
          <p className="text-sm text-gray-400">
            Ao continuar, você reconhece que existe o risco de perda de fundos. Jogue com responsabilidade.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 btn-neon"
          >
            <Zap className="w-4 h-4 mr-2" />
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
