import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wallet, LogOut } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente de Conexão de Carteira com tema Cyberpunk
 * Exibe status de conexão, saldo e botões de ação
 */
export function WalletConnect() {
  const {
    address,
    isConnected,
    isConnecting,
    isDisconnecting,
    isWrongNetwork,
    balance,
    connectWallet,
    disconnectWallet,
    formatAddress,
    getUSDCBalance,
    connectors,
  } = useWeb3Wallet();

  const [showConnectorMenu, setShowConnectorMenu] = useState(false);

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConnectorMenu(!showConnectorMenu)}
          disabled={isConnecting}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 border border-cyan-400 uppercase text-sm tracking-wider"
        >
          <Wallet className="inline mr-2 w-4 h-4" />
          {isConnecting ? 'Conectando...' : 'Conectar Carteira'}
        </button>

        {showConnectorMenu && (
          <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/30 z-50 min-w-48">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connectWallet(connector.id);
                  setShowConnectorMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-cyan-500/20 border-b border-cyan-500/30 last:border-b-0 text-cyan-300 hover:text-cyan-100 transition-colors"
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isWrongNetwork && (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-500 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-300">Rede Incorreta</span>
        </div>
      )}

      <div className="px-4 py-2 bg-gray-800 border border-cyan-500/50 rounded-lg">
        <div className="text-xs text-gray-400">Saldo USDC</div>
        <div className="text-lg font-bold text-cyan-400">${getUSDCBalance()}</div>
      </div>

      <div className="px-4 py-2 bg-gray-800 border border-cyan-500/50 rounded-lg">
        <div className="text-xs text-gray-400">Carteira</div>
        <div className="text-sm font-mono text-cyan-300">{formatAddress(address || '')}</div>
      </div>

      <Button
        onClick={disconnectWallet}
        disabled={isDisconnecting}
        variant="outline"
        size="sm"
        className="border-red-500/50 hover:bg-red-500/20 text-red-400 hover:text-red-300"
      >
        <LogOut className="w-4 h-4 mr-1" />
        Desconectar
      </Button>
    </div>
  );
}
