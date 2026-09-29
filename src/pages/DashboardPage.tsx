import React, { useState, useEffect } from 'react';
import { StockQuote, MarketIndex, PortfolioSummary, Transaction, Holding } from '../types';
import { PortfolioService } from '../services/portfolioService';
import { TransactionService } from '../services/transactionService';
import { MetricCard } from '../components/common/MetricCard';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { DonutChart } from '../components/charts/DonutChart';
import { MarketIndexCard } from '../components/market/MarketIndexCard';
import { StockTable } from '../components/market/StockTable';
import { formatINR, formatPercent, formatDate } from '../utils/formatters';
import { ArrowUpRight, ArrowDownRight, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

interface DashboardPageProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  onSelectStock: (symbol: string) => void;
  onTradeStock: (stock: StockQuote) => void;
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stocks,
  indices,
  onSelectStock,
  onTradeStock,
  onNavigate,
}) => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [sectorAllocations, setSectorAllocations] = useState<{ sector: string; value: number; percentage: number; color: string }[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    async function loadData() {
      const [sum, sectors, txs, h] = await Promise.all([
        PortfolioService.getSummary(),
        PortfolioService.getSectorAllocation(),
        TransactionService.getTransactions(5),
        PortfolioService.getHoldings(),
      ]);
      setSummary(sum);
      setSectorAllocations(sectors);
      setTransactions(txs);
      setHoldings(h);
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
              Market Overview
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              NSE Live
            </span>
          </div>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Real-time portfolio valuation, risk parameters, and algorithmic market signals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/risk')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#141414] hover:bg-[#1e1e1e] text-[#a7a7a7] hover:text-white border border-[#313131] rounded-lg transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#6798ff]" />
            <span>Risk Profile</span>
          </button>
          <button
            onClick={() => onNavigate('/strategy-lab')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#141414] hover:bg-[#1e1e1e] text-[#a7a7a7] hover:text-white border border-[#313131] rounded-lg transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>Strategy Lab</span>
          </button>
        </div>
      </div>

      {/* Top Metric Row (Prompt 11 Specification) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Portfolio Value"
          value={formatINR(summary?.totalValue || 842560, { decimals: 0 })}
          change="+1.50%"
          isPositive={true}
          subtext="Cash: ₹99,165"
          tooltip="Consolidated market value of all active paper holdings plus liquid cash."
        />
        <MetricCard
          label="Today's P&L"
          value={`+${formatINR(summary?.todayPnL || 12430, { decimals: 0 })}`}
          change="+1.50%"
          isPositive={true}
          subtext="Unrealized daily gain"
          tooltip="Intraday mark-to-market performance across active positions."
        />
        <MetricCard
          label="Total Return"
          value={`+${summary?.totalPnLPercent || 18.42}%`}
          change={`+${formatINR(summary?.totalPnL || 130950, { compact: true })}`}
          isPositive={true}
          subtext="Since inception"
          tooltip="Cumulative portfolio net gain against aggregate capital invested."
        />
        <MetricCard
          label="Sharpe Ratio"
          value={String(summary?.sharpeRatio || 1.24)}
          subtext="Benchmark: 0.98"
          tooltip="Risk-adjusted excess return per unit of total portfolio volatility."
        />
        <MetricCard
          label="Max Drawdown"
          value={`${summary?.maxDrawdown || -12.8}%`}
          isPositive={false}
          subtext="Peak-to-trough (Mar '26)"
          tooltip="Maximum observed loss from a portfolio peak to subsequent trough."
        />
        <MetricCard
          label="Volatility"
          value={`${summary?.volatility || 18.4}%`}
          subtext="30-day annualized"
          tooltip="Annualized standard deviation of daily portfolio logarithmic returns."
        />
      </div>

      {/* Middle Grid: Portfolio Performance (Left) + Portfolio Allocation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart height={280} />
        </div>
        <div className="lg:col-span-1">
          <DonutChart
            slices={sectorAllocations}
            totalValue={summary?.investedValue || 730110}
          />
        </div>
      </div>

      {/* Market Overview Index Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Key Market Indices
            </span>
            <span className="text-[11px] text-[#7c7c7c]">· National Stock Exchange of India</span>
          </div>
          <button
            onClick={() => onNavigate('/markets')}
            className="text-xs text-[#6798ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {indices.map(idx => (
            <MarketIndexCard
              key={idx.symbol}
              index={idx}
              onClick={() => onNavigate('/markets')}
            />
          ))}
        </div>
      </div>

      {/* Watchlist Quick Snippet */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Focus Watchlist & Algorithmic Signals
            </span>
            <p className="text-[11px] text-[#7c7c7c] mt-0.5">
              Live quantitative momentum and machine learning direction indicators.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/watchlist')}
            className="text-xs text-[#6798ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Watchlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <StockTable
          stocks={stocks.slice(0, 5)}
          onSelectStock={onSelectStock}
          onTradeStock={onTradeStock}
          compact={false}
        />
      </div>

      {/* Recent Transactions Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Recent Simulated Transactions
          </span>
          <button
            onClick={() => onNavigate('/transactions')}
            className="text-xs text-[#6798ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Transaction Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="surface-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#141414] border-b border-[#313131] text-[#a7a7a7] uppercase tracking-wider text-[11px] font-medium">
                <tr>
                  <th className="py-2.5 px-4">Order ID / Date</th>
                  <th className="py-2.5 px-4">Asset</th>
                  <th className="py-2.5 px-4">Side</th>
                  <th className="py-2.5 px-4 text-right">Quantity</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">Gross Value</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252525]">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#252525]/40 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="text-white font-medium">{tx.id}</div>
                      <div className="text-[10px] text-[#7c7c7c]">{formatDate(tx.date)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white font-mono">{tx.symbol}</div>
                      <div className="text-[11px] text-[#7c7c7c] truncate max-w-[150px]">{tx.companyName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${
                          tx.side === 'BUY'
                            ? 'bg-[#10b981]/15 text-[#10b981]'
                            : 'bg-[#f43f5e]/15 text-[#f43f5e]'
                        }`}
                      >
                        {tx.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-white">
                      {tx.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#a7a7a7]">
                      {formatINR(tx.price)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-white">
                      {formatINR(tx.totalValue)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 bg-[#141414] border border-[#313131] rounded text-[10px] font-mono text-[#10b981]">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
