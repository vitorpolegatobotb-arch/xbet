import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Coins, TrendingUp, Settings, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { GameType } from '@shared/types';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';

const gameNames: Record<GameType, string> = {
  slots: 'Caça-Níqueis',
  blackjack: 'Blackjack',
  crash: 'Neon Rocket',
  mines: 'Diamond Mines',
};

const ADMIN_WALLET = '0xAD1e0c6495aC38D3b88f2aD32F963E491926EC33';

export function AdminPanel() {
  const { address } = useWeb3Wallet();
  const isAdmin = useMemo(() => address?.toLowerCase() === ADMIN_WALLET.toLowerCase(), [address]);

  const [selectedGame, setSelectedGame] = useState<GameType>('slots');
  const [liquidityAmount, setLiquidityAmount] = useState(0);
  const [minBet, setMinBet] = useState(0);
  const [maxBet, setMaxBet] = useState(0);

  // TRPC Queries
  const { data: dashboardData, isLoading: isLoadingDashboard, refetch: refetchDashboard } = trpc.admin.getDashboardData.useQuery(undefined, { enabled: isAdmin });
  const { data: gameLimits, isLoading: isLoadingLimits, refetch: refetchLimits } = trpc.admin.getGameLimits.useQuery(undefined, { enabled: isAdmin });
  const { data: gamePools, isLoading: isLoadingPools, refetch: refetchPools } = trpc.admin.getGamePools.useQuery(undefined, { enabled: isAdmin });

  // TRPC Mutations
  const setLimitsMutation = trpc.admin.setGameLimits.useMutation({
    onSuccess: () => {
      alert('Limites definidos com sucesso!');
      refetchLimits();
    },
    onError: (error) => alert(`Erro ao definir limites: ${error.message}`),
  });

  const addLiquidityMutation = trpc.admin.addLiquidity.useMutation({
    onSuccess: () => {
      alert('Liquidez adicionada com sucesso!');
      setLiquidityAmount(0);
      refetchPools();
    },
    onError: (error) => alert(`Erro ao adicionar liquidez: ${error.message}`),
  });

  const withdrawLiquidityMutation = trpc.admin.withdrawLiquidity.useMutation({
    onSuccess: () => {
      alert('Liquidez sacada com sucesso!');
      setLiquidityAmount(0);
      refetchPools();
    },
    onError: (error) => alert(`Erro ao sacar liquidez: ${error.message}`),
  });

  // Handlers
  const handleSetLimits = () => {
    if (minBet <= 0 || maxBet <= 0 || minBet >= maxBet) {
      alert('Aposta mínima e máxima devem ser valores válidos e Min < Max.');
      return;
    }
    setLimitsMutation.mutate({ game: selectedGame, minBet, maxBet });
  };

  const handleAddLiquidity = () => {
    if (liquidityAmount <= 0) return;
    addLiquidityMutation.mutate({ game: selectedGame, amount: liquidityAmount });
  };

  const handleWithdrawLiquidity = () => {
    if (liquidityAmount <= 0) return;
    withdrawLiquidityMutation.mutate({ game: selectedGame, amount: liquidityAmount });
  };

  // Efeito para carregar os limites do jogo selecionado
  useEffect(() => {
    if (gameLimits && gameLimits[selectedGame]) {
      setMinBet(gameLimits[selectedGame].minBet);
      setMaxBet(gameLimits[selectedGame].maxBet);
    }
  }, [selectedGame, gameLimits]);

  if (!isAdmin) {
    return (
      <div className="card-neon text-center max-w-xl mx-auto">
        <Settings className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-3xl font-orbitron font-bold mb-4 text-red-500">ACESSO NEGADO</h2>
        <p className="text-gray-300">
          Apenas o proprietário do contrato (`{ADMIN_WALLET}`) pode acessar este painel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold mb-8 neon-text flex items-center gap-3">
        <Settings className="w-8 h-8" />
        Painel de Administração
      </h1>

      {/* Dashboard de Rake e Jackpot */}
      <div className="card-neon mb-8">
        <h2 className="text-2xl font-orbitron font-bold mb-4 neon-text">Dashboard</h2>
        {isLoadingDashboard ? (
          <p className="text-cyan-300">Carregando dados...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rake Split Diário */}
            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-4">
              <p className="text-sm font-bold text-pink-300 mb-1">RAKE SPLIT (Último)</p>
              <p className="text-xl font-bold text-pink-300">
                ${dashboardData?.rakeSplits[dashboardData.rakeSplits.length - 1]?.amount.toFixed(2) ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-400">
                Data: {dashboardData?.rakeSplits[dashboardData.rakeSplits.length - 1]?.date ?? 'N/A'}
              </p>
            </div>

            {/* Jackpot Acumulado */}
            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-4">
              <p className="text-sm font-bold text-cyan-300 mb-1">JACKPOT ACUMULADO</p>
              <p className="text-xl font-bold text-cyan-300">
                ${dashboardData?.jackpotStatus.accumulatedAmount.toFixed(2) ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-400">
                Próximo Sorteio: {new Date(dashboardData?.jackpotStatus.nextDraw ?? 0).toLocaleString()}
              </p>
            </div>

            {/* Top Player da Semana */}
            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-4">
              <p className="text-sm font-bold text-green-300 mb-1">TOP PLAYER (Volume Semanal)</p>
              <p className="text-sm font-mono text-green-300 break-all">
                {dashboardData?.weeklyRanking[0]?.address ?? 'N/A'}
              </p>
              <p className="text-xs text-gray-400">
                Volume: ${dashboardData?.weeklyRanking[0]?.volume.toFixed(2) ?? 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Gerenciamento de Jogos */}
      <div className="card-neon mb-8">
        <h2 className="text-2xl font-orbitron font-bold mb-4 neon-text">Gerenciamento de Jogos</h2>

        {/* Seleção de Jogo */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-cyan-300">Selecionar Jogo</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value as GameType)}
            className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-300 focus:border-cyan-500 focus:outline-none"
          >
            {Object.entries(gameNames).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Limites de Aposta */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-pink-300 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Limites de Aposta
            </h3>
            <div className="bg-gray-800/50 rounded-lg border border-pink-500/30 p-4 space-y-4">
              <p className="text-sm text-gray-400">
                Limites atuais: Min ${gameLimits?.[selectedGame]?.minBet.toFixed(2) ?? 'N/A'} / Max ${gameLimits?.[selectedGame]?.maxBet.toFixed(2) ?? 'N/A'}
              </p>
              <div>
                <label className="block text-sm font-bold mb-1 text-pink-300">Aposta Mínima (USDC)</label>
                <Input
                  type="number"
                  value={minBet}
                  onChange={(e) => setMinBet(Number(e.target.value))}
                  min={0.01}
                  step={0.01}
                  className="bg-gray-700 border-pink-500/30 text-pink-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-pink-300">Aposta Máxima (USDC)</label>
                <Input
                  type="number"
                  value={maxBet}
                  onChange={(e) => setMaxBet(Number(e.target.value))}
                  min={0.01}
                  step={0.01}
                  className="bg-gray-700 border-pink-500/30 text-pink-300"
                />
              </div>
              <Button
                onClick={handleSetLimits}
                disabled={setLimitsMutation.isLoading || isLoadingLimits}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                {setLimitsMutation.isLoading ? 'Salvando...' : 'Definir Limites'}
              </Button>
            </div>
          </div>

          {/* Coluna 2: Gerenciamento de Liquidez */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Gerenciamento de Liquidez (Pool)
            </h3>
            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-4 space-y-4">
              <p className="text-lg font-bold text-cyan-300">
                Liquidez Atual do Pool: ${gamePools?.[selectedGame]?.liquidity.toFixed(2) ?? 'N/A'} USDC
              </p>
              <p className="text-sm text-gray-400">
                Rake Acumulado: ${gamePools?.[selectedGame]?.rake.toFixed(2) ?? 'N/A'} | Contribuição Jackpot: ${gamePools?.[selectedGame]?.jackpotContribution.toFixed(2) ?? 'N/A'}
              </p>
              <div>
                <label className="block text-sm font-bold mb-1 text-cyan-300">Valor (USDC)</label>
                <Input
                  type="number"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(Number(e.target.value))}
                  min={0.01}
                  step={0.01}
                  className="bg-gray-700 border-cyan-500/30 text-cyan-300"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleAddLiquidity}
                  disabled={addLiquidityMutation.isLoading || liquidityAmount <= 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Adicionar Liquidez
                </Button>
                <Button
                  onClick={handleWithdrawLiquidity}
                  disabled={withdrawLiquidityMutation.isLoading || liquidityAmount <= 0 || liquidityAmount > (gamePools?.[selectedGame]?.liquidity ?? 0)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Sacar Liquidez
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
