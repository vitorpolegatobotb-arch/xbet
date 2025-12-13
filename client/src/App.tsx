import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Casino from "./pages/Casino";
import Whitepaper from "./pages/Whitepaper";
import Home from "./pages/Home";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { web3Config } from './lib/web3Config';
import { FloatingChat } from './components/FloatingChat';

const queryClient = new QueryClient();

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/casino"} component={Casino} />
      <Route path={"/whitepaper"} component={Whitepaper} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <WagmiProvider config={web3Config}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            defaultTheme="dark"
            // switchable
          >
            <TooltipProvider>
              <Toaster />
              <Router />
              <FloatingChat />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
