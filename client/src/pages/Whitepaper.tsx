import { Button } from "@/components/ui/button";
import { Zap, Trophy, Coins, Rocket, Gem, Info, ArrowLeft, Shield, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";

/**
 * Página Whitepaper - Explicação Detalhada do Projeto
 */

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-orbitron font-bold neon-text">CYBERPUNK CASINO</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="btn-neon-outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-4 neon-text-pink">
            📜 WHITEPAPER
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A revolução descentralizada dos cassinos Web3 no universo Cyberpunk
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Section 1: Introdução */}
          <section className="card-neon p-8">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-orbitron font-bold neon-text">1. Introdução: O Futuro do Jogo</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              O <strong className="text-cyan-300">Cyberpunk Web3 Casino</strong> é uma plataforma de jogos de azar descentralizada construída na blockchain Arbitrum. Nosso objetivo é oferecer uma experiência de cassino transparente, segura e imersiva, com um tema visual inspirado no universo Cyberpunk.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Combinamos a tecnologia blockchain com jogos de alta qualidade, criando um ecossistema onde os jogadores têm controle total sobre seus fundos e podem verificar a integridade de cada aposta.
            </p>
          </section>

          {/* Section 2: Transparência e Segurança */}
          <section className="card-neon p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-orbitron font-bold neon-text">2. Transparência e Segurança (Web3)</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-cyan-300 mb-2">⛓️ Blockchain</h4>
                <p className="text-gray-300">
                  Utilizamos a rede <strong>Arbitrum Sepolia (Testnet)</strong> para transações rápidas e de baixo custo. Todos os dados de apostas são registrados imutavelmente na blockchain.
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-cyan-300 mb-2">💰 Token</h4>
                <p className="text-gray-300">
                  Todas as apostas e prêmios são feitos com <strong>Mock USDC</strong> (um token de teste com 6 decimais), garantindo estabilidade de valor e compatibilidade com o ecossistema DeFi.
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-cyan-300 mb-2">🔐 Contratos Inteligentes</h4>
                <p className="text-gray-300">
                  A lógica de jogo (House Edge, Rake, Jackpot) é regida por contratos inteligentes auditáveis, garantindo <strong>fairness</strong> e transparência total.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Jogos Disponíveis */}
          <section className="card-neon p-8">
            <div className="flex items-center gap-3 mb-4">
              <Gem className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-orbitron font-bold neon-text">3. Jogos Disponíveis</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Nossa plataforma oferece uma seleção de jogos populares, cada um com seu próprio toque Cyberpunk:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-pink-300 mb-2">🎰 Caça-Níqueis</h4>
                <p className="text-gray-300 text-sm mb-2">Gire os rolos e tente a sorte grande.</p>
                <p className="text-cyan-300 font-bold text-sm">House Edge: 5%</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-pink-300 mb-2">🃏 Blackjack</h4>
                <p className="text-gray-300 text-sm mb-2">O clássico 21. Blackjack paga 2.5x!</p>
                <p className="text-cyan-300 font-bold text-sm">House Edge: 2%</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-pink-300 mb-2">🚀 Neon Rocket (Crash)</h4>
                <p className="text-gray-300 text-sm mb-2">Retire sua aposta antes que o foguete caia.</p>
                <p className="text-cyan-300 font-bold text-sm">House Edge: 5%</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-pink-300 mb-2">💎 Diamond Mines</h4>
                <p className="text-gray-300 text-sm mb-2">Campo minado com multiplicadores crescentes.</p>
                <p className="text-cyan-300 font-bold text-sm">House Edge: 5%</p>
              </div>
            </div>
          </section>

          {/* Section 4: Economia e Premiações */}
          <section className="card-neon p-8">
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-orbitron font-bold neon-text">4. Economia e Premiações</h3>
            </div>
            
            <div className="mb-8">
              <h4 className="text-xl font-bold text-cyan-300 mb-4">4.1. Rake e Liquidez</h4>
              <p className="text-gray-300 mb-4">
                Uma pequena porcentagem de cada aposta (o <strong>Rake</strong>) é distribuída para:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-pink-500/30">
                  <p className="text-gray-300"><strong className="text-pink-300">Pool de Liquidez:</strong> Garante que o cassino sempre tenha fundos para pagar grandes prêmios.</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-pink-500/30">
                  <p className="text-gray-300"><strong className="text-pink-300">Jackpot:</strong> Contribui para o prêmio acumulado que cresce a cada aposta.</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-pink-500/30">
                  <p className="text-gray-300"><strong className="text-pink-300">Operação:</strong> Cobre custos de infraestrutura, desenvolvimento e manutenção.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-cyan-300 mb-4">4.2. Jackpot Acumulado</h4>
              <p className="text-gray-300 mb-4">
                O Jackpot é um prêmio progressivo que cresce a cada aposta feita na plataforma.
              </p>
              <div className="space-y-3">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-yellow-500/30">
                  <p className="text-gray-300"><strong className="text-yellow-300">Acúmulo:</strong> Uma porcentagem do Rake de cada jogo é destinada ao Jackpot.</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-yellow-500/30">
                  <p className="text-gray-300"><strong className="text-yellow-300">Sorteio:</strong> O Jackpot é sorteado semanalmente entre os <strong>Top 10 Players</strong> com maior volume de apostas.</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-yellow-500/30">
                  <p className="text-gray-300"><strong className="text-yellow-300">Transparência:</strong> Todos os sorteios são registrados na blockchain e podem ser verificados.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Comunidade e Interação */}
          <section className="card-neon p-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-orbitron font-bold neon-text">5. Comunidade e Interação</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Acreditamos que a experiência de jogo é melhor quando compartilhada. Por isso, implementamos recursos sociais robustos:
            </p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-cyan-300 mb-2">💬 Chat ao Vivo</h4>
                <p className="text-gray-300">
                  Um chat em tempo real permite que os jogadores interajam, compartilhem estratégias, celebrem vitórias e façam novas amizades. Veja quem está online e conecte-se com a comunidade.
                </p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/30">
                <h4 className="font-bold text-cyan-300 mb-2">🏆 Ranking Semanal</h4>
                <p className="text-gray-300">
                  Motiva a competição saudável e define os elegíveis para o sorteio do Jackpot. Suba no ranking e ganhe prêmios exclusivos!
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Conclusão */}
          <section className="card-neon p-8 bg-gradient-to-r from-cyan-900/30 to-pink-900/30 border-2 border-pink-500/50">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-pink-400" />
              <h3 className="text-3xl font-orbitron font-bold neon-text-pink">6. Conclusão</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              O <strong className="text-pink-300">Cyberpunk Web3 Casino</strong> não é apenas um cassino, é uma experiência de jogo descentralizada, transparente e emocionante. Junte-se à revolução, conecte sua carteira, e comece a apostar no futuro!
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/casino">
                <Button className="btn-neon-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  JOGAR AGORA
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="btn-neon-outline-lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  VOLTAR
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/30 bg-gray-900/50 mt-20">
        <div className="container py-6 text-center text-sm text-gray-400">
          <p>
            Cassino Web3 © 2024 | Powered by Arbitrum | Tema Cyberpunk
          </p>
        </div>
      </footer>
    </div>
  );
}
