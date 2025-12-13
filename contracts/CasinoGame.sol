// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CasinoGame
 * @dev Smart contract para gerenciar apostas, prêmios e seed capital do cassino
 * Suporta múltiplos jogos (slots, roleta, dados, blackjack) com house edge de 5%
 */
contract CasinoGame is ReentrancyGuard, Ownable, Pausable {
    // ============ CONSTANTS ============
    uint256 public constant HOUSE_EDGE_PERCENTAGE = 5; // 5% de rake/house edge
    uint256 public constant PRECISION = 100; // Para cálculos de percentual

    // ============ STATE VARIABLES ============
    IERC20 public usdcToken;
    
    // Pool de prêmios
    uint256 public prizePool;
    uint256 public seedCapital;
    uint256 public houseBalance; // Saldo da casa (rake acumulado)
    
    // Rastreamento de jogadores
    mapping(address => uint256) public playerBalances;
    mapping(address => uint256) public totalBets;
    mapping(address => uint256) public totalWinnings;
    mapping(address => uint256) public gameCount;
    
    // Rastreamento de jogos
    uint256 public totalGamesPlayed;
    uint256 public totalUSDCProcessed;
    
    // Configurações de jogos
    mapping(string => bool) public enabledGames; // "slots", "roulette", "dice", "blackjack"
    mapping(string => uint256) public gameMinBet;
    mapping(string => uint256) public gameMaxBet;
    
    // Histórico de transações
    struct GameResult {
        address player;
        string gameType;
        uint256 betAmount;
        uint256 payout;
        uint256 rake;
        uint256 timestamp;
        bool won;
    }
    
    GameResult[] public gameHistory;
    mapping(address => uint256[]) public playerGameIndices;

    // ============ EVENTS ============
    event GameEntered(
        address indexed player,
        string gameType,
        uint256 betAmount,
        uint256 timestamp
    );
    
    event GameResulted(
        address indexed player,
        string gameType,
        uint256 betAmount,
        uint256 payout,
        uint256 rake,
        bool won,
        uint256 timestamp
    );
    
    event PayoutDistributed(
        address indexed player,
        uint256 amount,
        uint256 timestamp
    );
    
    event RakeCollected(
        uint256 amount,
        uint256 timestamp
    );
    
    event SeedCapitalFunded(
        uint256 amount,
        uint256 totalSeedCapital,
        uint256 timestamp
    );
    
    event SeedCapitalWithdrawn(
        uint256 amount,
        uint256 remainingSeedCapital,
        uint256 timestamp
    );
    
    event PrizePoolUpdated(
        uint256 newBalance,
        uint256 timestamp
    );
    
    event GameConfigured(
        string gameType,
        bool enabled,
        uint256 minBet,
        uint256 maxBet,
        uint256 timestamp
    );

    // ============ MODIFIERS ============
    modifier gameExists(string memory gameType) {
        require(enabledGames[gameType], "Game not enabled");
        _;
    }

    modifier validBetAmount(string memory gameType, uint256 amount) {
        require(amount >= gameMinBet[gameType], "Bet below minimum");
        require(amount <= gameMaxBet[gameType], "Bet above maximum");
        _;
    }

    // ============ CONSTRUCTOR ============
    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
        
        // Configurar jogos padrão
        enabledGames["slots"] = true;
        enabledGames["roulette"] = true;
        enabledGames["dice"] = false;
        enabledGames["blackjack"] = false;
        
        // Configurar limites de apostas (em USDC com 6 decimais)
        gameMinBet["slots"] = 1 * 10**6; // 1 USDC
        gameMaxBet["slots"] = 1000 * 10**6; // 1000 USDC
        
        gameMinBet["roulette"] = 1 * 10**6; // 1 USDC
        gameMaxBet["roulette"] = 1000 * 10**6; // 1000 USDC
        
        gameMinBet["dice"] = 1 * 10**6;
        gameMaxBet["dice"] = 1000 * 10**6;
        
        gameMinBet["blackjack"] = 1 * 10**6;
        gameMaxBet["blackjack"] = 1000 * 10**6;
    }

    // ============ GAME ENTRY ============
    /**
     * @dev Jogador entra em um jogo com um buy-in
     * @param gameType Tipo de jogo ("slots", "roulette", "dice", "blackjack")
     * @param betAmount Valor da aposta em USDC
     */
    function enterGame(
        string memory gameType,
        uint256 betAmount
    ) external gameExists(gameType) validBetAmount(gameType, betAmount) nonReentrant whenNotPaused {
        require(betAmount > 0, "Bet amount must be greater than 0");
        require(prizePool + seedCapital >= betAmount, "Insufficient prize pool");
        
        // Transferir USDC do jogador para o contrato
        require(
            usdcToken.transferFrom(msg.sender, address(this), betAmount),
            "USDC transfer failed"
        );
        
        // Atualizar estado
        prizePool += betAmount;
        totalBets[msg.sender] += betAmount;
        gameCount[msg.sender]++;
        totalGamesPlayed++;
        totalUSDCProcessed += betAmount;
        
        emit GameEntered(msg.sender, gameType, betAmount, block.timestamp);
    }

    // ============ GAME PAYOUT ============
    /**
     * @dev Distribuir payout para o jogador após resultado do jogo
     * Calcula automaticamente o rake (5%) e deduz do payout
     * @param player Endereço do jogador
     * @param betAmount Valor original da aposta
     * @param multiplier Multiplicador de ganho (ex: 2.0 = dobro)
     * @param gameType Tipo de jogo
     */
    function payout(
        address player,
        uint256 betAmount,
        uint256 multiplier,
        string memory gameType
    ) external onlyOwner nonReentrant {
        require(player != address(0), "Invalid player address");
        require(betAmount > 0, "Invalid bet amount");
        require(multiplier > 0, "Invalid multiplier");
        require(prizePool >= betAmount, "Insufficient prize pool for bet deduction");
        
        // Deduzir aposta do pool
        prizePool -= betAmount;
        
        // Calcular payout bruto
        uint256 payoutAmount = (betAmount * multiplier) / 100; // multiplier em basis points
        
        // Calcular rake (5% do payout)
        uint256 rakeAmount = (payoutAmount * HOUSE_EDGE_PERCENTAGE) / 100;
        uint256 netPayout = payoutAmount - rakeAmount;
        
        // Validar que há saldo suficiente no pool
        require(
            prizePool + seedCapital >= netPayout,
            "Insufficient funds for payout"
        );
        
        // Atualizar balances
        if (netPayout > 0) {
            if (seedCapital >= netPayout) {
                seedCapital -= netPayout;
            } else {
                uint256 fromPool = netPayout - seedCapital;
                prizePool -= fromPool;
                seedCapital = 0;
            }
            
            // Transferir USDC ao jogador
            require(
                usdcToken.transfer(player, netPayout),
                "USDC transfer to player failed"
            );
            
            totalWinnings[player] += netPayout;
            
            emit PayoutDistributed(player, netPayout, block.timestamp);
        }
        
        // Adicionar rake ao saldo da casa
        houseBalance += rakeAmount;
        
        // Registrar resultado do jogo
        GameResult memory result = GameResult({
            player: player,
            gameType: gameType,
            betAmount: betAmount,
            payout: netPayout,
            rake: rakeAmount,
            timestamp: block.timestamp,
            won: netPayout > 0
        });
        
        gameHistory.push(result);
        playerGameIndices[player].push(gameHistory.length - 1);
        
        emit GameResulted(
            player,
            gameType,
            betAmount,
            netPayout,
            rakeAmount,
            netPayout > 0,
            block.timestamp
        );
    }

    // ============ RAKE COLLECTION ============
    /**
     * @dev Coletar rake acumulado para a carteira do proprietário
     */
    function collectRake() external onlyOwner nonReentrant {
        require(houseBalance > 0, "No rake to collect");
        
        uint256 rakeAmount = houseBalance;
        houseBalance = 0;
        
        require(
            usdcToken.transfer(msg.sender, rakeAmount),
            "USDC transfer failed"
        );
        
        emit RakeCollected(rakeAmount, block.timestamp);
    }

    // ============ SEED CAPITAL MANAGEMENT ============
    /**
     * @dev Financiar o seed capital inicial do cassino
     * @param amount Valor em USDC a adicionar ao seed capital
     */
    function fundSeedCapital(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transferir USDC do proprietário para o contrato
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );
        
        seedCapital += amount;
        
        emit SeedCapitalFunded(amount, seedCapital, block.timestamp);
    }

    /**
     * @dev Retirar seed capital (quando não mais necessário)
     * @param amount Valor em USDC a retirar do seed capital
     */
    function withdrawSeedCapital(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= seedCapital, "Insufficient seed capital");
        
        seedCapital -= amount;
        
        require(
            usdcToken.transfer(msg.sender, amount),
            "USDC transfer failed"
        );
        
        emit SeedCapitalWithdrawn(amount, seedCapital, block.timestamp);
    }

    // ============ GAME CONFIGURATION ============
    /**
     * @dev Configurar um jogo (ativar/desativar e limites de apostas)
     */
    function configureGame(
        string memory gameType,
        bool enabled,
        uint256 minBet,
        uint256 maxBet
    ) external onlyOwner {
        require(minBet > 0, "Min bet must be greater than 0");
        require(maxBet >= minBet, "Max bet must be >= min bet");
        
        enabledGames[gameType] = enabled;
        gameMinBet[gameType] = minBet;
        gameMaxBet[gameType] = maxBet;
        
        emit GameConfigured(gameType, enabled, minBet, maxBet, block.timestamp);
    }

    // ============ EMERGENCY FUNCTIONS ============
    /**
     * @dev Pausar todas as operações do cassino (emergência)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Retomar operações do cassino
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Retirada de emergência (apenas proprietário)
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        uint256 balance = usdcToken.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        
        require(
            usdcToken.transfer(msg.sender, balance),
            "USDC transfer failed"
        );
    }

    // ============ VIEW FUNCTIONS ============
    /**
     * @dev Obter saldo total do contrato
     */
    function getContractBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }

    /**
     * @dev Obter status do pool de prêmios
     */
    function getPoolStatus() external view returns (
        uint256 _prizePool,
        uint256 _seedCapital,
        uint256 _houseBalance,
        uint256 _totalBalance
    ) {
        return (
            prizePool,
            seedCapital,
            houseBalance,
            usdcToken.balanceOf(address(this))
        );
    }

    /**
     * @dev Obter estatísticas do jogador
     */
    function getPlayerStats(address player) external view returns (
        uint256 _totalBets,
        uint256 _totalWinnings,
        uint256 _gameCount
    ) {
        return (
            totalBets[player],
            totalWinnings[player],
            gameCount[player]
        );
    }

    /**
     * @dev Obter histórico de jogos do jogador
     */
    function getPlayerGameHistory(address player) external view returns (GameResult[] memory) {
        uint256[] memory indices = playerGameIndices[player];
        GameResult[] memory results = new GameResult[](indices.length);
        
        for (uint256 i = 0; i < indices.length; i++) {
            results[i] = gameHistory[indices[i]];
        }
        
        return results;
    }

    /**
     * @dev Obter total de jogos registrados
     */
    function getTotalGamesPlayed() external view returns (uint256) {
        return totalGamesPlayed;
    }

    /**
     * @dev Obter configuração de um jogo
     */
    function getGameConfig(string memory gameType) external view returns (
        bool enabled,
        uint256 minBet,
        uint256 maxBet
    ) {
        return (
            enabledGames[gameType],
            gameMinBet[gameType],
            gameMaxBet[gameType]
        );
    }

    /**
     * @dev Obter tamanho do histórico de jogos
     */
    function getGameHistoryLength() external view returns (uint256) {
        return gameHistory.length;
    }

    /**
     * @dev Obter um resultado de jogo específico
     */
    function getGameResult(uint256 index) external view returns (GameResult memory) {
        require(index < gameHistory.length, "Index out of bounds");
        return gameHistory[index];
    }
}
