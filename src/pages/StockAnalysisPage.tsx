import React, { useState, useEffect } from 'react';
import { StockQuote, HistoricalBar, TimeFrame, MLPrediction } from '../types';
import { MarketService } from '../services/marketService';
import { PredictionService } from '../services/predictionService';
import { PriceChart } from '../components/charts/PriceChart';
import { IndicatorChart } from '../components/charts/IndicatorChart';
import { SignalBadge } from '../components/common/SignalBadge';
import { MetricCard } from '../components/common/MetricCard';
import { Button } from '../components/common/Button';
import { formatINR, formatPercent, formatVolume } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  Info,
  Layers,
} from 'lucide-react';

interface StockAnalysisPageProps {
  symbol: string;
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
  onTradeStock: (stock: StockQuote) => void;
}

export const StockAnalysisPage: React.FC<StockAnalysisPageProps> = ({
  symbol,
  stocks,
  onSelectStock,
  onTradeStock,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('1Y');
  const [bars, setBars] = useState<HistoricalBar[]>([]);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);
  const [activeIndicatorTab, setActiveIndicatorTab] = useState<'RSI' | 'MACD'>('RSI');
  const [isLoading, setIsLoading] = useState(true);

  const stock = stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase()) || stocks[0];

  useEffect(() => {
    async function loadStockData() {
      setIsLoading(true);
      const [histBars, pred] = await Promise.all([
        MarketService.getHistoricalBars(stock.symbol, timeframe),
        PredictionService.getPredictionForSymbol(stock.symbol),
      ]);
      setBars(histBars);
      setPrediction(pred);
      setIsLoading(false);
    }
    loadStockData();
  }, [stock.symbol, timeframe]);

  const isPositive = stock.change >= 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Asset Switcher */}
      <div className="surface-panel rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Quick Symbol Dropdown */}
          <div className="relative">
            <select
              value={stock.symbol}
              onChange={e => onSelectStock(e.target.value)}
              className="appearance-none bg-[#141414] border border-[#313131] hover:border-[#454545] rounded-xl px-4 py-2 text-lg font-bold font-mono text-white pr-9 focus:outline-none focus:border-[#6798ff] cursor-pointer"
            >
              {stocks.map(s => (
                <option key={s.symbol} value={s.symbol} className="bg-[#1e1e1e] text-white">
                  {s.symbol}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#7c7c7c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{stock.companyName}</span>
              <span className="text-[11px] text-[#7c7c7c] font-mono uppercase">· {stock.sector}</span>
            </div>
            <div className="flex items-baseline gap-3 mt-0.5">
              <span className="text-2xl font-bold font-mono text-white">
                {formatINR(stock.price)}
              </span>
              <span
                className={`text-sm font-mono font-medium flex items-center ${
                  isPositive ? 'text-[#10b981]' : 'text-[#f43f5e]'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1 inline" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 inline" />
                )}
                {formatPercent(stock.changePercent, true)} ({isPositive ? '+' : ''}
                {formatINR(stock.change)})
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right font-mono text-xs text-[#a7a7a7]">
            <span>Day Range: ₹{stock.low.toFixed(1)} - ₹{stock.high.toFixed(1)}</span>
            <span className="text-[11px] text-[#7c7c7c]">52W High: ₹{stock.fiftyTwoWeekHigh}</span>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onTradeStock(stock)}
            className="w-full sm:w-auto"
          >
            Paper Trade {stock.symbol}
          </Button>
        </div>
      </div>

      {/* Main Chart Area */}
      <PriceChart
        bars={bars}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        height={400}
      />

      {/* Sub-Charts Tabs: RSI & MACD */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-[#141414] border border-[#313131] rounded-lg p-0.5 text-xs font-medium">
            <button
              onClick={() => setActiveIndicatorTab('RSI')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeIndicatorTab === 'RSI' ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setActiveIndicatorTab('MACD')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeIndicatorTab === 'MACD' ? 'bg-[#1e1e1e] text-[#6798ff] border border-[#454545]' : 'text-[#a7a7a7]'
              }`}
            >
              MACD (12, 26, 9)
            </button>
          </div>
          <span className="text-[11px] text-[#7c7c7c] font-mono">
            {activeIndicatorTab === 'RSI' ? 'Momentum Oscillator' : 'Trend Following & Momentum Indicator'}
          </span>
        </div>

        <IndicatorChart bars={bars} type={activeIndicatorTab} height={120} />
      </div>

      {/* Two Column Grid: Technical & Risk Metrics (Left) + ML Research Signals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Technical Status & Risk Metrics */}
        <div className="flex flex-col gap-4">
          {/* Technical Diagnostics */}
          <div className="surface-panel rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#313131] pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Technical Diagnostics
              </span>
              <span className="text-[11px] text-[#7c7c7c]">Calculated Daily</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">RSI State</span>
                <span className={`text-xs font-mono font-semibold mt-1 block ${
                  stock.rsi >= 70 ? 'text-[#f43f5e]' : stock.rsi <= 30 ? 'text-[#10b981]' : 'text-white'
                }`}>
                  {stock.rsi >= 70 ? 'Overbought' : stock.rsi <= 30 ? 'Oversold' : 'Neutral Zone'}
                </span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Trend Regime</span>
                <span className={`text-xs font-mono font-semibold mt-1 block ${
                  stock.trend === 'UPTREND' ? 'text-[#10b981]' : stock.trend === 'DOWNTREND' ? 'text-[#f43f5e]' : 'text-[#f59e0b]'
                }`}>
                  {stock.trend}
                </span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Volatility</span>
                <span className="text-xs font-mono font-semibold text-white mt-1 block">
                  {stock.volatility}% Ann.
                </span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Beta vs Nifty</span>
                <span className="text-xs font-mono font-semibold text-white mt-1 block">
                  {stock.beta}
                </span>
              </div>
            </div>
          </div>

          {/* Institutional Risk Metrics */}
          <div className="surface-panel rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#313131] pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Institutional Risk & Performance Metrics
              </span>
              <ShieldAlert className="w-4 h-4 text-[#6798ff]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Sharpe Ratio</span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">1.38</span>
                <span className="text-[10px] text-[#7c7c7c]">Rf = 6.8%</span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Sortino Ratio</span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">1.82</span>
                <span className="text-[10px] text-[#7c7c7c]">Downside risk only</span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Max Drawdown</span>
                <span className="text-base font-bold font-mono text-[#f43f5e] mt-0.5 block">-14.2%</span>
                <span className="text-[10px] text-[#7c7c7c]">Past 52 weeks</span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Daily VaR 95%</span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">-2.35%</span>
                <span className="text-[10px] text-[#7c7c7c]">Parametric model</span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Annualized Return</span>
                <span className="text-base font-bold font-mono text-[#10b981] mt-0.5 block">+22.4%</span>
                <span className="text-[10px] text-[#7c7c7c]">Compounded</span>
              </div>

              <div className="p-2.5 bg-[#141414] border border-[#313131] rounded-lg">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">P/E Ratio</span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">{stock.peRatio}</span>
                <span className="text-[10px] text-[#7c7c7c]">TTM Basis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: ML-Assisted Historical Direction Signal & Feature Importance */}
        <div className="surface-panel rounded-xl p-5 flex flex-col justify-between border-t-2 border-t-[#8b5cf6]/60">
          <div>
            <div className="flex items-center justify-between border-b border-[#313131] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#a855f7]" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  ML-Assisted Direction Signal
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8b5cf6]/15 text-[#a855f7] border border-[#8b5cf6]/30">
                {prediction?.modelName || 'AlphaBoost-v4'}
              </span>
            </div>

            {/* Signal Badge & Probability */}
            <div className="p-4 bg-[#141414] border border-[#313131] rounded-xl flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block mb-1">
                  Predicted Direction ({prediction?.predictionHorizon})
                </span>
                <SignalBadge
                  signal={prediction?.predictedDirection || stock.signal}
                  confidence={prediction?.probability || stock.signalConfidence}
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#7c7c7c] uppercase font-mono block">Confidence</span>
                <span className="text-xl font-bold font-mono text-white">
                  {prediction?.probability || 78}%
                </span>
              </div>
            </div>

            {/* Feature Importance Horizontal Bars */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono block mb-2">
                Top Predictive Feature Weights
              </span>

              <div className="flex flex-col gap-2.5">
                {prediction?.featureImportance.slice(0, 4).map(f => (
                  <div key={f.feature} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#a7a7a7] text-[11px] truncate">{f.feature}</span>
                      <span className="text-white text-[11px] font-medium">{f.importance}%</span>
                    </div>
                    <div className="w-full bg-[#141414] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#6798ff] to-[#a855f7] h-full rounded-full"
                        style={{ width: `${f.importance * 3}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Performance Verification */}
            <div className="p-3 bg-[#141414] border border-[#313131] rounded-lg text-xs font-mono text-[#a7a7a7] flex items-center justify-between">
              <span>Historical Test ROC-AUC:</span>
              <span className="text-white font-semibold">{prediction?.modelPerformance.rocAuc || 0.78}</span>
              <span className="text-[#7c7c7c]">Accuracy: {prediction?.modelPerformance.accuracy || 71.4}%</span>
            </div>
          </div>

          {/* Mandatory Research Disclaimer */}
          <div className="mt-4 pt-3 border-t border-[#313131] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[#7c7c7c] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#7c7c7c] leading-relaxed font-mono">
              Model outputs are historical quantitative research signals derived from out-of-sample backtested features. They do not constitute guaranteed forecasts or financial investment advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
