import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { useCallback, useState } from 'react';
import { arbitrumSepolia } from 'wagmi/chains';

/**
 * Hook customizado para gerenciar conexão de carteira Web3
 * Fornece estado de conexão, saldo e funções de controle
 */
export function useWeb3Wallet() {
  const { address, isConnected, isConnecting, status } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect, isPending: isDisconnectPending } = useDisconnect();
  const chainId = useChainId();
  const { data: balanceData, isLoading: isLoadingBalance } = useBalance({
    address: address,
  });

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Verificar se está na rede correta (Arbitrum Sepolia)
  const checkNetwork = useCallback(() => {
    const isCorrectNetwork = chainId === arbitrumSepolia.id;
    setIsWrongNetwork(!isCorrectNetwork);
    return isCorrectNetwork;
  }, [chainId]);

  // Conectar carteira
  const connectWallet = useCallback(
    (connectorId?: string) => {
      const connector = connectorId
        ? connectors.find((c) => c.id === connectorId)
        : connectors[0];

      if (connector) {
        connect({ connector });
      }
    },
    [connect, connectors]
  );

  // Desconectar carteira
  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  // Formatar endereço (0x1234...5678)
  const formatAddress = useCallback((addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Obter saldo em USDC
  const getUSDCBalance = useCallback(() => {
    if (!balanceData) return '0';
    // Converter para formato legível (USDC tem 6 decimais)
    const balance = Number(balanceData.value) / 10 ** 6;
    return balance.toFixed(2);
  }, [balanceData]);

  return {
    // Estado
    address,
    isConnected,
    isConnecting: isConnectPending || isConnecting,
    isDisconnecting: isDisconnectPending,
    status,
    chainId,
    isWrongNetwork,
    isLoadingBalance,
    balance: balanceData?.value || BigInt(0),

    // Funções
    connectWallet,
    disconnectWallet,
    checkNetwork,
    formatAddress,
    getUSDCBalance,

    // Dados
    connectors,
  };
}
