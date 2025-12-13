/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// --- Novos Tipos para Admin e Jackpot ---

export type GameType = 'slots' | 'blackjack' | 'crash' | 'mines';

export interface AdminSettings {
  minBet: number;
  maxBet: number;
}

export interface PoolInfo {
  liquidity: number; // Liquidez total do pool (mock)
  rake: number; // Rake acumulado (mock)
  jackpotContribution: number; // Contribuição para o jackpot (mock)
}

export interface GamePools {
  slots: PoolInfo;
  blackjack: PoolInfo;
  crash: PoolInfo;
  mines: PoolInfo;
}

export interface GameLimits {
  slots: AdminSettings;
  blackjack: AdminSettings;
  crash: AdminSettings;
  mines: AdminSettings;
}

export interface RakeSplitRecord {
  date: string; // YYYY-MM-DD
  amount: number; // Valor do rake splitado
}

export interface JackpotWinner {
  week: string; // YYYY-WW
  address: string;
  amount: number;
  claimed: boolean;
}

export interface RankingEntry {
  address: string;
  volume: number; // Volume de aposta na semana
}

export interface JackpotStatus {
  accumulatedAmount: number;
  nextDraw: number; // Timestamp da próxima distribuição (início do domingo)
}

export interface AdminDashboardData {
  rakeSplits: RakeSplitRecord[];
  jackpotStatus: JackpotStatus;
  weeklyRanking: RankingEntry[];
}
