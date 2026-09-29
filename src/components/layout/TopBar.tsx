import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Plus, Menu, X, CheckCircle, TrendingUp } from 'lucide-react';
import { StockQuote, MarketIndex } from '../../types';
import { formatINR, formatPercent } from '../../utils/formatters';

interface TopBarProps {
  stocks: StockQuote[];
  niftyIndex?: MarketIndex;
  onSelectStock: (symbol: string) => void;
  onOpenTradeModal: () => void;
  onOpenMobileMenu: () => void;
  onNavigate: (path: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  stocks,
  niftyIndex,
  onSelectStock,
  onOpenTradeModal,
  onOpenMobileMenu,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStocks = searchQuery.trim()
    ? stocks.filter(
        s =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleStockClick = (symbol: string) => {
    onSelectStock(symbol);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="h-16 bg-[#0a0a0a] border-b border-[#313131] px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-[#a7a7a7] hover:text-white rounded-lg hover:bg-[#1e1e1e] cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Stock Search */}
        <div className="relative w-full" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#7c7c7c] absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ticker, company (e.g. RELIANCE, TCS)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-[#7c7c7c] transition-colors focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 text-[#7c7c7c] hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && filteredStocks.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e1e1e] border border-[#313131] rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 border-b border-[#252525] text-[10px] text-[#7c7c7c] uppercase font-mono tracking-wider">
                Matching Assets
              </div>
              <div className="divide-y divide-[#252525] max-h-72 overflow-y-auto">
                {filteredStocks.map(stock => {
                  const isPos = stock.change >= 0;
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => handleStockClick(stock.symbol)}
                      className="p-2.5 hover:bg-[#252525] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white font-mono text-xs">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] text-[#7c7c7c] uppercase">
                            {stock.sector.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#a7a7a7] truncate max-w-[200px]">
                          {stock.companyName}
                        </span>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <div className="text-white font-medium">{formatINR(stock.price)}</div>
                        <div className={`text-[10px] ${isPos ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                          {formatPercent(stock.changePercent, true)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* NIFTY 50 Live Index Ticker Pill */}
        {niftyIndex && (
          <div
            onClick={() => onNavigate('/markets')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#313131] rounded-lg hover:border-[#454545] cursor-pointer transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#6798ff]" />
            <span className="text-xs font-mono text-white font-medium">NIFTY 50</span>
            <span className="text-xs font-mono text-white">{niftyIndex.value.toFixed(1)}</span>
            <span
              className={`text-xs font-mono font-medium ${
                niftyIndex.change >= 0 ? 'text-[#10b981]' : 'text-[#f43f5e]'
              }`}
            >
              {formatPercent(niftyIndex.changePercent, true)}
            </span>
          </div>
        )}

        {/* Paper Trade Button */}
        <button
          onClick={onOpenTradeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#6798ff] text-white hover:bg-[#5287f7] shadow-sm shadow-[#6798ff]/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Trade</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-[#a7a7a7] hover:text-white rounded-lg hover:bg-[#141414] border border-transparent hover:border-[#313131] transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#6798ff] absolute top-1.5 right-1.5" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1e1e1e] border border-[#313131] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-[#252525] text-xs font-medium text-white">
                <span>System Notifications</span>
                <span className="text-[10px] text-[#6798ff] font-mono">2 Unread</span>
              </div>
              <div className="divide-y divide-[#252525] mt-2">
                <div className="py-2 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="text-white font-medium">Order Executed: BUY 15 RELIANCE</p>
                    <p className="text-[10px] text-[#7c7c7c] mt-0.5 font-mono">Executed at ₹2,975.50 · 2h ago</p>
                  </div>
                </div>
                <div className="py-2 flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[#6798ff] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="text-white font-medium">ML Signal Alert: ICICIBANK</p>
                    <p className="text-[10px] text-[#7c7c7c] mt-0.5 font-mono">Ensemble confidence upgraded to 88% Bullish</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#313131] hover:border-[#6798ff] flex items-center justify-center text-xs font-mono font-bold text-white transition-colors cursor-pointer"
          >
            NP
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1e1e1e] border border-[#313131] rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#252525]">
                <p className="font-semibold text-white">Nikunj Purohit</p>
                <p className="text-[11px] text-[#7c7c7c] font-mono truncate">purohitnikunj19@gmail.com</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('/portfolio');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-[#252525] text-[#a7a7a7] hover:text-white transition-colors cursor-pointer"
                >
                  Portfolio Workspace
                </button>
                <button
                  onClick={() => {
                    onNavigate('/settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-[#252525] text-[#a7a7a7] hover:text-white transition-colors cursor-pointer"
                >
                  Settings & Preferences
                </button>
                <button
                  onClick={() => {
                    onNavigate('/login');
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded hover:bg-[#252525] text-[#f43f5e] transition-colors cursor-pointer mt-1 border-t border-[#252525] pt-1.5"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
