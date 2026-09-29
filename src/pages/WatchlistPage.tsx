import React, { useState, useEffect } from 'react';
import { StockQuote } from '../types';
import { SignalBadge } from '../components/common/SignalBadge';
import { Sparkline } from '../components/charts/Sparkline';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { WatchlistService } from '../services';
import { formatINR, formatPercent, formatVolume } from '../utils/formatters';
import { Trash2, Plus, Bookmark, ChevronRight, RefreshCw } from 'lucide-react';

interface WatchlistPageProps {
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
  onTradeStock: (stock: StockQuote) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  stocks,
  onSelectStock,
  onTradeStock,
}) => {
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([]);
  const [addSelectSymbol, setAddSelectSymbol] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadWatchlist = async () => {
    setIsLoading(true);
    try {
      const symbols = await WatchlistService.getWatchlistSymbols();
      if (symbols && symbols.length > 0) {
        setWatchlistSymbols(symbols);
      } else {
        // Fallback default set if new user
        const defaults = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
        setWatchlistSymbols(defaults);
        for (const s of defaults) {
          await WatchlistService.addToWatchlist(s);
        }
      }
    } catch {
      setWatchlistSymbols(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const watchlistStocks = stocks.filter(s => watchlistSymbols.includes(s.symbol));
  const availableToAdd = stocks.filter(s => !watchlistSymbols.includes(s.symbol));

  const handleAddStock = async () => {
    if (addSelectSymbol && !watchlistSymbols.includes(addSelectSymbol)) {
      const updated = [...watchlistSymbols, addSelectSymbol];
      setWatchlistSymbols(updated);
      await WatchlistService.addToWatchlist(addSelectSymbol);
      setAddSelectSymbol('');
    }
  };

  const handleRemoveStock = async (sym: string) => {
    const updated = watchlistSymbols.filter(s => s !== sym);
    setWatchlistSymbols(updated);
    await WatchlistService.removeFromWatchlist(sym);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Watchlist Workspace
          </h1>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Custom tracked assets with live momentum indicators, volatility metrics, and machine learning signals.
          </p>
        </div>

        {/* Add Stock Selector & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadWatchlist}
            className="p-1.5 text-[#7c7c7c] hover:text-white rounded hover:bg-[#1e1e1e] transition-colors cursor-pointer"
            title="Refresh Watchlist"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {availableToAdd.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={addSelectSymbol}
                onChange={e => setAddSelectSymbol(e.target.value)}
                className="bg-[#141414] border border-[#313131] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6798ff] font-mono"
              >
                <option value="">Select stock to track...</option>
                {availableToAdd.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} - {s.companyName}
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddStock}
                disabled={!addSelectSymbol}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Watchlist Table */}
      {isLoading ? (
        <div className="surface-panel rounded-xl p-4 flex flex-col gap-3">
          <LoadingSkeleton className="h-8 w-full" />
          <LoadingSkeleton className="h-10 w-full" />
          <LoadingSkeleton className="h-10 w-full" />
          <LoadingSkeleton className="h-10 w-full" />
        </div>
      ) : watchlistStocks.length > 0 ? (
        <div className="surface-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#141414] border-b border-[#313131] text-[#a7a7a7] uppercase tracking-wider text-[11px] font-medium">
                <tr>
                  <th className="py-3 px-4">Symbol / Asset</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Daily Change</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-center">RSI (14)</th>
                  <th className="py-3 px-4 text-center">Volatility</th>
                  <th className="py-3 px-4 text-center">Trend</th>
                  <th className="py-3 px-4 text-center">ML Signal</th>
                  <th className="py-3 px-4 text-center">Sparkline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252525]">
                {watchlistStocks.map(stock => {
                  const isPos = stock.change >= 0;
                  return (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-[#252525]/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectStock(stock.symbol)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white font-mono group-hover:text-[#6798ff] transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-[11px] text-[#7c7c7c] truncate max-w-[150px]">
                            {stock.companyName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-white font-medium">
                        {formatINR(stock.price)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className={`font-semibold ${isPos ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                          {formatPercent(stock.changePercent, true)}
                        </div>
                        <div className="text-[10px] text-[#7c7c7c]">
                          {isPos ? '+' : ''}{formatINR(stock.change)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#a7a7a7]">
                        {formatVolume(stock.volume)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                          stock.rsi >= 70 ? 'text-[#f43f5e] bg-[#f43f5e]/10' : stock.rsi <= 30 ? 'text-[#10b981] bg-[#10b981]/10' : 'text-[#a7a7a7]'
                        }`}>
                          {stock.rsi.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[#a7a7a7]">
                        {stock.volatility}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-[11px] font-mono font-medium ${
                          stock.trend === 'UPTREND' ? 'text-[#10b981]' : stock.trend === 'DOWNTREND' ? 'text-[#f43f5e]' : 'text-[#f59e0b]'
                        }`}>
                          {stock.trend}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <SignalBadge signal={stock.signal} confidence={stock.signalConfidence} compact />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-block">
                          <Sparkline data={stock.sparkline} isPositive={isPos} width={65} height={18} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onTradeStock(stock)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#141414] hover:bg-[#6798ff] hover:text-white text-[#a7a7a7] border border-[#313131] hover:border-[#6798ff] rounded transition-all cursor-pointer"
                          >
                            Trade
                          </button>
                          <button
                            onClick={() => handleRemoveStock(stock.symbol)}
                            className="p-1 text-[#7c7c7c] hover:text-[#f43f5e] rounded hover:bg-[#313131] transition-colors cursor-pointer"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectStock(stock.symbol)}
                            className="p-1 text-[#7c7c7c] hover:text-white rounded hover:bg-[#313131] transition-colors cursor-pointer"
                            title="Open Analysis"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="w-6 h-6" />}
          title="Watchlist is Empty"
          description="You haven't pinned any stocks to your personal watchlist yet. Browse market equities to track momentum and ML signals."
          actionLabel="Add Default Bluechips"
          onAction={() => {
            const defaults = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
            setWatchlistSymbols(defaults);
            defaults.forEach(s => WatchlistService.addToWatchlist(s));
          }}
        />
      )}
    </div>
  );
};
