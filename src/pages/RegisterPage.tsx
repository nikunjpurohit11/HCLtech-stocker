import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
  onRegisterSuccess?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const { error: signUpError, user: newUser } = await signUp(email.trim(), password, name.trim());

      if (signUpError) {
        if (signUpError.message.includes('rate limit')) {
          setError('Email rate limit exceeded by Supabase mail server. Please try signing in if your account is already created, or wait a few minutes.');
        } else if (signUpError.message.includes('already registered')) {
          setError('This email address is already registered. Please sign in instead.');
        } else {
          setError(signUpError.message);
        }
      } else {
        if (onRegisterSuccess) onRegisterSuccess();

        // If email confirmation is required by the Supabase project
        if (newUser && !newUser.confirmed_at && !newUser.email_confirmed_at) {
          setSuccessMessage('Registration successful! Please check your email to confirm your account, then sign in.');
        } else {
          onNavigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
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
              Start with a persistent ₹1,00,000 starting cash paper-trading portfolio backed by Supabase PostgreSQL and Row-Level Security.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#252525] flex items-center gap-3 text-xs text-[#7c7c7c] font-mono">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>Integrated with Supabase Auth & PostgreSQL</span>
          </div>
        </div>

        {/* Right Column: Register Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#1e1e1e]/60">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white tracking-tight">Create Account</h3>
            <p className="text-xs text-[#a7a7a7] mt-1">
              Set up your research credentials and default paper portfolio.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-[#f43f5e]/15 border border-[#f43f5e]/30 text-xs text-[#f43f5e] font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage ? (
            <div className="p-4 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex flex-col gap-3 text-xs font-mono text-[#10b981]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('/login')}
                className="mt-2 w-full"
              >
                Proceed to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[#a7a7a7] uppercase tracking-wider mb-1 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7c7c7c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
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
                    required
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
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#141414] border border-[#313131] focus:border-[#6798ff] rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-[#7c7c7c] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7c7c7c] hover:text-white cursor-pointer"
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
                    required
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
                {isLoading ? 'Creating Supabase Account...' : 'Complete Registration'}
              </Button>
            </form>
          )}

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
