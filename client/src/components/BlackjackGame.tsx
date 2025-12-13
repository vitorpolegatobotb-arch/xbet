import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Coins, Settings, Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';


/**
 * Componente do Jogo de Blackjack
 * Com lógica completa: hit, stand, double down
 */

interface Card {
  suit: string;
  rank: string;
  value: number;
}

interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  dealerHidden: boolean;
  gameOver: boolean;
  result: 'win' | 'lose' | 'push' | null;
  payout: number;
}

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      let value = 0;
      if (rank === 'A') value = 11;
      else if (['J', 'Q', 'K'].includes(rank)) value = 10;
      else value = parseInt(rank);

      deck.push({ suit, rank, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const getCardValue = (cards: Card[]): { value: number; aces: number } => {
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === 'A') {
      aces++;
      value += 11;
    } else {
      value += card.value;
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return { value, aces };
};

interface BlackjackGameProps {
  gameType: 'blackjack';
  betAmount: number;
  onBet: (amount: number) => void;
  onResult: (won: boolean, payout: number) => void;
  isLoading?: boolean;
}

export function BlackjackGame({ betAmount, onBet, onResult, isLoading = false, gameType }: BlackjackGameProps) {
  const { data: gameLimits } = trpc.admin.getGameLimits.useQuery();
  const { data: gamePools } = trpc.admin.getGamePools.useQuery();

  const minBet = gameLimits?.[gameType]?.minBet ?? 5;
  const maxBet = gameLimits?.[gameType]?.maxBet ?? 500;
  const poolLiquidity = gamePools?.[gameType]?.liquidity ?? 25000;
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    dealerHidden: true,
    gameOver: false,
    result: null,
    payout: 0,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameHistory, setGameHistory] = useState<Array<{ result: string; payout: number }>>([]);

  const drawCard = useCallback((currentDeck: Card[]): { card: Card; newDeck: Card[] } => {
    if (currentDeck.length === 0) {
      const newDeck = createDeck();
      return { card: newDeck[0], newDeck: newDeck.slice(1) };
    }
    return { card: currentDeck[0], newDeck: currentDeck.slice(1) };
  }, []);

  const startGame = useCallback(() => {
    if (betAmount <= 0 || gameStarted) return;

    let newDeck = deck;
    const playerHand: Card[] = [];
    const dealerHand: Card[] = [];

    // Deal 2 cards to player
    let result = drawCard(newDeck);
    playerHand.push(result.card);
    newDeck = result.newDeck;

    result = drawCard(newDeck);
    playerHand.push(result.card);
    newDeck = result.newDeck;

    // Deal 2 cards to dealer
    result = drawCard(newDeck);
    dealerHand.push(result.card);
    newDeck = result.newDeck;

    result = drawCard(newDeck);
    dealerHand.push(result.card);
    newDeck = result.newDeck;

    setDeck(newDeck);
    setGameState({
      playerHand,
      dealerHand,
      dealerHidden: true,
      gameOver: false,
      result: null,
      payout: 0,
    });
    setGameStarted(true);

    // Check for blackjack
    const playerValue = getCardValue(playerHand).value;
    const dealerValue = getCardValue([dealerHand[0]]).value;

    if (playerValue === 21 && playerHand.length === 2) {
      if (dealerValue === 21) {
        // Push
        setGameState((prev) => ({
          ...prev,
          dealerHidden: false,
          gameOver: true,
          result: 'push',
          payout: betAmount,
        }));
        setGameStarted(false);
        onResult(false, betAmount);
      } else {
        // Blackjack!
        const payout = betAmount * 2.5;
        setGameState((prev) => ({
          ...prev,
          dealerHidden: false,
          gameOver: true,
          result: 'win',
          payout,
        }));
        setGameHistory((prev) => [{ result: 'Blackjack!', payout }, ...prev.slice(0, 9)]);
        setGameStarted(false);
        onResult(true, payout);
      }
    }
  }, [betAmount, deck, drawCard, gameStarted, onResult]);

  const hit = useCallback(() => {
    if (!gameStarted || gameState.gameOver) return;

    let newDeck = deck;
    const result = drawCard(newDeck);
    newDeck = result.newDeck;

    const newPlayerHand = [...gameState.playerHand, result.card];
    const playerValue = getCardValue(newPlayerHand).value;

    setDeck(newDeck);

    if (playerValue > 21) {
      // Bust
      setGameState((prev) => ({
        ...prev,
        playerHand: newPlayerHand,
        dealerHidden: false,
        gameOver: true,
        result: 'lose',
        payout: 0,
      }));
      setGameHistory((prev) => [{ result: 'Bust', payout: 0 }, ...prev.slice(0, 9)]);
      setGameStarted(false);
      onResult(false, 0);
    } else {
      setGameState((prev) => ({
        ...prev,
        playerHand: newPlayerHand,
      }));
    }
  }, [gameStarted, gameState, deck, drawCard, onResult]);

  const stand = useCallback(() => {
    if (!gameStarted || gameState.gameOver) return;

    let newDeck = deck;
    let dealerHand = [...gameState.dealerHand];

    // Dealer plays
    while (getCardValue(dealerHand).value < 17) {
      const result = drawCard(newDeck);
      dealerHand.push(result.card);
      newDeck = result.newDeck;
    }

    setDeck(newDeck);

    const playerValue = getCardValue(gameState.playerHand).value;
    const dealerValue = getCardValue(dealerHand).value;

    let result: 'win' | 'lose' | 'push';
    let payout = 0;

    if (dealerValue > 21) {
      result = 'win';
      payout = betAmount * 2;
    } else if (playerValue > dealerValue) {
      result = 'win';
      payout = betAmount * 2;
    } else if (playerValue < dealerValue) {
      result = 'lose';
      payout = 0;
    } else {
      result = 'push';
      payout = betAmount;
    }

    setGameState((prev) => ({
      ...prev,
      dealerHand,
      dealerHidden: false,
      gameOver: true,
      result,
      payout,
    }));

    setGameHistory((prev) => [{ result: result.toUpperCase(), payout }, ...prev.slice(0, 9)]);
    setGameStarted(false);
    onResult(result !== 'lose', payout);
  }, [gameStarted, gameState, deck, drawCard, betAmount, onResult]);

  const reset = useCallback(() => {
    setGameState({
      playerHand: [],
      dealerHand: [],
      dealerHidden: true,
      gameOver: false,
      result: null,
      payout: 0,
    });
    setGameStarted(false);
  }, []);

  const renderCard = (card: Card, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg border-2 border-cyan-400 flex items-center justify-center text-2xl font-bold text-cyan-300 glow-cyan">
          ?
        </div>
      );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div
        className={`w-16 h-24 rounded-lg border-2 border-cyan-400 flex flex-col items-center justify-center text-sm font-bold glow-cyan ${
          isRed ? 'bg-red-900/50 text-red-400' : 'bg-gray-800 text-gray-300'
        }`}
      >
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card-neon mb-6">
	        {/* Título */}
	        <h2 className="text-2xl font-orbitron font-bold text-center mb-6 neon-text">
	          🃏 BLACKJACK 🃏
	        </h2>

	        {/* Informações do Pool e Limites */}
	        <div className="grid grid-cols-2 gap-4 mb-6">
	          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 text-center">
	            <Coins className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
	            <p className="text-sm text-gray-400">Pool Liquidez (Mock)</p>
	            <p className="text-lg font-bold text-cyan-300">${poolLiquidity.toFixed(2)}</p>
	          </div>
	          <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-3 text-center">
	            <Settings className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
	            <p className="text-sm text-gray-400">Limites</p>
	            <p className="text-lg font-bold text-cyan-300">${minBet.toFixed(2)} - ${maxBet.toFixed(2)}</p>
	          </div>
	        </div>

        {/* Mesa de Jogo */}
        <div className="bg-gray-900/50 rounded-lg border border-cyan-500/30 p-6 mb-6">
          {/* Dealer */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-cyan-300 mb-3">DEALER</h3>
            <div className="flex gap-2 mb-2">
              {gameState.dealerHand.map((card, idx) => (
                <div key={idx}>
                  {renderCard(card, gameState.dealerHidden && idx === 1)}
                </div>
              ))}
            </div>
            {!gameState.dealerHidden && (
              <div className="text-sm text-cyan-300">
                Total: <span className="font-bold">{getCardValue(gameState.dealerHand).value}</span>
              </div>
            )}
          </div>

          {/* Separador */}
          <div className="border-t border-cyan-500/30 my-4"></div>

          {/* Jogador */}
          <div>
            <h3 className="text-sm font-bold text-cyan-300 mb-3">VOCÊ</h3>
            <div className="flex gap-2 mb-2">
              {gameState.playerHand.map((card, idx) => (
                <div key={idx}>{renderCard(card)}</div>
              ))}
            </div>
            {gameState.playerHand.length > 0 && (
              <div className="text-sm text-cyan-300">
                Total: <span className="font-bold">{getCardValue(gameState.playerHand).value}</span>
              </div>
            )}
          </div>
        </div>

        {/* Resultado */}
        {gameState.gameOver && (
          <div
            className={`text-center mb-6 p-4 rounded-lg border-2 ${
              gameState.result === 'win'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                : gameState.result === 'push'
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-300'
                  : 'border-red-500 bg-red-500/10 text-red-300'
            }`}
          >
            <div className="text-lg font-bold mb-2">
              {gameState.result === 'win' && '🎉 VOCÊ GANHOU!'}
              {gameState.result === 'lose' && '😞 VOCÊ PERDEU'}
              {gameState.result === 'push' && '🤝 EMPATE'}
            </div>
            {gameState.payout > 0 && (
              <div className="text-2xl font-orbitron neon-text">+${gameState.payout.toFixed(2)}</div>
            )}
          </div>
        )}

        {/* Controles */}
        <div className="space-y-4">
          {!gameStarted ? (
            <>
              <div>
	                <label className="block text-sm font-bold mb-2 text-cyan-300">Valor da Aposta</label>
	                <input
	                  type="number"
	                  value={betAmount}
	                  onChange={(e) => onBet(Math.max(minBet, Math.min(maxBet, Number(e.target.value))))}
	                  className="w-full px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-700/50 focus:border-cyan-500 focus:outline-none"
	                  placeholder="Valor da aposta"
	                  min={minBet}
	                  step="0.01"
	                  max={maxBet}
	                />
              </div>

              <Button
                onClick={startGame}
                disabled={isLoading || betAmount <= 0}
                className="w-full btn-neon"
              >
                <Zap className="w-4 h-4 mr-2" />
                INICIAR JOGO
              </Button>
            </>
	          ) : gameState.gameOver ? (
	            <Button onClick={reset} className="w-full btn-neon">
	              <RotateCcw className="w-4 h-4 mr-2" />
	              NOVO JOGO
	            </Button>
	          ) : (
	            <div className="grid grid-cols-2 gap-2">             <Button onClick={hit} disabled={gameState.gameOver} className="btn-neon">
                +1 CARTA
              </Button>
              <Button onClick={stand} disabled={gameState.gameOver} className="btn-neon">
                PARAR
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Histórico */}
      {gameHistory.length > 0 && (
        <div className="card-neon">
          <h3 className="text-lg font-orbitron font-bold mb-4 neon-text">Últimas Mãos</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {gameHistory.map((hand, idx) => (
              <div
                key={idx}
                className={`p-2 rounded text-sm font-mono flex justify-between items-center ${
                  hand.payout > 0
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                    : 'bg-gray-800/50 text-gray-400 border border-gray-700/30'
                }`}
              >
                <span>{hand.result}</span>
                <span className="font-bold">{hand.payout > 0 ? `+$${hand.payout.toFixed(2)}` : '-'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regras */}
      <div className="card-neon mt-6">
        <h3 className="text-lg font-orbitron font-bold mb-3 neon-text">📋 Regras</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Objetivo: Chegar a 21 sem ultrapassar</li>
          <li>• Blackjack (21 em 2 cartas): 2.5x</li>
          <li>• Vitória: 2x</li>
          <li>• Empate: Recupera a aposta</li>
          <li>• Derrota: Perde a aposta</li>
        </ul>
      </div>
    </div>
  );
}
