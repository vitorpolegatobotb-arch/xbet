import { arbitrumSepolia, mainnet } from 'wagmi/chains';
import { http } from 'viem';
import { createConfig } from 'wagmi';
import { walletConnect, injected, metaMask } from 'wagmi/connectors';

/**
 * Configuração Web3 para Wagmi + WalletConnect
 * Suporta Arbitrum Sepolia (testnet) e Arbitrum One (mainnet)
 */

// Project ID do WalletConnect (obtenha em https://cloud.walletconnect.com)
const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'de212cc59e8b3a1e0d67265121b2bddd';

// Configuração de redes
const chains = [arbitrumSepolia, mainnet] as const;

export const web3Config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: PROJECT_ID,
      metadata: {
        name: 'Cyberpunk Web3 Casino',
        description: 'Experience the future of gaming with Web3 casino games powered by Arbitrum',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['/logo.svg'],
      },
    }),
  ],
  transports: {
    [arbitrumSepolia.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
    [mainnet.id]: http('https://arb1.arbitrum.io/rpc'),
  },
});

/**
 * Configuração de contrato inteligente
 * ABI simplificado para as funções principais
 */
export const CASINO_CONTRACT_CONFIG = {
  address: (import.meta.env.VITE_CASINO_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  abi: [
    // enterGame function
    {
      inputs: [
        { name: 'gameType', type: 'string' },
        { name: 'betAmount', type: 'uint256' },
      ],
      name: 'enterGame',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    // payout function
    {
      inputs: [
        { name: 'player', type: 'address' },
        { name: 'betAmount', type: 'uint256' },
        { name: 'multiplier', type: 'uint256' },
        { name: 'gameType', type: 'string' },
      ],
      name: 'payout',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    // getPoolStatus function
    {
      inputs: [],
      name: 'getPoolStatus',
      outputs: [
        { name: '_prizePool', type: 'uint256' },
        { name: '_seedCapital', type: 'uint256' },
        { name: '_houseBalance', type: 'uint256' },
        { name: '_totalBalance', type: 'uint256' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    // getPlayerStats function
    {
      inputs: [{ name: 'player', type: 'address' }],
      name: 'getPlayerStats',
      outputs: [
        { name: '_totalBets', type: 'uint256' },
        { name: '_totalWinnings', type: 'uint256' },
        { name: '_gameCount', type: 'uint256' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    // getPlayerGameHistory function
    {
      inputs: [{ name: 'player', type: 'address' }],
      name: 'getPlayerGameHistory',
      outputs: [
        {
          components: [
            { name: 'player', type: 'address' },
            { name: 'gameType', type: 'string' },
            { name: 'betAmount', type: 'uint256' },
            { name: 'payout', type: 'uint256' },
            { name: 'rake', type: 'uint256' },
            { name: 'timestamp', type: 'uint256' },
            { name: 'won', type: 'bool' },
          ],
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;

/**
 * Configuração de token USDC
 */
export const USDC_CONTRACT_CONFIG = {
  address: (import.meta.env.VITE_USDC_CONTRACT_ADDRESS || '0xaf88d065e77c8cC2239327C5EDb3A432268e5831') as `0x${string}`,
  abi: [
    // approve function
    {
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    // balanceOf function
    {
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    // allowance function
    {
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;

/**
 * Configurações de rede
 * Use testnet para desenvolvimento, mainnet para produção
 */
export const NETWORK_CONFIG = {
  testnet: {
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
  },
  mainnet: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
  },
};

/**
 * Configurações de jogo
 */
/**
 * Enderecos USDC por rede
 */
export const USDC_ADDRESSES = {
  testnet: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // Mock USDC Arbitrum Sepolia
  mainnet: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Real USDC Arbitrum One
};

export const GAME_CONFIG = {
  slots: {
    name: 'Caça-níqueis',
    houseEdge: 5,
    minBet: 1, // USDC
    maxBet: 1000, // USDC
    description: 'Gire os rolos e tente ganhar o jackpot!',
  },
  roulette: {
    name: 'Roleta',
    houseEdge: 5,
    minBet: 1, // USDC
    maxBet: 1000, // USDC
    description: 'Aposte em números, cores ou pares/ímpares',
  },
};

/**
 * Função para obter a URL do blockchain explorer
 */
export function getExplorerUrl(txHash: string, isTestnet: boolean = true): string {
  const config = isTestnet ? NETWORK_CONFIG.testnet : NETWORK_CONFIG.mainnet;
  return `${config.blockExplorer}/tx/${txHash}`;
}

/**
 * Função para obter a URL do endereço no blockchain explorer
 */
export function getAddressExplorerUrl(address: string, isTestnet: boolean = true): string {
  const config = isTestnet ? NETWORK_CONFIG.testnet : NETWORK_CONFIG.mainnet;
  return `${config.blockExplorer}/address/${address}`;
}
