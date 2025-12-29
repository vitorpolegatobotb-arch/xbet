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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">House Casino</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Voltar</span>
                <span className="sm:hidden">Voltar</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 sm:py-12">
        {/* Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            📜 Whitepaper
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            A plataforma de apostas descentralizada do futuro
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 sm:space-y-12 max-w-4xl mx-auto">
          {/* Section 1: Introdução */}
          <section className="bg-card/50 border border-border rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">1. Introdução: O Futuro do Jogo</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O <strong className="text-foreground">House Casino</strong> é uma plataforma de jogos de azar descentralizada construída na blockchain Arbitrum. Nosso objetivo é oferecer uma experiência de cassino transparente, segura e moderna, com um design profissional e intuitivo.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Combinamos a tecnologia blockchain com jogos de alta qualidade, criando um ecossistema onde os jogadores têm controle total sobre seus fundos e podem verificar a integridade de cada aposta.
            </p>
          </section>

          {/* Section 2: Transparência e Segurança */}
          <section className="bg-card/50 border border-border rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">2. Transparência e Segurança (Web3)</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">⛓️ Blockchain</h4>
                <p className="text-muted-foreground text-sm">
                  Utilizamos a rede <strong>Arbitrum Sepolia (Testnet)</strong> para transações rápidas e de baixo custo. Todos os dados de apostas são registrados imutavelmente na blockchain.
                </p>
              </div>
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">💰 Token</h4>
                <p className="text-muted-foreground text-sm">
                  Todas as apostas e prêmios são feitos com <strong>Mock USDC</strong> (um token de teste com 6 decimais), garantindo estabilidade de valor e compatibilidade com o ecossistema DeFi.
                </p>
              </div>
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🔐 Contratos Inteligentes</h4>
                <p className="text-muted-foreground text-sm">
                  A lógica de jogo (House Edge, Rake, Jackpot) é regida por contratos inteligentes auditáveis, garantindo <strong>fairness</strong> e transparência total.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Jogos Disponíveis */}
          <section className="bg-card/50 border border-border rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gem className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">3. Jogos Disponíveis</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Nossa plataforma oferece uma seleção de jogos populares, cada um com sua própria dinâmica e oportunidades de ganho:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🎰 Caça-Níqueis</h4>
                <p className="text-muted-foreground text-sm mb-2">Gire os rolos e tente a sorte grande.</p>
                <p className="text-primary font-semibold text-sm">House Edge: 5%</p>
              </div>
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🃏 Blackjack</h4>
                <p className="text-muted-foreground text-sm mb-2">O clássico 21. Blackjack paga 2.5x!</p>
                <p className="text-primary font-semibold text-sm">House Edge: 2%</p>
              </div>
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🚀 Neon Rocket (Crash)</h4>
                <p className="text-muted-foreground text-sm mb-2">Retire sua aposta antes que o foguete caia.</p>
                <p className="text-primary font-semibold text-sm">House Edge: 5%</p>
              </div>
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">💎 Diamond Mines</h4>
                <p className="text-muted-foreground text-sm mb-2">Campo minado com multiplicadores crescentes.</p>
                <p className="text-primary font-semibold text-sm">House Edge: 5%</p>
              </div>
            </div>
          </section>

          {/* Section 4: Economia e Premiações */}
          <section className="bg-card/50 border border-border rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">4. Economia e Premiações</h3>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-foreground mb-4">4.1. Rake e Liquidez</h4>
              <p className="text-muted-foreground mb-4">
                Uma pequena porcentagem de cada aposta (o <strong>Rake</strong>) é distribuída para:
              </p>
              <div className="space-y-3">
                <div className="bg-background/50 border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm"><strong className="text-foreground">Pool de Liquidez:</strong> Garante que o cassino sempre tenha fundos para pagar grandes prêmios.</p>
                </div>
                <div className="bg-background/50 border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm"><strong className="text-foreground">Jackpot:</strong> Contribui para o prêmio acumulado que cresce a cada aposta.</p>
                </div>
                <div className="bg-background/50 border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm"><strong className="text-foreground">Operação:</strong> Cobre custos de infraestrutura, desenvolvimento e manutenção.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">4.2. Jackpot Acumulado</h4>
              <p className="text-muted-foreground mb-4">
                O Jackpot é um prêmio progressivo que cresce a cada aposta feita na plataforma.
              </p>
              <div className="space-y-3">
                <div className="bg-background/50 border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm"><strong className="text-foreground">Acúmulo:</strong> Uma porcentagem do Rake de cada jogo é destinada ao Jackpot.</p>
                </div>
                <div className="bg-background/50 border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm"><strong className="text-foreground">Sorteio:</strong> O Jackpot é sorteado semanalmente entre os <strong>Top 10 Players</strong> com maior volume de apostas.</p>
                </div>
                <div className="bg-background/50 border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm"><strong className="text-foreground">Transparência:</strong> Todos os sorteios são registrados na blockchain e podem ser verificados.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Comunidade e Interação */}
          <section className="bg-card/50 border border-border rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">5. Comunidade e Interação</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Acreditamos que a experiência de jogo é melhor quando compartilhada. Por isso, implementamos recursos sociais robustos:
            </p>
            <div className="space-y-4">
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">💬 Chat ao Vivo</h4>
                <p className="text-muted-foreground text-sm">
                  Um chat em tempo real permite que os jogadores interajam, compartilhem estratégias, celebrem vitórias e façam novas amizades. Veja quem está online e conecte-se com a comunidade.
                </p>
              </div>
              <div className="bg-background/50 border border-border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2">🏆 Ranking Semanal</h4>
                <p className="text-muted-foreground text-sm">
                  Motiva a competição saudável e define os elegíveis para o sorteio do Jackpot. Suba no ranking e ganhe prêmios exclusivos!
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Conclusão */}
          <section className="bg-primary/10 border border-primary/30 rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">6. Conclusão</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-6">
              O <strong className="text-foreground">House Casino</strong> não é apenas um cassino, é uma experiência de jogo descentralizada, transparente e emocionante. Junte-se à revolução, conecte sua carteira, e comece a apostar no futuro!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/casino">
                <Button className="w-full sm:w-auto">
                  <Rocket className="w-5 h-5 mr-2" />
                  Jogar Agora
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12 sm:mt-20">
        <div className="container py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            House Casino © 2024 | Powered by Arbitrum | Web3 Descentralizado
          </p>
        </div>
      </footer>
    </div>
  );
}
