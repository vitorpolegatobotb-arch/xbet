// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token para testes na Arbitrum Sepolia
 * Em produção, use o USDC real da Arbitrum
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "USDC") {
        // Mint 1 milhão de USDC para o proprietário
        // USDC tem 6 decimais
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    /**
     * @dev Função para que qualquer um possa fazer mint de USDC para testes
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @dev Retornar número de decimais (USDC usa 6)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
