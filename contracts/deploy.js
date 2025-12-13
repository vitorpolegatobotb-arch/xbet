/**
 * Script de Deploy dos Smart Contracts
 * 
 * INSTRUÇÕES DE USO:
 * 
 * 1. Para Arbitrum Sepolia (Testnet):
 *    - Copie este arquivo para o Remix IDE (remix.ethereum.org)
 *    - Selecione a rede "Arbitrum Sepolia" no MetaMask
 *    - Compile os contratos (CasinoGame.sol e MockUSDC.sol)
 *    - Execute este script para fazer deploy
 * 
 * 2. Variáveis de Ambiente Necessárias:
 *    - ARBITRUM_SEPOLIA_RPC_URL (se usar Hardhat)
 *    - PRIVATE_KEY (se usar Hardhat)
 * 
 * 3. Endereços da Rede:
 *    - Arbitrum Sepolia RPC: https://sepolia-rollup.arbitrum.io/rpc
 *    - Chain ID: 421614
 *    - USDC Real (Arbitrum Sepolia): 0xaf88d065e77c8cC2239327C5EDb3A432268e5831
 */

// ============ REMIX IDE DEPLOYMENT ============
// Cole este código no Remix IDE para fazer deploy:

/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

// Deploy MockUSDC primeiro
// 1. Compile MockUSDC.sol
// 2. Clique em "Deploy" na aba "Deploy & Run Transactions"
// 3. Selecione "MockUSDC" no dropdown
// 4. Clique em "Deploy"
// 5. Copie o endereço do contrato deployado

// Depois, deploy CasinoGame
// 1. Compile CasinoGame.sol
// 2. Clique em "Deploy" na aba "Deploy & Run Transactions"
// 3. Selecione "CasinoGame" no dropdown
// 4. Insira o endereço do MockUSDC no campo de construtor
// 5. Clique em "Deploy"

// Após o deploy:
// 1. Vá para o contrato MockUSDC
// 2. Clique em "mint" e insira seu endereço e 10000000000 (10000 USDC com 6 decimais)
// 3. Vá para o contrato CasinoGame
// 4. Clique em "fundSeedCapital" e insira 5000000000 (5000 USDC)
*/

// ============ HARDHAT DEPLOYMENT ============
// Se usar Hardhat, execute: npx hardhat run contracts/deploy.js --network arbitrumSepolia

const hre = require("hardhat");

async function main() {
    console.log("🚀 Iniciando deploy dos contratos...\n");

    // ============ DEPLOY MockUSDC ============
    console.log("📝 Deployando MockUSDC...");
    const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.deployed();
    console.log("✅ MockUSDC deployado em:", mockUSDC.address);

    // ============ MINT USDC PARA TESTES ============
    console.log("\n💰 Mintando USDC para testes...");
    const mintTx = await mockUSDC.mint(
        (await hre.ethers.getSigners())[0].address,
        hre.ethers.utils.parseUnits("10000", 6) // 10000 USDC
    );
    await mintTx.wait();
    console.log("✅ 10000 USDC mintados");

    // ============ DEPLOY CasinoGame ============
    console.log("\n🎰 Deployando CasinoGame...");
    const CasinoGame = await hre.ethers.getContractFactory("CasinoGame");
    const casinoGame = await CasinoGame.deploy(mockUSDC.address);
    await casinoGame.deployed();
    console.log("✅ CasinoGame deployado em:", casinoGame.address);

    // ============ FUND SEED CAPITAL ============
    console.log("\n🌱 Financiando seed capital...");
    const seedAmount = hre.ethers.utils.parseUnits("5000", 6); // 5000 USDC
    
    // Aprovar CasinoGame para gastar USDC
    const approveTx = await mockUSDC.approve(casinoGame.address, seedAmount);
    await approveTx.wait();
    console.log("✅ Aprovado gasto de USDC");
    
    // Financiar seed capital
    const fundTx = await casinoGame.fundSeedCapital(seedAmount);
    await fundTx.wait();
    console.log("✅ Seed capital financiado com 5000 USDC");

    // ============ CONFIGURAR JOGOS ============
    console.log("\n⚙️  Configurando jogos...");
    
    const minBet = hre.ethers.utils.parseUnits("1", 6); // 1 USDC
    const maxBet = hre.ethers.utils.parseUnits("1000", 6); // 1000 USDC
    
    // Configurar Slots
    const slotsConfig = await casinoGame.configureGame(
        "slots",
        true,
        minBet,
        maxBet
    );
    await slotsConfig.wait();
    console.log("✅ Slots configurado");
    
    // Configurar Roulette
    const rouletteConfig = await casinoGame.configureGame(
        "roulette",
        true,
        minBet,
        maxBet
    );
    await rouletteConfig.wait();
    console.log("✅ Roulette configurado");

    // ============ EXIBIR INFORMAÇÕES ============
    console.log("\n" + "=".repeat(60));
    console.log("📊 INFORMAÇÕES DE DEPLOY");
    console.log("=".repeat(60));
    console.log(`\n🔗 Rede: Arbitrum Sepolia`);
    console.log(`📍 Chain ID: 421614`);
    console.log(`\n💎 MockUSDC: ${mockUSDC.address}`);
    console.log(`🎰 CasinoGame: ${casinoGame.address}`);
    
    // Obter status do pool
    const poolStatus = await casinoGame.getPoolStatus();
    console.log(`\n💰 Status do Pool:`);
    console.log(`   - Prize Pool: ${hre.ethers.utils.formatUnits(poolStatus._prizePool, 6)} USDC`);
    console.log(`   - Seed Capital: ${hre.ethers.utils.formatUnits(poolStatus._seedCapital, 6)} USDC`);
    console.log(`   - House Balance: ${hre.ethers.utils.formatUnits(poolStatus._houseBalance, 6)} USDC`);
    console.log(`   - Total Balance: ${hre.ethers.utils.formatUnits(poolStatus._totalBalance, 6)} USDC`);

    // ============ SALVAR ENDEREÇOS ============
    console.log("\n" + "=".repeat(60));
    console.log("💾 PRÓXIMOS PASSOS:");
    console.log("=".repeat(60));
    console.log(`\n1. Copie os endereços acima para o arquivo .env.local:`);
    console.log(`   VITE_CASINO_CONTRACT_ADDRESS=${casinoGame.address}`);
    console.log(`   VITE_USDC_CONTRACT_ADDRESS=${mockUSDC.address}`);
    console.log(`\n2. Adicione a rede Arbitrum Sepolia ao MetaMask:`);
    console.log(`   - Nome: Arbitrum Sepolia`);
    console.log(`   - RPC URL: https://sepolia-rollup.arbitrum.io/rpc`);
    console.log(`   - Chain ID: 421614`);
    console.log(`   - Símbolo: ETH`);
    console.log(`\n3. Importe o token USDC no MetaMask:`);
    console.log(`   - Endereço do Token: ${mockUSDC.address}`);
    console.log(`\n4. Inicie o servidor frontend:`);
    console.log(`   pnpm dev`);
    console.log("\n" + "=".repeat(60));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
