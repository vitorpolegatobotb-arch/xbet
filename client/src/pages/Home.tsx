import { Button } from "@/components/ui/button";
import { Zap, Trophy, Coins, Rocket, Gem, Settings, Info } from "lucide-react";
import { Link } from "wouter";
import { WalletConnect } from "@/components/WalletConnect";
import { useWeb3Wallet } from "@/hooks/useWeb3Wallet";

/**
 * Nova Home Page - Landing Page Cativante
 */

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/30 hover:border-pink-500 transition-all duration-300 shadow-lg hover:shadow-pink-500/30">
    <Icon className="w-8 h-8 text-cyan-400 mb-3" />
    <h3 className="text-xl font-orbitron font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default function Home() {
  const { isConnected } = useWeb3Wallet();

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
            <Link href="/whitepaper">
              <Button variant="outline" className="btn-neon-outline">
                <Info className="w-4 h-4 mr-2" />
                Whitepaper
              </Button>
            </Link>
            {isConnected ? (
              <Link href="/casino">
                <Button className="btn-neon">
                  <Rocket className="w-4 h-4 mr-2" />
                  Jogar Agora
                </Button>
              </Link>
            ) : (
              <WalletConnect />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-orbitron font-extrabold mb-4 neon-text-pink animate-pulse-slow">
            O FUTURO É AGORA
          </h2>
          <p className="text-xl md:text-3xl text-gray-300 font-mono mb-8 max-w-3xl mx-auto">
            A Revolução Web3 dos Cassinos. Aposte com cripto, ganhe em USDC, sinta a adrenalina Cyberpunk.
          </p>
          <div className="flex justify-center gap-4">
            {isConnected ? (
              <Link href="/casino">
                <Button size="lg" className="btn-neon-lg">
                  <Rocket className="w-5 h-5 mr-2" />
                  ENTRAR NO CASINO
                </Button>
              </Link>
            ) : (
              <WalletConnect />
            )}
            <Link href="/whitepaper">
              <Button size="lg" variant="outline" className="btn-neon-outline-lg">
                <Info className="w-5 h-5 mr-2" />
                SAIBA MAIS
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-orbitron font-bold text-center mb-12 neon-text">
            POR QUE CYBERPUNK CASINO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Coins}
              title="APOSTAS WEB3"
              description="Transações transparentes e seguras na blockchain Arbitrum. Aposte com Mock USDC."
            />
            <FeatureCard
              icon={Trophy}
              title="JACKPOT GIGANTE"
              description="Participe do sorteio semanal do Jackpot acumulado. Seja o Top Player da semana!"
            />
            <FeatureCard
              icon={Gem}
              title="JOGOS EXCLUSIVOS"
              description="Slots, Blackjack, Neon Rocket (Crash) e Diamond Mines. Gráficos e jogabilidade imersivos."
            />
          </div>
        </section>

        {/* Call to Action - Chat */}
        <section className="text-center card-neon p-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold mb-4 neon-text-pink">
            CONECTE-SE COM A COMUNIDADE
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            Junte-se ao chat ao vivo e interaja com outros jogadores em tempo real.
          </p>
          <Link href="/casino">
            <Button size="lg" className="btn-neon-lg">
              <Settings className="w-5 h-5 mr-2" />
              ABRIR CHAT
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/30 bg-gray-900/50 mt-12">
        <div className="container py-6 text-center text-sm text-gray-400">
          <p>
            Cassino Web3 © 2024 | Powered by Arbitrum | Tema Cyberpunk
          </p>
        </div>
      </footer>
    </div>
  );
}
