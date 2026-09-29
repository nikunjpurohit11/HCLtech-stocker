import React from 'react';
import { Button } from '../components/common/Button';
import { ArrowRight, TrendingUp, ShieldCheck, Cpu, BarChart3, LineChart, ChevronRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between overflow-hidden selection:bg-[#6798ff]/30">
      {/* Subtle Aurora Gradient Layer (Stocketa atmospheric accent) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[650px] aurora-glow pointer-events-none -z-0 opacity-70" />

      {/* Top Bar Contract (Single text brand, 4 nav links, primary action) */}
      <header className="relative z-10 h-20 border-b border-[#313131]/60 px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Brand Zone */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#454545] flex items-center justify-center text-[#6798ff]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <span className="font-mono text-sm font-bold tracking-widest uppercase">
            VERTEX ANALYTICS
          </span>
        </div>

        {/* 4 Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#a7a7a7]">
          <button onClick={() => onNavigate('/markets')} className="hover:text-white transition-colors cursor-pointer">
            Markets
          </button>
          <button onClick={() => onNavigate('/risk')} className="hover:text-white transition-colors cursor-pointer">
            Risk Engine
          </button>
          <button onClick={() => onNavigate('/strategy-lab')} className="hover:text-white transition-colors cursor-pointer">
            Strategy Lab
          </button>
          <button onClick={() => onNavigate('/ai-insights')} className="hover:text-white transition-colors cursor-pointer">
            ML Research
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/login')}
            className="text-xs text-[#a7a7a7] hover:text-white transition-colors px-3 py-1.5 cursor-pointer font-medium"
          >
            Sign In
          </button>
          <Button
            variant="pill"
            size="sm"
            onClick={() => onNavigate('/dashboard')}
          >
            Open Terminal
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-16 pb-20 max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        {/* Subtle pill kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#313131] text-xs font-mono text-[#a7a7a7] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6798ff]" />
          <span>Institutional Research & Paper-Trading Terminal</span>
        </div>

        {/* Wealthsimple Editorial Headline */}
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.12] mb-6 max-w-3xl">
          Understand the market.<br />
          Test your strategy.<br />
          <span className="italic font-normal text-[#a7a7a7]">Manage your portfolio.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-sm md:text-base text-[#a7a7a7] max-w-2xl mx-auto leading-relaxed mb-10">
          A unified, data-dense platform engineered for quantitative stock analysis, technical indicators, institutional risk metrics, backtesting, and machine-learning direction signals.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/dashboard')}
            className="w-full sm:w-auto px-8"
          >
            <span>Explore the Platform</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('/stock/RELIANCE')}
            className="w-full sm:w-auto px-8"
          >
            View Live Stock Demo
          </Button>
        </div>

        {/* Polished Terminal Mockup Container */}
        <div className="w-full surface-panel rounded-2xl p-4 sm:p-6 shadow-2xl relative group border border-[#313131] hover:border-[#454545] transition-all">
          <div className="flex items-center justify-between border-b border-[#313131] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
              <span className="ml-2 text-xs font-mono text-[#7c7c7c]">VERTEX-TERMINAL // v2.6.4</span>
            </div>
            <div className="text-xs font-mono text-[#10b981] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>NSE LIVE MKT · NIFTY 25,482.50 (+0.56%)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 bg-[#141414] rounded-lg border border-[#252525]">
              <span className="text-[10px] text-[#7c7c7c] uppercase font-mono">Portfolio Value</span>
              <div className="text-lg font-bold font-mono text-white mt-1">₹8,42,560</div>
              <span className="text-[11px] text-[#10b981] font-mono">+18.42% Total</span>
            </div>
            <div className="p-3 bg-[#141414] rounded-lg border border-[#252525]">
              <span className="text-[10px] text-[#7c7c7c] uppercase font-mono">Sharpe Ratio</span>
              <div className="text-lg font-bold font-mono text-white mt-1">1.24</div>
              <span className="text-[11px] text-[#a7a7a7] font-mono">Benchmark: 0.98</span>
            </div>
            <div className="p-3 bg-[#141414] rounded-lg border border-[#252525]">
              <span className="text-[10px] text-[#7c7c7c] uppercase font-mono">Max Drawdown</span>
              <div className="text-lg font-bold font-mono text-[#f43f5e] mt-1">-12.8%</div>
              <span className="text-[11px] text-[#7c7c7c] font-mono">30D Recovery</span>
            </div>
            <div className="p-3 bg-[#141414] rounded-lg border border-[#252525]">
              <span className="text-[10px] text-[#7c7c7c] uppercase font-mono">ML Signal Model</span>
              <div className="text-lg font-bold font-mono text-[#a855f7] mt-1">AlphaBoost</div>
              <span className="text-[11px] text-[#a7a7a7] font-mono">78% Confidence</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#252525] flex items-center justify-between text-xs text-[#a7a7a7]">
            <span>Clicking anywhere takes you directly to the interactive workspace.</span>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-[#6798ff] hover:underline flex items-center gap-1 font-mono"
            >
              <span>Launch Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="relative z-10 px-6 py-16 border-t border-[#313131]/60 bg-[#0e0e0e]/50 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2 p-4">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#313131] flex items-center justify-center text-[#6798ff] mb-2">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Advanced Financial Analytics</h3>
            <p className="text-xs text-[#a7a7a7] leading-relaxed">
              Multi-timeframe candlestick and line charts with SMA 20/50/200 overlays, Bollinger Bands, RSI momentum indicators, and MACD divergence analysis.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#313131] flex items-center justify-center text-[#10b981] mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Institutional Risk Modeling</h3>
            <p className="text-xs text-[#a7a7a7] leading-relaxed">
              Real-time calculation of Sortino and Sharpe ratios, Value at Risk (VaR 95%), asset correlation matrices, and historical peak-to-trough drawdowns.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#313131] flex items-center justify-center text-[#a855f7] mb-2">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">ML Research & Backtesting</h3>
            <p className="text-xs text-[#a7a7a7] leading-relaxed">
              Gradient-boosted decision trees predicting direction signals alongside out-of-sample feature importance rankings and customizable algorithmic strategy simulations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#313131] py-8 px-6 text-center text-xs text-[#7c7c7c] font-mono">
        <p>VERTEX ADVANCED STOCK TRADING & PORTFOLIO MANAGEMENT PLATFORM</p>
        <p className="mt-1">For educational and simulated paper-trading research only. No real money brokerage execution.</p>
      </footer>
    </div>
  );
};
