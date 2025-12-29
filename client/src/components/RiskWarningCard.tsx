import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle } from 'lucide-react';

interface RiskWarningCardProps {
  gameName: string;
  onContinue: () => void;
  onCancel: () => void;
}

export function RiskWarningCard({ gameName, onContinue, onCancel }: RiskWarningCardProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
          Aviso de Risco
        </h2>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
          Você está prestes a iniciar o jogo <strong className="text-foreground">{gameName}</strong>.
        </p>
        <div className="bg-background/50 border border-red-500/30 rounded-lg p-4 sm:p-6 mb-8">
          <p className="text-sm font-semibold text-red-400 mb-2">
            ESTE É UM JOGO COM DINHEIRO REAL EM USDC.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ao continuar, você reconhece que existe o risco de perda de fundos. Jogue com responsabilidade.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-border hover:bg-background"
          >
            Cancelar
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
