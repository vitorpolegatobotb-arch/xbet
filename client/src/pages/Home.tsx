import { Button } from "@/components/ui/button";
import { Zap, Trophy, Coins, Rocket, Gem, Settings, Info, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { WalletConnect } from "@/components/WalletConnect";
import { useWeb3Wallet } from "@/hooks/useWeb3Wallet";

/**
 * Home Page - Landing Page Profissional
 */

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-card/50 p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:bg-card">
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default function Home() {
  const { isConnected } = useWeb3Wallet();

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
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/whitepaper">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Info className="w-4 h-4 mr-2" />
                Whitepaper
              </Button>
            </Link>
            {isConnected ? (
              <Link href="/casino">
                <Button size="sm">
                  <Rocket className="w-4 h-4 mr-2" />
                  Jogar
                </Button>
              </Link>
            ) : (
              <WalletConnect />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 sm:py-20">
        {/* Hero Section */}
        <section className="text-center mb-16 sm:mb-24">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              Cassino Web3 Descentralizado
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            A Plataforma de Apostas do Futuro
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experimente jogos inovadores com transações seguras na blockchain. Aposte com USDC e ganhe prêmios reais na rede Arbitrum.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isConnected ? (
              <Link href="/casino">
                <Button size="lg" className="w-full sm:w-auto">
                  <Rocket className="w-5 h-5 mr-2" />
                  Começar a Jogar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <WalletConnect />
            )}
            <Link href="/whitepaper">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Info className="w-5 h-5 mr-2" />
                Saiba Mais
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Por Que Escolher House Casino?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combinamos tecnologia blockchain com experiência de jogo excepcional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Coins}
              title="Transações Web3"
              description="Aposte com segurança usando USDC na blockchain Arbitrum. Transações transparentes e imutáveis."
            />
            <FeatureCard
              icon={Trophy}
              title="Jackpot Acumulado"
              description="Participe do sorteio semanal com prêmios crescentes. Quanto mais você joga, maiores suas chances."
            />
            <FeatureCard
              icon={Gem}
              title="Jogos Exclusivos"
              description="Slots, Blackjack, Crash Game e Mines. Gráficos modernos e jogabilidade envolvente."
            />
          </div>
        </section>

        {/* Games Preview */}
        <section className="mb-16 sm:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              Nossos Jogos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha entre uma variedade de jogos emocionantes
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card/50 border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-3">🎰</div>
              <h3 className="font-semibold mb-2 text-foreground">Caça-Níqueis</h3>
              <p className="text-sm text-muted-foreground">Gire os rolos e tente ganhar</p>
            </div>
            <div className="bg-card/50 border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-3">🃏</div>
              <h3 className="font-semibold mb-2 text-foreground">Blackjack</h3>
              <p className="text-sm text-muted-foreground">Chegue a 21 sem ultrapassar</p>
            </div>
            <div className="bg-card/50 border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-semibold mb-2 text-foreground">Neon Rocket</h3>
              <p className="text-sm text-muted-foreground">Decole e retire antes do crash</p>
            </div>
            <div className="bg-card/50 border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="font-semibold mb-2 text-foreground">Diamond Mines</h3>
              <p className="text-sm text-muted-foreground">Clique nos quadrados seguros</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-card/50 border border-border rounded-lg p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            Pronto para Começar?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Conecte sua carteira e acesse a plataforma de apostas mais inovadora do Web3.
          </p>
          {isConnected ? (
            <Link href="/casino">
              <Button size="lg">
                <Rocket className="w-5 h-5 mr-2" />
                Entrar no Casino
              </Button>
            </Link>
          ) : (
            <WalletConnect />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12 sm:mt-20">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>
            House Casino © 2024 | Powered by Arbitrum | Web3 Descentralizado
          </p>
        </div>
      </footer>
    </div>
  );
}
