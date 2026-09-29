import React, { useState, useEffect } from 'react';
import { StockQuote, BacktestResult } from '../types';
import { StrategyService } from '../services';
import { Button } from '../components/common/Button';
import { MetricCard } from '../components/common/MetricCard';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { formatINR } from '../utils/formatters';
import { Play } from 'lucide-react';

interface StrategyLabPageProps {
  stocks: StockQuote[];
}

export const StrategyLabPage: React.FC<StrategyLabPageProps> = ({ stocks }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'MA_CROSSOVER' | 'RSI' | 'BOLLINGER' | 'ML_MOMENTUM'>('MA_CROSSOVER');
  const [selectedStock, setSelectedStock] = useState<string>('RELIANCE');
  const [initialCapital, setInitialCapital] = useState<number>(500000);

  // Strategy specific parameters
  const [maFast, setMaFast] = useState<number>(20);
  const [maSlow, setMaSlow] = useState<number>(50);

  const [rsiPeriod, setRsiPeriod] = useState<number>(14);
  const [rsiOversold, setRsiOversold] = useState<number>(30);
  const [rsiOverbought, setRsiOverbought] = useState<number>(70);

  const [bbPeriod, setBbPeriod] = useState<number>(20);
  const [bbStdDev, setBbStdDev] = useState<number>(2.0);

  const [mlHorizon, setMlHorizon] = useState<string>('5D');
  const [mlConfidence, setMlConfidence] = useState<number>(0.65);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const runBacktestSimulation = async () => {
    setIsRunning(true);
    const res = await StrategyService.runBacktest({
      strategyType: selectedStrategy,
      symbol: selectedStock,
      initialCapital,
      parameters: {
        maFast,
        maSlow,
        rsiPeriod,
        rsiOversold,
        rsiOverbought,
        bbPeriod,
        bbStdDev,
        mlHorizon,
        mlConfidence,
      },
    });
    setResult(res);
    setIsRunning(false);
  };

  useEffect(() => {
    runBacktestSimulation();
  }, [selectedStrategy]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Strategy Lab & Backtesting Engine
          </h1>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Simulate quantitative trading models against historical market tick data with dynamic parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={runBacktestSimulation}
            disabled={isRunning}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            {isRunning ? 'Simulating...' : 'Run Backtest'}
          </Button>
        </div>
      </div>

      {/* Strategy Selector & Parameters Card */}
      <div className="surface-panel rounded-xl p-5 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#313131] pb-4">
          {/* Strategy Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#141414] border border-[#313131] rounded-xl p-1 text-xs">
            <button
              onClick={() => setSelectedStrategy('MA_CROSSOVER')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedStrategy === 'MA_CROSSOVER' ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              MA Crossover
            </button>
            <button
              onClick={() => setSelectedStrategy('RSI')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedStrategy === 'RSI' ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              RSI Mean Reversion
            </button>
            <button
              onClick={() => setSelectedStrategy('BOLLINGER')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedStrategy === 'BOLLINGER' ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              Bollinger Bands
            </button>
            <button
              onClick={() => setSelectedStrategy('ML_MOMENTUM')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedStrategy === 'ML_MOMENTUM' ? 'bg-[#1e1e1e] text-[#a855f7] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              XGBoost ML Momentum
            </button>
          </div>

          {/* Asset & Capital Setup */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#7c7c7c]">Asset:</span>
              <select
                value={selectedStock}
                onChange={e => setSelectedStock(e.target.value)}
                className="bg-[#141414] border border-[#313131] rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-[#6798ff]"
              >
                {stocks.map(s => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#7c7c7c]">Capital:</span>
              <select
                value={initialCapital}
                onChange={e => setInitialCapital(Number(e.target.value))}
                className="bg-[#141414] border border-[#313131] rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-[#6798ff]"
              >
                <option value={100000}>₹1,00,000</option>
                <option value={500000}>₹5,00,000</option>
                <option value={1000000}>₹10,00,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Parameter Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {selectedStrategy === 'MA_CROSSOVER' && (
            <>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Fast SMA:</span>
                  <span className="text-white font-semibold">{maFast} Periods</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={maFast}
                  onChange={e => setMaFast(Number(e.target.value))}
                  className="accent-[#6798ff]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Slow SMA:</span>
                  <span className="text-white font-semibold">{maSlow} Periods</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  value={maSlow}
                  onChange={e => setMaSlow(Number(e.target.value))}
                  className="accent-[#6798ff]"
                />
              </div>
            </>
          )}

          {selectedStrategy === 'RSI' && (
            <>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">RSI Lookback:</span>
                  <span className="text-white font-semibold">{rsiPeriod}</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="28"
                  value={rsiPeriod}
                  onChange={e => setRsiPeriod(Number(e.target.value))}
                  className="accent-[#6798ff]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Oversold Threshold:</span>
                  <span className="text-[#10b981] font-semibold">{rsiOversold}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={rsiOversold}
                  onChange={e => setRsiOversold(Number(e.target.value))}
                  className="accent-[#10b981]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Overbought Threshold:</span>
                  <span className="text-[#f43f5e] font-semibold">{rsiOverbought}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="85"
                  value={rsiOverbought}
                  onChange={e => setRsiOverbought(Number(e.target.value))}
                  className="accent-[#f43f5e]"
                />
              </div>
            </>
          )}

          {selectedStrategy === 'BOLLINGER' && (
            <>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Band Period:</span>
                  <span className="text-white font-semibold">{bbPeriod}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={bbPeriod}
                  onChange={e => setBbPeriod(Number(e.target.value))}
                  className="accent-[#6798ff]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Std Deviation:</span>
                  <span className="text-white font-semibold">{bbStdDev.toFixed(1)}σ</span>
                </div>
                <input
                  type="range"
                  step="0.1"
                  min="1.0"
                  max="3.0"
                  value={bbStdDev}
                  onChange={e => setBbStdDev(Number(e.target.value))}
                  className="accent-[#6798ff]"
                />
              </div>
            </>
          )}

          {selectedStrategy === 'ML_MOMENTUM' && (
            <>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Target Horizon:</span>
                  <span className="text-[#a855f7] font-semibold">{mlHorizon} Forward</span>
                </div>
                <select
                  value={mlHorizon}
                  onChange={e => setMlHorizon(e.target.value)}
                  className="bg-[#141414] border border-[#313131] rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  <option value="1D">1-Day Forward</option>
                  <option value="5D">5-Day Forward</option>
                  <option value="10D">10-Day Forward</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#a7a7a7]">Confidence Gate:</span>
                  <span className="text-white font-semibold">{(mlConfidence * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  step="0.05"
                  min="0.50"
                  max="0.85"
                  value={mlConfidence}
                  onChange={e => setMlConfidence(Number(e.target.value))}
                  className="accent-[#a855f7]"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backtest Results Row */}
      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <MetricCard
              label="Final Capital"
              value={formatINR(result.finalValue, { compact: true })}
              subtext={`Start: ${formatINR(result.initialCapital, { compact: true })}`}
            />
            <MetricCard
              label="Total Return"
              value={`+${result.totalReturn}%`}
              isPositive={true}
            />
            <MetricCard
              label="CAGR"
              value={`+${result.cagr}%`}
              isPositive={true}
            />
            <MetricCard
              label="Sharpe"
              value={String(result.sharpeRatio)}
            />
            <MetricCard
              label="Max DD"
              value={`${result.maxDrawdown}%`}
              isPositive={false}
            />
            <MetricCard
              label="Win Rate"
              value={`${result.winRate}%`}
              isPositive={result.winRate >= 50}
            />
            <MetricCard
              label="Total Trades"
              value={String(result.totalTrades)}
              subtext={`${result.winningTrades}W / ${result.losingTrades}L`}
            />
            <MetricCard
              label="Profit Factor"
              value={String(result.profitFactor)}
            />
          </div>

          {/* Comparative Equity Curve */}
          <div className="surface-panel rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#313131] pb-3">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Cumulative Equity Growth: Strategy vs Benchmark
                </span>
                <p className="text-[11px] text-[#7c7c7c] mt-0.5">
                  Simulated performance curve plotted against the Nifty 50 buy-and-hold baseline.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#a7a7a7]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#6798ff] inline-block" />
                  <span>Strategy ({result.totalReturn}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#7c7c7c] inline-block border-b border-dashed border-[#7c7c7c]" />
                  <span>Benchmark</span>
                </span>
              </div>
            </div>

            <EquityCurveChart data={result.equityCurve} height={220} />
          </div>
        </>
      )}
    </div>
  );
};
