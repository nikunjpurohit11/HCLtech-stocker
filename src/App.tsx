import React, { useState, useEffect } from 'react';
import { StockQuote, MarketIndex } from './types';
import { MarketService } from './services/marketService';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { StockAnalysisPage } from './pages/StockAnalysisPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { RiskAnalyticsPage } from './pages/RiskAnalyticsPage';
import { StrategyLabPage } from './pages/StrategyLabPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    return path && path !== '/' ? path : '/dashboard';
  });

  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeModalStock, setTradeModalStock] = useState<StockQuote | null>(null);

  useEffect(() => {
    async function initData() {
      const [allStocks, allIndices] = await Promise.all([
        MarketService.getStocks(),
        MarketService.getIndices(),
      ]);
      setStocks(allStocks);
      setIndices(allIndices);
    }
    initData();
  }, []);

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path && path !== '/' ? path : '/dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTradeModal = (stock?: StockQuote) => {
    setTradeModalStock(stock || stocks[0] || null);
    setIsTradeModalOpen(true);
  };

  const handleCloseTradeModal = () => {
    setIsTradeModalOpen(false);
    setTradeModalStock(null);
  };

  // Route Dispatcher
  const renderCurrentPage = () => {
    if (currentPath === '/') {
      return <LandingPage onNavigate={navigateTo} />;
    }

    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigateTo} onLoginSuccess={() => navigateTo('/dashboard')} />;
    }

    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigateTo} onRegisterSuccess={() => navigateTo('/dashboard')} />;
    }

    if (currentPath.startsWith('/stock/')) {
      const symbol = currentPath.replace('/stock/', '').toUpperCase();
      return (
        <StockAnalysisPage
          symbol={symbol}
          stocks={stocks}
          onSelectStock={sym => navigateTo(`/stock/${sym}`)}
          onTradeStock={stock => handleOpenTradeModal(stock)}
        />
      );
    }

    switch (currentPath) {
      case '/markets':
        return (
          <MarketsPage
            stocks={stocks}
            indices={indices}
            onSelectStock={sym => navigateTo(`/stock/${sym}`)}
            onTradeStock={stock => handleOpenTradeModal(stock)}
          />
        );

      case '/portfolio':
        return (
          <PortfolioPage
            stocks={stocks}
            onSelectStock={sym => navigateTo(`/stock/${sym}`)}
            onTradeStock={stock => handleOpenTradeModal(stock)}
            onOpenTradeModal={() => handleOpenTradeModal()}
          />
        );

      case '/watchlist':
        return (
          <WatchlistPage
            stocks={stocks}
            onSelectStock={sym => navigateTo(`/stock/${sym}`)}
            onTradeStock={stock => handleOpenTradeModal(stock)}
          />
        );

      case '/risk':
        return <RiskAnalyticsPage />;

      case '/strategy-lab':
        return <StrategyLabPage stocks={stocks} />;

      case '/ai-insights':
        return (
          <AIInsightsPage
            stocks={stocks}
            onSelectStock={sym => navigateTo(`/stock/${sym}`)}
          />
        );

      case '/transactions':
        return <TransactionsPage onSelectStock={sym => navigateTo(`/stock/${sym}`)} />;

      case '/settings':
        return <SettingsPage />;

      case '/dashboard':
      default:
        return (
          <DashboardPage
            stocks={stocks}
            indices={indices}
            onSelectStock={sym => navigateTo(`/stock/${sym}`)}
            onTradeStock={stock => handleOpenTradeModal(stock)}
            onNavigate={navigateTo}
          />
        );
    }
  };

  const niftyIndex = indices.find(i => i.symbol === 'NIFTY 50');

  return (
    <AppShell
      currentPath={currentPath}
      onNavigate={navigateTo}
      stocks={stocks}
      niftyIndex={niftyIndex}
      tradeModalStock={tradeModalStock}
      isTradeModalOpen={isTradeModalOpen}
      onOpenTradeModal={handleOpenTradeModal}
      onCloseTradeModal={handleCloseTradeModal}
      onTradeSuccess={async () => {
        // Refresh summary or stocks if needed
      }}
    >
      {renderCurrentPage()}
    </AppShell>
  );
}
