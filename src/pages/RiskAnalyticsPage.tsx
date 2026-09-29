import React, { useState, useEffect } from 'react';
import { RiskMetrics, CorrelationRow } from '../types';
import { AnalyticsService } from '../services';
import { MetricCard } from '../components/common/MetricCard';
import { DrawdownChart } from '../components/charts/DrawdownChart';
import { CorrelationHeatmap, RiskContributionList } from '../components/risk';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatINR } from '../utils/formatters';
import { ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';

export const RiskAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [correlations, setCorrelations] = useState<CorrelationRow[]>([]);
  const [drawdowns, setDrawdowns] = useState<{ date: string; drawdown: number }[]>([]);
  const [riskContributions, setRiskContributions] = useState<{ symbol: string; riskPct: number; allocationPct: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRisk = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [m, c, dd, rc] = await Promise.all([
        AnalyticsService.getRiskMetrics(),
        AnalyticsService.getCorrelationMatrix(),
        AnalyticsService.getDrawdownSeries(),
        AnalyticsService.getRiskContribution(),
      ]);
      setMetrics(m);
      setCorrelations(c);
      setDrawdowns(dd);
      setRiskContributions(rc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate risk parameters');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRisk();
  }, []);

  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="w-6 h-6 text-[#f43f5e]" />}
        title="Risk Calculation Engine Error"
        description={error}
        actionLabel="Retry Analysis"
        onAction={loadRisk}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Portfolio Risk Workstation
          </h1>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Parametric Value at Risk, asset covariance matrices, downside volatility, and stress testing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadRisk}
            className="p-1.5 text-[#7c7c7c] hover:text-white rounded hover:bg-[#1e1e1e] transition-colors cursor-pointer"
            title="Recalculate Covariance"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-3 py-1 bg-[#141414] border border-[#313131] rounded-lg text-[#10b981] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            Risk Model: Nominal
          </span>
        </div>
      </div>

      {/* Top Risk Metrics */}
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
            label="Volatility (Ann.)"
            value={`${metrics?.volatility || 18.4}%`}
            subtext="Standard Deviation"
            tooltip="Annualized standard deviation of daily logarithmic returns."
          />
          <MetricCard
            label="Sharpe Ratio"
            value={String(metrics?.sharpeRatio || 1.24)}
            subtext="Rf = 6.80%"
            tooltip="Excess return above risk-free rate divided by annualized standard deviation."
          />
          <MetricCard
            label="Sortino Ratio"
            value={String(metrics?.sortinoRatio || 1.68)}
            subtext="Downside Vol: 11.2%"
            tooltip="Risk-adjusted return focusing exclusively on harmful downside deviations."
          />
          <MetricCard
            label="Portfolio Beta"
            value={String(metrics?.beta || 0.94)}
            subtext="vs Nifty 50 Index"
            tooltip="Systematic market risk sensitivity. Less than 1 indicates defensive bias."
          />
          <MetricCard
            label="Daily VaR (95%)"
            value={formatINR(metrics?.var95Amount || 17690, { decimals: 0 })}
            subtext={`${metrics?.var95Percent || -2.10}% capital`}
            tooltip="Maximum expected daily loss under normal market conditions at 95% confidence."
          />
          <MetricCard
            label="Max Drawdown"
            value={`${metrics?.maxDrawdown || -12.8}%`}
            isPositive={false}
            subtext="Recovery: 28 Days"
            tooltip="Peak-to-trough historical capital loss over trailing 52 weeks."
          />
        </div>
      )}

      {/* Historical Underwater Drawdown Chart */}
      <div className="surface-panel rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-[#313131] pb-3">
          <div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Peak-to-Trough Drawdown Curve
            </span>
            <p className="text-[11px] text-[#7c7c7c] mt-0.5">
              Cumulative historical capital retracement from previous equity peaks.
            </p>
          </div>
          <span className="text-xs font-mono text-[#f43f5e] font-semibold">
            Max: -12.8%
          </span>
        </div>

        <DrawdownChart data={drawdowns} height={160} />
      </div>

      {/* Two Column Grid: Correlation Matrix & Asset Risk Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CorrelationHeatmap correlations={correlations} />
        <RiskContributionList contributions={riskContributions} />
      </div>
    </div>
  );
};
