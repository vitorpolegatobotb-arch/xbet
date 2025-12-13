import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Users, User, Zap } from 'lucide-react';
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
}

interface Player {
  address: string;
  username: string;
  isOnline: boolean;
}

// Mock de dados
const mockPlayers: Player[] = [
  { address: '0x1234...abcd', username: 'NeoGamer', isOnline: true },
  { address: '0x5678...efgh', username: 'CypherPunk', isOnline: true },
  { address: '0x90ab...cdef', username: 'MatrixUser', isOnline: false },
  { address: '0x1122...3344', username: 'Web3Fan', isOnline: true },
];

const mockMessages: ChatMessage[] = [
  { id: 1, user: 'CypherPunk', address: '0x5678...efgh', message: 'Alguém viu o novo jackpot?', timestamp: Date.now() - 60000 },
  { id: 2, user: 'NeoGamer', address: '0x1234...abcd', message: 'Ainda não, mas o Neon Rocket está pagando bem hoje!', timestamp: Date.now() - 30000 },
];

export function LiveChat() {
  const { address, isConnected } = useWeb3Wallet();
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [tab, setTab] = useState<'chat' | 'players'>('chat');
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
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  // Scroll para o final do chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onlinePlayers = mockPlayers.filter(p => p.isOnline);

  return (
    <div className="card-neon h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-cyan-500/30">
        <button
          className={cn(
            'flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors',
            tab === 'chat' ? 'neon-text-pink border-b-2 border-pink-500' : 'text-gray-400 hover:text-white'
          )}
          onClick={() => setTab('chat')}
        >
          <MessageSquare className="w-4 h-4" />
          Chat ao Vivo
        </button>
        <button
          className={cn(
            'flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors',
            tab === 'players' ? 'neon-text-pink border-b-2 border-pink-500' : 'text-gray-400 hover:text-white'
          )}
          onClick={() => setTab('players')}
        >
          <Users className="w-4 h-4" />
          Players ({onlinePlayers.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'chat' ? (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-3 text-sm">
                  <span className="font-bold text-pink-300 mr-2">{msg.user}:</span>
                  <span className="text-gray-300">{msg.message}</span>
                  <div className="text-xs text-gray-500 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-cyan-500/30">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={isConnected ? 'Digite sua mensagem...' : 'Conecte a carteira para falar...'}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!isConnected}
                  className="flex-1 bg-gray-800 border-cyan-500/30 text-cyan-300"
                />
                <Button onClick={handleSendMessage} disabled={!isConnected || newMessage.trim() === ''}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {mockPlayers.map((player) => (
                <div key={player.address} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-cyan-400" />
                    <span className="font-mono text-sm text-gray-300">{player.username}</span>
                  </div>
                  <span className={cn('text-xs font-bold', player.isOnline ? 'text-green-400' : 'text-red-400')}>
                    {player.isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
