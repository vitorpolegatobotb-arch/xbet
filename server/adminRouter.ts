import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { GameLimits, GamePools, GameType, AdminDashboardData, RakeSplitRecord, JackpotStatus, RankingEntry } from "@shared/types";

// --- Mock Data Store (Em produção, isso viria de um DB ou do Contrato) ---
export const MOCK_GAME_LIMITS: GameLimits = {
  slots: { minBet: 1, maxBet: 100 },
  blackjack: { minBet: 5, maxBet: 500 },
  crash: { minBet: 0.5, maxBet: 200 },
  mines: { minBet: 2, maxBet: 150 },
};

export const MOCK_GAME_POOLS: GamePools = {
  slots: { liquidity: 10000, rake: 500, jackpotContribution: 100 },
  blackjack: { liquidity: 25000, rake: 1200, jackpotContribution: 250 },
  crash: { liquidity: 5000, rake: 250, jackpotContribution: 50 },
  mines: { liquidity: 15000, rake: 750, jackpotContribution: 150 },
};

export const MOCK_RAKE_SPLITS: RakeSplitRecord[] = [
  { date: '2025-12-08', amount: 150 },
  { date: '2025-12-09', amount: 180 },
  { date: '2025-12-10', amount: 210 },
];

export const MOCK_JACKPOT_STATUS: JackpotStatus = {
  accumulatedAmount: 5000,
  nextDraw: Date.now() + (7 * 24 * 60 * 60 * 1000), // Próxima semana
};

export const MOCK_WEEKLY_RANKING: RankingEntry[] = [
  { address: '0xAD1e0c6495aC38D3b88f2aD32F963E491926EC33', volume: 150000 },
  { address: '0x22B7E3C4D8A6F9B8C7E2F4D5B9A1C8D7F6E5D4C3', volume: 120000 },
  { address: '0x99A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D3E2F1A0', volume: 90000 },
];

// --- Middleware de Admin (Apenas o Proprietário) ---
const ADMIN_WALLET = '0xAD1e0c6495aC38D3b88f2aD32F963E491926EC33';

const isAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  // Em um ambiente real, a verificação seria feita no contrato.
  // Aqui, usamos o endereço mockado.
  if (ctx.user.address.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
    throw new Error("Acesso negado. Apenas o proprietário do contrato pode acessar.");
  }
  return next({
    ctx: {
      ...ctx,
      // Adicionar dados mockados ao contexto para simular o acesso ao DB/Contrato
      gameLimits: MOCK_GAME_LIMITS,
      gamePools: MOCK_GAME_POOLS,
    },
  });
});

// --- Router de Admin ---
export const adminRouter = router({
  getDashboardData: isAdminProcedure.query((): AdminDashboardData => {
    return {
      rakeSplits: MOCK_RAKE_SPLITS,
      jackpotStatus: MOCK_JACKPOT_STATUS,
      weeklyRanking: MOCK_WEEKLY_RANKING,
    };
  }),

  getGameLimits: isAdminProcedure.query(({ ctx }) => {
    return ctx.gameLimits;
  }),

  setGameLimits: isAdminProcedure
    .input(
      z.object({
        game: z.custom<GameType>(),
        minBet: z.number().min(0.01),
        maxBet: z.number().min(0.01),
      })
    )
    .mutation(({ input, ctx }) => {
      // Simulação de atualização no DB/Contrato
      ctx.gameLimits[input.game] = { minBet: input.minBet, maxBet: input.maxBet };
      return { success: true, limits: ctx.gameLimits[input.game] };
    }),

  getGamePools: isAdminProcedure.query(({ ctx }) => {
    return ctx.gamePools;
  }),

  addLiquidity: isAdminProcedure
    .input(
      z.object({
        game: z.custom<GameType>(),
        amount: z.number().min(0.01),
      })
    )
    .mutation(({ input, ctx }) => {
      // Simulação de transação no Contrato/DB
      ctx.gamePools[input.game].liquidity += input.amount;
      return { success: true, newLiquidity: ctx.gamePools[input.game].liquidity };
    }),

  withdrawLiquidity: isAdminProcedure
    .input(
      z.object({
        game: z.custom<GameType>(),
        amount: z.number().min(0.01),
      })
    )
    .mutation(({ input, ctx }) => {
      // Simulação de transação no Contrato/DB
      if (ctx.gamePools[input.game].liquidity < input.amount) {
        throw new Error("Valor de saque excede a liquidez do pool.");
      }
      ctx.gamePools[input.game].liquidity -= input.amount;
      return { success: true, newLiquidity: ctx.gamePools[input.game].liquidity };
    }),
});
