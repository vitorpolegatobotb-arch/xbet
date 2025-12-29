import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { Button } from '@/components/ui/button';
import { AlertCircle, Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/useMobile';

/**
 * Componente de Conexão de Carteira com design profissional
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

  const isMobile = useIsMobile();
  const [showConnectorMenu, setShowConnectorMenu] = useState(false);

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConnectorMenu(!showConnectorMenu)}
          disabled={isConnecting}
          className="px-4 sm:px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 text-sm flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">
            {isConnecting ? 'Conectando...' : 'Conectar'}
          </span>
          <span className="sm:hidden">
            {isConnecting ? '...' : 'Conectar'}
          </span>
        </button>

        {showConnectorMenu && (
          <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-48">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connectWallet(connector.id);
                  setShowConnectorMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-primary/10 border-b border-border last:border-b-0 text-foreground hover:text-primary transition-colors text-sm"
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
      {isWrongNetwork && (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-xs text-red-400">Rede Incorreta</span>
        </div>
      )}

      <div className="hidden sm:block px-3 sm:px-4 py-2 bg-card border border-border rounded-lg">
        <div className="text-xs text-muted-foreground">Saldo USDC</div>
        <div className="text-lg font-bold text-primary">${getUSDCBalance()}</div>
      </div>

      <div className="hidden sm:block px-3 sm:px-4 py-2 bg-card border border-border rounded-lg">
        <div className="text-xs text-muted-foreground">Carteira</div>
        <div className="text-sm font-mono text-foreground">{formatAddress(address || '')}</div>
      </div>

      <Button
        onClick={disconnectWallet}
        disabled={isDisconnecting}
        variant="outline"
        size="sm"
        className="border-border hover:bg-red-500/10 text-red-400 hover:text-red-500 text-xs sm:text-sm"
      >
        <LogOut className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Desconectar</span>
        <span className="sm:hidden">Sair</span>
      </Button>
    </div>
  );
}
