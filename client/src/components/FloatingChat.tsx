import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Users, User, X, Minimize2, Maximize2, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { useIsMobile } from '@/hooks/useMobile';

interface ChatMessage {
  id: number;
  user: string;
  address: string;
  message: string;
  timestamp: number;
  avatar?: string;
}

interface Player {
  address: string;
  username: string;
  isOnline: boolean;
  avatar?: string;
}

// Mock de dados
const mockPlayers: Player[] = [
  { address: '0x1234...abcd', username: 'NeoGamer', isOnline: true, avatar: '👾' },
  { address: '0x5678...efgh', username: 'CypherPunk', isOnline: true, avatar: '🔐' },
  { address: '0x90ab...cdef', username: 'MatrixUser', isOnline: false, avatar: '💻' },
  { address: '0x1122...3344', username: 'Web3Fan', isOnline: true, avatar: '⚡' },
  { address: '0x5566...7788', username: 'CryptoKing', isOnline: true, avatar: '👑' },
  { address: '0x9900...aabb', username: 'BlockchainPro', isOnline: false, avatar: '🔗' },
];

const mockMessages: ChatMessage[] = [
  { id: 1, user: 'CypherPunk', address: '0x5678...efgh', message: 'Alguém viu o novo jackpot?', timestamp: Date.now() - 60000, avatar: '🔐' },
  { id: 2, user: 'NeoGamer', address: '0x1234...abcd', message: 'Ainda não, mas o Neon Rocket está pagando bem hoje!', timestamp: Date.now() - 30000, avatar: '👾' },
  { id: 3, user: 'Web3Fan', address: '0x1122...3344', message: 'Alguém quer jogar blackjack comigo?', timestamp: Date.now() - 15000, avatar: '⚡' },
  { id: 4, user: 'CryptoKing', address: '0x5566...7788', message: 'Eu topo! Vamos lá', timestamp: Date.now() - 5000, avatar: '👑' },
];

export function FloatingChat() {
  const { address, isConnected } = useWeb3Wallet();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [tab, setTab] = useState<'chat' | 'players'>('chat');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simulação de envio de mensagem
  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !isConnected) return;

    const userAddress = address || '0xUnknown...';
    const username = `Player-${userAddress.slice(2, 6)}`; // Mock username

    const message: ChatMessage = {
      id: Date.now(),
      user: username,
      address: userAddress,
      message: newMessage.trim(),
      timestamp: Date.now(),
      avatar: '🎮',
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  // Scroll para o final do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onlinePlayers = mockPlayers.filter(p => p.isOnline);

  // Em mobile, usar drawer ao invés de fixed
  if (isMobile) {
    if (!isOpen) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white z-50 flex-shrink-0"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* Overlay */}
        <div 
          className="flex-1 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Chat Drawer */}
        <div className="bg-card border-t border-border rounded-t-2xl flex flex-col max-h-[90vh] w-full shadow-2xl">
          {/* Header */}
          <div className="bg-primary/10 border-b border-border p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Comunidade</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-background/50 flex-shrink-0">
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                tab === 'chat'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setTab('chat')}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                tab === 'players'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setTab('players')}
            >
              <Users className="w-4 h-4" />
              Online ({onlinePlayers.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {tab === 'chat' ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-lg flex-shrink-0">{msg.avatar || '👤'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-primary text-xs">{msg.user}</span>
                              <span className="text-muted-foreground text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-foreground text-sm break-words mt-1">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-3 border-t border-border bg-background/50 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={isConnected ? 'Mensagem...' : 'Conecte...'}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={!isConnected}
                      className="flex-1 bg-input border-border text-foreground text-sm h-9"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!isConnected || newMessage.trim() === ''}
                      size="sm"
                      className="h-9 px-3 flex-shrink-0"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {mockPlayers.map((player) => (
                    <div
                      key={player.address}
                      className="flex items-center justify-between p-2 bg-background/50 rounded border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg flex-shrink-0">{player.avatar || '👤'}</span>
                        <span className="font-mono text-xs text-foreground truncate">{player.username}</span>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-bold px-2 py-1 rounded flex-shrink-0',
                          player.isOnline
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {player.isOnline ? '●' : '○'}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 bg-card border border-border rounded-xl shadow-xl flex flex-col overflow-hidden transition-all duration-300",
      "bottom-6 right-6",
      isMinimized ? "w-80 h-14" : "w-96 h-[600px]"
    )}>
      {/* Header */}
      <div className="bg-primary/10 border-b border-border p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Comunidade</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {!isMinimized && (
        <>
          <div className="flex border-b border-border bg-background/50 flex-shrink-0">
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                tab === 'chat'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setTab('chat')}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                tab === 'players'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setTab('players')}
            >
              <Users className="w-4 h-4" />
              Online ({onlinePlayers.length})
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {tab === 'chat' ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-lg flex-shrink-0">{msg.avatar || '👤'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-primary text-xs">{msg.user}</span>
                              <span className="text-muted-foreground text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-foreground text-sm break-words mt-1">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-3 border-t border-border bg-background/50 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={isConnected ? 'Mensagem...' : 'Conecte...'}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={!isConnected}
                      className="flex-1 bg-input border-border text-foreground text-sm h-9"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!isConnected || newMessage.trim() === ''}
                      size="sm"
                      className="h-9 px-3"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {mockPlayers.map((player) => (
                    <div
                      key={player.address}
                      className="flex items-center justify-between p-2 bg-background/50 rounded border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg flex-shrink-0">{player.avatar || '👤'}</span>
                        <span className="font-mono text-xs text-foreground truncate">{player.username}</span>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-bold px-2 py-1 rounded flex-shrink-0',
                          player.isOnline
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {player.isOnline ? '●' : '○'}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </>
      )}
    </div>
  );
}
