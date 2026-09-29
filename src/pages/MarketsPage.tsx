import React, { useState } from 'react';
import { StockQuote, MarketIndex } from '../types';
import { MarketIndexCard } from '../components/market/MarketIndexCard';
import { StockTable } from '../components/market/StockTable';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Filter, TrendingUp, TrendingDown, Flame, BarChart3 } from 'lucide-react';

interface MarketsPageProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  onSelectStock: (symbol: string) => void;
  onTradeStock: (stock: StockQuote) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({
  stocks,
  indices,
  onSelectStock,
  onTradeStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'GAINERS' | 'LOSERS' | 'BULLISH' | 'BEARISH' | 'ACTIVE'>('ALL');

  const sectors = ['ALL', 'Information Technology', 'Financial Services', 'Energy & Conglomerate', 'Automobile', 'Telecommunications', 'Consumer Goods'];

  let filtered = stocks.filter(stock => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      selectedSector === 'ALL' ||
      stock.sector.toLowerCase().includes(selectedSector.toLowerCase());

    return matchesSearch && matchesSector;
  });

  if (selectedFilter === 'GAINERS') {
    filtered = [...filtered].sort((a, b) => b.changePercent - a.changePercent);
  } else if (selectedFilter === 'LOSERS') {
    filtered = [...filtered].sort((a, b) => a.changePercent - b.changePercent);
  } else if (selectedFilter === 'BULLISH') {
    filtered = filtered.filter(s => s.signal === 'BULLISH');
  } else if (selectedFilter === 'BEARISH') {
    filtered = filtered.filter(s => s.signal === 'BEARISH');
  } else if (selectedFilter === 'ACTIVE') {
    filtered = [...filtered].sort((a, b) => b.volume - a.volume);
  }

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('ALL');
    setSelectedFilter('ALL');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Market Discovery & Scanner
          </h1>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Real-time equity quotes, technical indicators, and quantitative filters across Indian markets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#7c7c7c]">
            Showing <strong className="text-white">{filtered.length}</strong> of {stocks.length} assets
          </span>
        </div>
      </div>

      {/* Indices Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {indices.map(idx => (
          <MarketIndexCard key={idx.symbol} index={idx} />
        ))}
      </div>

      {/* Controls & Filter Bar */}
      <div className="surface-panel rounded-xl p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#7c7c7c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by symbol or company name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#7c7c7c] transition-colors focus:outline-none font-mono"
            />
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-[#141414] border border-[#313131] rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedFilter === 'ALL' ? 'bg-[#1e1e1e] text-white border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              All Equities
            </button>
            <button
              onClick={() => setSelectedFilter('GAINERS')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedFilter === 'GAINERS' ? 'bg-[#1e1e1e] text-[#10b981] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              <TrendingUp className="w-3 h-3 text-[#10b981]" />
              <span>Top Gainers</span>
            </button>
            <button
              onClick={() => setSelectedFilter('LOSERS')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedFilter === 'LOSERS' ? 'bg-[#1e1e1e] text-[#f43f5e] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              <TrendingDown className="w-3 h-3 text-[#f43f5e]" />
              <span>Top Losers</span>
            </button>
            <button
              onClick={() => setSelectedFilter('ACTIVE')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedFilter === 'ACTIVE' ? 'bg-[#1e1e1e] text-[#f59e0b] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              <Flame className="w-3 h-3 text-[#f59e0b]" />
              <span>Most Active</span>
            </button>
            <button
              onClick={() => setSelectedFilter('BULLISH')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                selectedFilter === 'BULLISH' ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              ML Bullish
            </button>
          </div>
        </div>

        {/* Sector Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#7c7c7c] shrink-0 flex items-center gap-1 font-mono uppercase text-[10px]">
            <Filter className="w-3 h-3" /> Sector:
          </span>
          {sectors.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors cursor-pointer font-mono ${
                selectedSector === sector
                  ? 'bg-[#6798ff] text-white font-medium'
                  : 'bg-[#141414] text-[#a7a7a7] border border-[#313131] hover:border-[#454545] hover:text-white'
              }`}
            >
              {sector === 'ALL' ? 'All Sectors' : sector.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stock Table or Empty State */}
      {filtered.length > 0 ? (
        <StockTable
          stocks={filtered}
          onSelectStock={onSelectStock}
          onTradeStock={onTradeStock}
          compact={false}
        />
      ) : (
        <EmptyState
          icon={<BarChart3 className="w-6 h-6" />}
          title="No Matching Securities Found"
          description={`No stocks matched your current search query "${searchQuery}" or selected sector criteria.`}
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
