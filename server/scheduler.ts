import { GamePools, RakeSplitRecord, JackpotStatus, RankingEntry } from "@shared/types";
import { MOCK_GAME_POOLS, MOCK_RAKE_SPLITS, MOCK_JACKPOT_STATUS, MOCK_WEEKLY_RANKING } from "./adminRouter"; // Importando os mocks

const OWNER_WALLET = '0xAD1e0c6495aC38D3b88f2aD32F963E491926EC33';

// --- Simulação de Split de Rake (5% Diário) ---
const RAKE_SPLIT_PERCENTAGE = 0.05; // 5%

const performDailyRakeSplit = () => {
  const today = new Date().toISOString().split('T')[0];
  let totalRakeSplit = 0;

  // 1. Calcular o rake total acumulado em todos os jogos
  let totalRakeAccumulated = 0;
  for (const game in MOCK_GAME_POOLS) {
    totalRakeAccumulated += MOCK_GAME_POOLS[game as keyof GamePools].rake;
  }

  // 2. Calcular o valor do split (5% do rake total)
  const splitAmount = totalRakeAccumulated * RAKE_SPLIT_PERCENTAGE;

  if (splitAmount > 0) {
    // 3. Simular o split para a carteira do proprietário
    console.log(`[Scheduler] Split de Rake diário: $${splitAmount.toFixed(2)} enviado para ${OWNER_WALLET}`);
    totalRakeSplit = splitAmount;

    // 4. Resetar o rake acumulado nos pools (simulação)
    for (const game in MOCK_GAME_POOLS) {
      MOCK_GAME_POOLS[game as keyof GamePools].rake = 0;
    }

    // 5. Registrar o split
    MOCK_RAKE_SPLITS.push({ date: today, amount: totalRakeSplit });
  }
};

// --- Simulação de Contribuição e Distribuição de Jackpot (1% Diário, Distribuição Semanal) ---
const JACKPOT_CONTRIBUTION_PERCENTAGE = 0.01; // 1%

const performDailyJackpotContribution = () => {
  let totalContribution = 0;

  // 1. Calcular a contribuição total (1% do pool de cada jogo)
  for (const game in MOCK_GAME_POOLS) {
    const pool = MOCK_GAME_POOLS[game as keyof GamePools];
    const contribution = pool.liquidity * JACKPOT_CONTRIBUTION_PERCENTAGE;
    
    // Simular a dedução do pool e adição ao acumulado
    pool.liquidity -= contribution;
    pool.jackpotContribution += contribution;
    totalContribution += contribution;
  }

  // 2. Adicionar ao Jackpot acumulado
  MOCK_JACKPOT_STATUS.accumulatedAmount += totalContribution;
  console.log(`[Scheduler] Contribuição diária do Jackpot: $${totalContribution.toFixed(2)}. Total acumulado: $${MOCK_JACKPOT_STATUS.accumulatedAmount.toFixed(2)}`);
};

const performWeeklyJackpotDraw = () => {
  const today = new Date();
  // Simular o sorteio no início do domingo (dia 0)
  if (today.getDay() === 0) {
    const accumulatedAmount = MOCK_JACKPOT_STATUS.accumulatedAmount;

    if (accumulatedAmount > 0 && MOCK_WEEKLY_RANKING.length > 0) {
      // 1. Selecionar um vencedor aleatório entre os 10 primeiros (mocked)
      const topTen = MOCK_WEEKLY_RANKING.slice(0, 10);
      const winnerIndex = Math.floor(Math.random() * topTen.length);
      const winner = topTen[winnerIndex];

      // 2. Simular o pagamento
      console.log(`[Scheduler] JACKPOT SORTEADO! Vencedor: ${winner.address} com $${accumulatedAmount.toFixed(2)}`);
      
      // 3. Registrar o vencedor (mock)
      // Em um ambiente real, isso seria salvo no DB para o player fazer o claim
      // MOCK_JACKPOT_WINNERS.push({ ... });

      // 4. Resetar o Jackpot
      MOCK_JACKPOT_STATUS.accumulatedAmount = 0;
      
      // 5. Definir a próxima data de sorteio (próximo domingo)
      const nextSunday = new Date(today);
      nextSunday.setDate(today.getDate() + 7);
      MOCK_JACKPOT_STATUS.nextDraw = nextSunday.getTime();
    }
  }
};

// --- Inicialização do Scheduler (Simulação) ---
let schedulerInterval: NodeJS.Timeout | null = null;

export const startScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  // Simular a execução a cada 10 segundos para testes
  schedulerInterval = setInterval(() => {
    const now = new Date();
    
    // Simular Rake Split Diário (executa a cada 10s, mas a lógica interna garante que só roda uma vez por "dia")
    performDailyRakeSplit();

    // Simular Contribuição Diária do Jackpot
    performDailyJackpotContribution();

    // Simular Sorteio Semanal do Jackpot
    performWeeklyJackpotDraw();

  }, 10000); // 10 segundos

  console.log('[Scheduler] Tarefas de Rake Split e Jackpot iniciadas (simulação a cada 10s).');
};

export const stopScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('[Scheduler] Tarefas de Rake Split e Jackpot paradas.');
  }
};
