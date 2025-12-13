import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Users, User, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';

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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-full shadow-lg hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center text-white z-50 animate-pulse"
      >
        <MessageSquare className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900 border-2 border-cyan-500/50 rounded-xl shadow-2xl shadow-cyan-500/30 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-pink-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-white" />
          <h3 className="font-orbitron font-bold text-white">CYBERPUNK CHAT</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      {!isMinimized && (
        <>
          <div className="flex border-b border-cyan-500/30 bg-gray-800/50">
            <button
              className={cn(
                'flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors',
                tab === 'chat'
                  ? 'neon-text-pink border-b-2 border-pink-500 bg-gray-800'
                  : 'text-gray-400 hover:text-white'
              )}
              onClick={() => setTab('chat')}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button
              className={cn(
                'flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors',
                tab === 'players'
                  ? 'neon-text-pink border-b-2 border-pink-500 bg-gray-800'
                  : 'text-gray-400 hover:text-white'
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
                <ScrollArea className="flex-1 p-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="mb-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{msg.avatar || '👤'}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-pink-300 text-xs">{msg.user}</span>
                            <span className="text-gray-500 text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-gray-300 text-sm break-words">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </ScrollArea>

                {/* Input */}
                <div className="p-3 border-t border-cyan-500/30 bg-gray-800/50">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={isConnected ? 'Escrever...' : 'Conecte...'}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={!isConnected}
                      className="flex-1 bg-gray-700 border-cyan-500/30 text-cyan-300 text-sm h-9"
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
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                  {mockPlayers.map((player) => (
                    <div
                      key={player.address}
                      className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-700/30 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{player.avatar || '👤'}</span>
                        <span className="font-mono text-xs text-gray-300">{player.username}</span>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-bold px-2 py-1 rounded',
                          player.isOnline
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
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
