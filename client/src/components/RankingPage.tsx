import { Zap, Trophy, TrendingUp } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { formatAddress } from '@/lib/utils';

export function RankingPage() {
  // Usando a mesma rota do dashboard para obter o ranking semanal
  const { data: dashboardData, isLoading } = trpc.admin.getDashboardData.useQuery();

  const weeklyRanking = dashboardData?.weeklyRanking || [];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold mb-8 neon-text flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-400" />
        Ranking Semanal de Apostas
      </h1>

      <div className="card-neon mb-8">
        <h2 className="text-2xl font-orbitron font-bold mb-4 neon-text">Top 10 Players (Volume Semanal)</h2>
        <p className="text-sm text-gray-400 mb-4">
          O volume de apostas é calculado de domingo a sábado. O vencedor do Jackpot é sorteado entre os 10 primeiros no início de cada domingo.
        </p>

        {isLoading ? (
          <p className="text-cyan-300">Carregando ranking...</p>
        ) : (
          <div className="space-y-2">
            {weeklyRanking.map((entry, index) => (
              <div
                key={entry.address}
                className={`p-4 rounded-lg flex justify-between items-center transition-all ${
                  index === 0
                    ? 'bg-yellow-600/20 border border-yellow-400 shadow-lg shadow-yellow-500/30'
                    : index < 3
                    ? 'bg-cyan-600/20 border border-cyan-400'
                    : 'bg-gray-800/50 border border-gray-700/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-bold font-mono ${index === 0 ? 'text-yellow-400' : 'text-cyan-300'}`}>
                    #{index + 1}
                  </span>
                  <span className="font-mono text-gray-300 break-all">
                    {formatAddress(entry.address)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Volume</p>
                  <p className="text-lg font-bold text-cyan-300">${entry.volume.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
