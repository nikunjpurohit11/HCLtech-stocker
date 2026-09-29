import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { SettingsService } from '../services';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Shield, Sliders, User, AlertCircle, LogOut } from 'lucide-react';

interface SettingsPageProps {
  onNavigate?: (path: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, profile, refreshProfile, signOut } = useAuth();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [defaultChartRange, setDefaultChartRange] = useState('1Y');
  const [defaultOrderType, setDefaultOrderType] = useState('MARKET');
  const [riskLimit, setRiskLimit] = useState(15);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || '');
      setUserName(profile?.full_name || (user.user_metadata?.full_name as string) || '');
    }

    async function loadSettings() {
      const s = await SettingsService.getSettings();
      if (s) {
        if (s.riskTolerance !== undefined) setRiskLimit(s.riskTolerance);
        if (s.notificationsEnabled !== undefined) setNotificationsEnabled(s.notificationsEnabled);
      }
    }
    loadSettings();
  }, [user, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setNotification(null);

    try {
      // 1. Update profiles table
      if (user && userName) {
        await supabase
          .from('profiles')
          .update({
            full_name: userName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        await refreshProfile();
      }

      // 2. Update user_settings table
      const success = await SettingsService.saveSettings({
        theme: 'dark',
        riskTolerance: riskLimit,
        notificationsEnabled,
      });

      if (success) {
        setNotification({ type: 'success', message: 'Preferences saved to Supabase successfully' });
      } else {
        setNotification({ type: 'error', message: 'Could not update user settings.' });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (onNavigate) onNavigate('/login');
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
            Manage your user profile, simulated paper trading defaults, and Supabase risk thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {notification && (
            <div
              className={`flex items-center gap-1.5 text-xs font-mono animate-in fade-in ${
                notification.type === 'success' ? 'text-[#10b981]' : 'text-[#f43f5e]'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={handleSignOut}
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out
          </Button>
        </div>
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
                placeholder="Nikunj Purohit"
                className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] mb-1.5 uppercase font-mono">
                Email Address (Authenticated)
              </label>
              <input
                type="email"
                disabled
                value={userEmail}
                className="w-full bg-[#141414] border border-[#313131] rounded-lg px-3 py-2 text-xs text-[#7c7c7c] cursor-not-allowed font-mono"
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
              Portfolio Risk Controls (Stored in user_settings)
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
          <Button variant="primary" size="md" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving to Database...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  );
};
