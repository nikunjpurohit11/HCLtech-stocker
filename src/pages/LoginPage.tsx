import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('purohitnikunj19@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your registered email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onNavigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 selection:bg-[#6798ff]/30">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-[#313131] bg-[#141414] overflow-hidden shadow-2xl">
        {/* Left Column: Brand Statement */}
        <div className="p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-[#141414] via-[#101010] to-[#0a0a0a] border-b md:border-b-0 md:border-r border-[#313131]">
          <div>
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer mb-8"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1e1e1e] border border-[#454545] flex items-center justify-center text-[#6798ff]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="font-mono text-sm font-bold tracking-widest uppercase text-white">
                VERTEX ANALYTICS
              </span>
            </div>

            <h2 className="font-editorial text-3xl font-medium text-white tracking-tight leading-tight mb-4">
              Institutional-grade market intelligence at your command.
            </h2>
            <p className="text-xs text-[#a7a7a7] leading-relaxed">
              Sign in to access real-time NSE market indicators, portfolio valuations, automated backtests, and out-of-sample machine learning signals.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#252525] flex items-center gap-3 text-xs text-[#7c7c7c] font-mono">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Encrypted paper trading environment</span>
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#1e1e1e]/60">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white tracking-tight">Sign In</h3>
            <p className="text-xs text-[#a7a7a7] mt-1">
              Ready for Supabase Auth connection.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-xs text-[#f43f5e] font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7c7c7c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="analyst@firm.com"
                  className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#7c7c7c] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#a7a7a7] uppercase tracking-wider font-mono">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7c7c7c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-[#7c7c7c] focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c7c7c] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Terminal'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#7c7c7c]">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="text-[#6798ff] hover:underline font-medium cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
