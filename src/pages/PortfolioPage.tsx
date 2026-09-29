import React, { useState, useEffect } from 'react';
import { Holding, PortfolioSummary, StockQuote } from '../types';
import { PortfolioService } from '../services';
import { MetricCard } from '../components/common/MetricCard';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { DonutChart } from '../components/charts/DonutChart';
import { HoldingsTable } from '../components/portfolio/HoldingsTable';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { formatINR } from '../utils/formatters';
import { Plus, RefreshCw, AlertTriangle, PieChart } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sum, h, s] = await Promise.all([
        PortfolioService.getSummary(),
        PortfolioService.getHoldings(),
        PortfolioService.getSectorAllocation(),
      ]);
      setSummary(sum);
      setHoldings(h);
      setSectors(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio positions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTradeSymbol = (symbol: string) => {
    const found = stocks.find(s => s.symbol === symbol) || stocks[0];
    if (found) onTradeStock(found);
  };

  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="w-6 h-6 text-[#f43f5e]" />}
        title="Portfolio Service Error"
        description={error}
        actionLabel="Retry Loading"
        onAction={loadData}
      />
    );
  }

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
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface-panel rounded-xl p-4 h-24 flex flex-col justify-between">
              <LoadingSkeleton className="h-3 w-20" />
              <LoadingSkeleton className="h-7 w-24" />
              <LoadingSkeleton className="h-2.5 w-16" />
            </div>
          ))}
        </div>
      ) : (
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
      )}

      {/* Performance vs Benchmark & Sector Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart height={280} />
        </div>
        <div className="lg:col-span-1">
          <DonutChart slices={sectors} totalValue={summary?.investedValue || 730110} />
        </div>
      </div>

      {/* Holdings Section */}
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

        {holdings.length > 0 ? (
          <HoldingsTable
            holdings={holdings}
            onSelectStock={onSelectStock}
            onTradeStock={handleTradeSymbol}
          />
        ) : (
          <EmptyState
            icon={<PieChart className="w-6 h-6" />}
            title="No Active Holdings"
            description="You currently hold no equities in your paper portfolio. Execute your first buy order to begin tracking allocation."
            actionLabel="Place First Order"
            onAction={onOpenTradeModal}
          />
        )}
      </div>
    </div>
  );
};
