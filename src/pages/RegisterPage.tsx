import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
  onRegisterSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess();
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
              Create your institutional research account.
            </h2>
            <p className="text-xs text-[#a7a7a7] leading-relaxed">
              Start with a simulated ₹10,00,000 paper trading portfolio to test alpha generation strategies without real-money execution risk.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#252525] flex items-center gap-3 text-xs text-[#7c7c7c] font-mono">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Ready for Supabase Auth migration</span>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#1e1e1e]/60">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white tracking-tight">Create Account</h3>
            <p className="text-xs text-[#a7a7a7] mt-1">
              Set up your research credentials.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-xs text-[#f43f5e] font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7c7c7c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nikunj Purohit"
                  className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#7c7c7c] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1 font-mono">
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
              <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1 font-mono">
                Password
              </label>
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

            <div>
              <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7c7c7c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#7c7c7c] focus:outline-none font-mono"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading}
              className="mt-3 w-full"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#7c7c7c]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="text-[#6798ff] hover:underline font-medium cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
