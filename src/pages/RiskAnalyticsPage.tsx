import React, { useState, useEffect } from 'react';
import { RiskMetrics } from '../types';
import { AnalyticsService, CorrelationRow } from '../services/analyticsService';
import { MetricCard } from '../components/common/MetricCard';
import { formatINR, formatPercent } from '../utils/formatters';
import { ShieldAlert, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

export const RiskAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [correlations, setCorrelations] = useState<CorrelationRow[]>([]);
  const [drawdowns, setDrawdowns] = useState<{ date: string; drawdown: number }[]>([]);
  const [riskContributions, setRiskContributions] = useState<{ symbol: string; riskPct: number; allocationPct: number }[]>([]);

  useEffect(() => {
    async function loadRisk() {
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
    }
    loadRisk();
  }, []);

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
          <span className="text-xs font-mono px-3 py-1 bg-[#141414] border border-[#313131] rounded-lg text-[#10b981] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            Risk Model: Nominal
          </span>
        </div>
      </div>

      {/* Top Risk Metrics */}
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

        {/* SVG Underwater Drawdown Chart */}
        <div className="relative w-full overflow-hidden select-none pt-2">
          <svg viewBox="0 0 800 160" className="w-full h-auto block overflow-visible">
            <defs>
              <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.30" />
              </linearGradient>
            </defs>

            {/* Zero line */}
            <line x1="20" y1="20" x2="760" y2="20" stroke="#454545" strokeWidth="1" />
            <text x="790" y="24" fill="#7c7c7c" fontSize="10" textAnchor="end" className="font-mono">0.0%</text>

            {/* -10% line */}
            <line x1="20" y1="95" x2="760" y2="95" stroke="#252525" strokeWidth="1" strokeDasharray="2,3" />
            <text x="790" y="99" fill="#7c7c7c" fontSize="10" textAnchor="end" className="font-mono">-10%</text>

            {/* Drawdown curve points */}
            {(() => {
              const points = drawdowns.map((d, i) => {
                const x = 20 + (i / (drawdowns.length - 1)) * 740;
                const y = 20 + (Math.abs(d.drawdown) / 15) * 115;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              });

              const pathD = `M ${points.join(' L ')}`;
              const areaD = `M 20,20 L ${points.join(' L ')} L 760,20 Z`;

              return (
                <>
                  <path d={areaD} fill="url(#ddGrad)" />
                  <path d={pathD} fill="none" stroke="#f43f5e" strokeWidth="2" />
                  {drawdowns.map((d, i) => {
                    const x = 20 + (i / (drawdowns.length - 1)) * 740;
                    const y = 20 + (Math.abs(d.drawdown) / 15) * 115;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="3" fill="#f43f5e" />
                        <text x={x} y="150" fill="#7c7c7c" fontSize="9" textAnchor="middle" className="font-mono">
                          {d.date.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Two Column Grid: Correlation Matrix & Asset Risk Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Heatmap */}
        <div className="surface-panel rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#313131] pb-2">
            <div>
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Asset Correlation Matrix
              </span>
              <p className="text-[11px] text-[#7c7c7c] mt-0.5">
                Covariance relationship between major portfolio equities.
              </p>
            </div>
            <Activity className="w-4 h-4 text-[#6798ff]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs font-mono">
              <thead>
                <tr className="text-[#7c7c7c]">
                  <th className="py-2 text-left">Asset</th>
                  {correlations.map(c => (
                    <th key={c.symbol} className="py-2 px-1 text-[11px]">{c.symbol.slice(0, 4)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlations.map(row => (
                  <tr key={row.symbol} className="border-t border-[#252525]">
                    <td className="py-2 text-left font-semibold text-white">{row.symbol}</td>
                    {correlations.map(col => {
                      const val = row.correlations[col.symbol] || 0;
                      let bg = 'bg-[#141414] text-[#7c7c7c]';
                      if (val === 1.0) bg = 'bg-[#6798ff]/30 text-white font-bold';
                      else if (val >= 0.7) bg = 'bg-[#f43f5e]/20 text-[#f43f5e] font-semibold';
                      else if (val >= 0.4) bg = 'bg-[#f59e0b]/15 text-[#f59e0b]';
                      else bg = 'bg-[#10b981]/15 text-[#10b981]';

                      return (
                        <td key={col.symbol} className="p-1">
                          <div className={`py-1 rounded text-[11px] ${bg}`}>
                            {val.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Contribution vs Weight Breakdown */}
        <div className="surface-panel rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#313131] pb-2 mb-4">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Risk Contribution vs Allocation
                </span>
                <p className="text-[11px] text-[#7c7c7c] mt-0.5">
                  Percentage of total portfolio volatility driven by each constituent.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {riskContributions.map(rc => (
                <div key={rc.symbol} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-white">{rc.symbol}</span>
                    <span className="text-[#a7a7a7]">
                      Risk: <strong className="text-[#f59e0b]">{rc.riskPct}%</strong> / Alloc: {rc.allocationPct}%
                    </span>
                  </div>
                  <div className="w-full bg-[#141414] h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#6798ff] h-full"
                      style={{ width: `${rc.riskPct * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#313131] text-[11px] text-[#7c7c7c] leading-relaxed font-mono">
            * Reliance and Tata Motors contribute the largest marginal risk to total variance due to beta exposure and volatility regime.
          </div>
        </div>
      </div>
    </div>
  );
};
