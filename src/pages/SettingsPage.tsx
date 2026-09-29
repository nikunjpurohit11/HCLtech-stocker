import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { CheckCircle2, RotateCcw, Shield, Sliders, User, Bell } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [userName, setUserName] = useState('Nikunj Purohit');
  const [userEmail, setUserEmail] = useState('purohitnikunj19@gmail.com');
  const [defaultChartRange, setDefaultChartRange] = useState('1Y');
  const [defaultOrderType, setDefaultOrderType] = useState('MARKET');
  const [riskLimit, setRiskLimit] = useState(15);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#313131] pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Platform Settings & Configuration
          </h1>
          <p className="text-xs text-[#a7a7a7] mt-1">
            Manage your user profile, simulated paper trading defaults, and risk thresholds.
          </p>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 text-xs text-[#10b981] font-mono animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* User Profile */}
        <div className="surface-panel rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#313131] pb-3">
            <User className="w-4 h-4 text-[#6798ff]" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              User Profile & Supabase Authentication
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] mb-1.5 uppercase font-mono">
                Full Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] mb-1.5 uppercase font-mono">
                Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Paper Trading Preferences */}
        <div className="surface-panel rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#313131] pb-3">
            <Sliders className="w-4 h-4 text-[#10b981]" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Execution & Charting Defaults
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] mb-1.5 uppercase font-mono">
                Default Chart Lookback
              </label>
              <select
                value={defaultChartRange}
                onChange={e => setDefaultChartRange(e.target.value)}
                className="w-full bg-[#141414] border border-[#313131] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6798ff] font-mono"
              >
                <option value="1D">1-Day Intraday</option>
                <option value="1M">1-Month Swing</option>
                <option value="6M">6-Month Macro</option>
                <option value="1Y">1-Year Institutional</option>
                <option value="5Y">5-Year Structural</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] mb-1.5 uppercase font-mono">
                Default Order Type
              </label>
              <select
                value={defaultOrderType}
                onChange={e => setDefaultOrderType(e.target.value)}
                className="w-full bg-[#141414] border border-[#313131] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6798ff] font-mono"
              >
                <option value="MARKET">Market Order</option>
                <option value="LIMIT">Limit Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risk Governance */}
        <div className="surface-panel rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-[#313131] pb-3">
            <Shield className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Portfolio Risk Controls
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[#a7a7a7]">Max Tolerable Drawdown Threshold:</span>
              <span className="text-white font-semibold">{riskLimit}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={riskLimit}
              onChange={e => setRiskLimit(Number(e.target.value))}
              className="w-full accent-[#f59e0b]"
            />
            <p className="text-[11px] text-[#7c7c7c] mt-1.5 font-mono">
              The risk engine flags red telemetry warnings when portfolio peak-to-trough drops exceed this threshold.
            </p>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="primary" size="md" type="submit">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
