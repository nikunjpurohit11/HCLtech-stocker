import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { StockQuote, MarketIndex } from '../../types';
import { TradeModal } from '../trading/TradeModal';

interface AppShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  stocks: StockQuote[];
  niftyIndex?: MarketIndex;
  children: React.ReactNode;
  tradeModalStock?: StockQuote | null;
  isTradeModalOpen: boolean;
  onOpenTradeModal: (stock?: StockQuote) => void;
  onCloseTradeModal: () => void;
  onTradeSuccess?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPath,
  onNavigate,
  stocks,
  niftyIndex,
  children,
  tradeModalStock,
  isTradeModalOpen,
  onOpenTradeModal,
  onCloseTradeModal,
  onTradeSuccess,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If viewing the Landing Page ('/'), hide sidebar and render full bleed with custom marketing header
  const isLandingPage = currentPath === '/';
  const isAuthPage = currentPath === '/login' || currentPath === '/register';

  if (isLandingPage || isAuthPage) {
    return <main className="min-h-screen bg-[#0a0a0a] text-white">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-row">
      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          stocks={stocks}
          niftyIndex={niftyIndex}
          onSelectStock={sym => onNavigate(`/stock/${sym}`)}
          onOpenTradeModal={() => onOpenTradeModal()}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onNavigate={onNavigate}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Paper Trade Modal */}
      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={onCloseTradeModal}
        defaultStock={tradeModalStock}
        stocks={stocks}
        onTradeSuccess={onTradeSuccess}
      />
    </div>
  );
};
