import React, { useState } from 'react';
import { StockQuote } from '../../types';
import { SignalBadge } from '../common/SignalBadge';
import { Sparkline } from '../charts/Sparkline';
import { formatINR, formatPercent, formatVolume } from '../../utils/formatters';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

interface StockTableProps {
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
  onTradeStock?: (stock: StockQuote) => void;
  compact?: boolean;
}

export const StockTable: React.FC<StockTableProps> = ({
  stocks,
  onSelectStock,
  onTradeStock,
  compact = false,
}) => {
  const [sortField, setSortField] = useState<keyof StockQuote>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof StockQuote) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const renderSortIcon = (field: keyof StockQuote) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#7c7c7c] opacity-60 inline ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#6798ff] inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#6798ff] inline ml-1" />
    );
  };

  return (
    <div className="surface-panel rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#141414] border-b border-[#313131] text-[#a7a7a7] uppercase tracking-wider text-[11px] font-medium select-none">
            <tr>
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                Symbol / Asset {renderSortIcon('symbol')}
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                Price {renderSortIcon('price')}
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                24h Change {renderSortIcon('changePercent')}
              </th>
              {!compact && (
                <>
                  <th
                    onClick={() => handleSort('volume')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  >
                    Volume {renderSortIcon('volume')}
                  </th>
                  <th
                    onClick={() => handleSort('marketCap')}
                    className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  >
                    Mkt Cap {renderSortIcon('marketCap')}
                  </th>
                  <th
                    onClick={() => handleSort('rsi')}
                    className="py-3 px-4 text-center cursor-pointer hover:text-white transition-colors"
                  >
                    RSI (14) {renderSortIcon('rsi')}
                  </th>
                  <th className="py-3 px-4 text-center">Trend / 24h</th>
                </>
              )}
              <th className="py-3 px-4 text-center">ML Signal</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252525]">
            {sortedStocks.map(stock => {
              const isPositive = stock.change >= 0;
              return (
                <tr
                  key={stock.symbol}
                  className="hover:bg-[#252525]/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectStock(stock.symbol)}
                >
                  {/* Symbol & Company */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white font-mono group-hover:text-[#6798ff] transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] text-[#7c7c7c] uppercase">
                          {stock.sector.split(' ')[0]}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#a7a7a7] truncate max-w-[170px]">
                        {stock.companyName}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-white tabular-nums">
                    {formatINR(stock.price)}
                  </td>

                  {/* Change */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <div
                      className={`font-medium ${
                        isPositive ? 'text-[#10b981]' : 'text-[#f43f5e]'
                      }`}
                    >
                      {formatPercent(stock.changePercent, true)}
                    </div>
                    <div className="text-[10px] text-[#7c7c7c]">
                      {isPositive ? '+' : ''}
                      {stock.change.toFixed(2)}
                    </div>
                  </td>

                  {!compact && (
                    <>
                      {/* Volume */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#a7a7a7] tabular-nums">
                        {formatVolume(stock.volume)}
                      </td>

                      {/* Market Cap */}
                      <td className="py-3.5 px-4 text-right font-mono text-[#a7a7a7] tabular-nums">
                        ₹{(stock.marketCap / 1000).toFixed(1)}k Cr
                      </td>

                      {/* RSI */}
                      <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            stock.rsi >= 70
                              ? 'text-[#f43f5e] bg-[#f43f5e]/10'
                              : stock.rsi <= 30
                              ? 'text-[#10b981] bg-[#10b981]/10'
                              : 'text-[#a7a7a7]'
                          }`}
                        >
                          {stock.rsi.toFixed(1)}
                        </span>
                      </td>

                      {/* Sparkline */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-block">
                          <Sparkline
                            data={stock.sparkline}
                            isPositive={isPositive}
                            width={70}
                            height={20}
                          />
                        </div>
                      </td>
                    </>
                  )}

                  {/* ML Signal */}
                  <td className="py-3.5 px-4 text-center">
                    <SignalBadge
                      signal={stock.signal}
                      confidence={stock.signalConfidence}
                      compact={compact}
                    />
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      {onTradeStock && (
                        <button
                          onClick={() => onTradeStock(stock)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-[#141414] hover:bg-[#6798ff] hover:text-white text-[#a7a7a7] border border-[#313131] hover:border-[#6798ff] rounded transition-all cursor-pointer"
                        >
                          Trade
                        </button>
                      )}
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
  );
};
