import React, { useState, useEffect } from 'react';
import { Holding, PortfolioSummary, StockQuote } from '../types';
import { PortfolioService } from '../services/portfolioService';
import { MetricCard } from '../components/common/MetricCard';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { DonutChart } from '../components/charts/DonutChart';
import { Button } from '../components/common/Button';
import { formatINR, formatPercent } from '../utils/formatters';
import { Plus, ArrowUpRight, ArrowDownRight, RefreshCw, BookmarkPlus } from 'lucide-react';

interface PortfolioPageProps {
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
  onTradeStock: (stock: StockQuote) => void;
  onOpenTradeModal: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  stocks,
  onSelectStock,
  onTradeStock,
  onOpenTradeModal,
}) => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [sectors, setSectors] = useState<{ sector: string; value: number; percentage: number; color: string }[]>([]);

  const loadData = async () => {
    const [sum, h, s] = await Promise.all([
      PortfolioService.getSummary(),
      PortfolioService.getHoldings(),
      PortfolioService.getSectorAllocation(),
    ]);
    setSummary(sum);
    setHoldings(h);
    setSectors(s);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Portfolio Management
          </h1>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Consolidated paper holdings, position tracking, cash balance, and sector rebalancing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenTradeModal}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Execute Paper Order
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Portfolio Value"
          value={formatINR(summary?.totalValue || 842560, { decimals: 0 })}
          change="+1.50%"
          isPositive={true}
        />
        <MetricCard
          label="Cash Balance"
          value={formatINR(summary?.cashBalance || 99165, { decimals: 0 })}
          subtext="Available paper cash"
        />
        <MetricCard
          label="Invested Value"
          value={formatINR(summary?.investedValue || 730110, { decimals: 0 })}
          subtext="Cost basis"
        />
        <MetricCard
          label="Today's P&L"
          value={`+${formatINR(summary?.todayPnL || 12430, { decimals: 0 })}`}
          change="+1.50%"
          isPositive={true}
        />
        <MetricCard
          label="Total P&L"
          value={`+${formatINR(summary?.totalPnL || 130950, { decimals: 0 })}`}
          change="+18.42%"
          isPositive={true}
        />
        <MetricCard
          label="Sharpe / Beta"
          value="1.24 / 0.94"
          subtext="Risk normalized"
        />
      </div>

      {/* Performance vs Benchmark & Sector Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart height={280} />
        </div>
        <div className="lg:col-span-1">
          <DonutChart slices={sectors} totalValue={summary?.investedValue || 730110} />
        </div>
      </div>

      {/* Holdings Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Active Holdings ({holdings.length} Positions)
            </span>
            <p className="text-[11px] text-[#7c7c7c] mt-0.5">
              Live mark-to-market valuations and unrealized profit & loss.
            </p>
          </div>
        </div>

        <div className="surface-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#141414] border-b border-[#313131] text-[#a7a7a7] uppercase tracking-wider text-[11px] font-medium">
                <tr>
                  <th className="py-3 px-4">Asset / Sector</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Avg Buy Price</th>
                  <th className="py-3 px-4 text-right">Current Price</th>
                  <th className="py-3 px-4 text-right">Invested</th>
                  <th className="py-3 px-4 text-right">Market Value</th>
                  <th className="py-3 px-4 text-right">Unrealized P&L</th>
                  <th className="py-3 px-4 text-right">Weight</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252525]">
                {holdings.map(h => {
                  const isPos = h.unrealizedPnL >= 0;
                  const matchingStock = stocks.find(s => s.symbol === h.symbol) || stocks[0];

                  return (
                    <tr
                      key={h.symbol}
                      className="hover:bg-[#252525]/40 transition-colors cursor-pointer group"
                      onClick={() => onSelectStock(h.symbol)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: h.allocationColor }}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-white font-mono group-hover:text-[#6798ff] transition-colors">
                              {h.symbol}
                            </span>
                            <span className="text-[11px] text-[#7c7c7c] truncate max-w-[150px]">
                              {h.companyName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-white">
                        {h.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#a7a7a7]">
                        {formatINR(h.averagePrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-white font-medium">
                        {formatINR(h.currentPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#a7a7a7]">
                        {formatINR(h.investedValue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-white font-medium">
                        {formatINR(h.currentValue)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <div
                          className={`font-semibold ${
                            isPos ? 'text-[#10b981]' : 'text-[#f43f5e]'
                          }`}
                        >
                          {isPos ? '+' : ''}
                          {formatINR(h.unrealizedPnL)}
                        </div>
                        <div className="text-[10px] text-[#7c7c7c]">
                          {formatPercent(h.unrealizedPnLPercent, true)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-white">
                        {h.portfolioWeight}%
                      </td>
                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onTradeStock(matchingStock)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-[#141414] hover:bg-[#6798ff] hover:text-white text-[#a7a7a7] border border-[#313131] hover:border-[#6798ff] rounded transition-all cursor-pointer"
                          >
                            Trade
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
      </div>
    </div>
  );
};
