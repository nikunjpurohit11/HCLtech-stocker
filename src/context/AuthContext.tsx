import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to ensure default portfolio & watchlist exist for the user
  const initializeUserDefaults = async (userId: string) => {
    try {
      // 1. Check if user already has a portfolio
      const { data: existingPortfolios } = await supabase
        .from('portfolios')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (!existingPortfolios || existingPortfolios.length === 0) {
        // Create initial default portfolio with starting paper-trading cash: 100000
        await supabase.from('portfolios').insert({
          user_id: userId,
          name: 'My Portfolio',
          cash_balance: 100000.0,
        });
      }

      // 2. Check if user already has a watchlist
      const { data: existingWatchlists } = await supabase
        .from('watchlists')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (!existingWatchlists || existingWatchlists.length === 0) {
        // Create default watchlist
        const { data: newWl } = await supabase
          .from('watchlists')
          .insert({
            user_id: userId,
            name: 'My Watchlist',
          })
          .select('id')
          .single();

        // Seed with a few initial bluechips for convenience
        if (newWl && newWl.id) {
          await supabase.from('watchlist_items').insert([
            { watchlist_id: newWl.id, symbol: 'RELIANCE' },
            { watchlist_id: newWl.id, symbol: 'TCS' },
            { watchlist_id: newWl.id, symbol: 'HDFCBANK' },
            { watchlist_id: newWl.id, symbol: 'INFY' },
          ]);
        }
      }

      // 3. Check if user_settings exists
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('user_id')
        .eq('user_id', userId)
        .limit(1);

      if (!existingSettings || existingSettings.length === 0) {
        await supabase.from('user_settings').insert({
          user_id: userId,
          theme: 'dark',
          risk_tolerance: 15,
          notifications_enabled: true,
        });
      }
    } catch (err) {
      console.error('Error initializing user defaults:', err);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      }
    } catch {
      // Profile trigger might take a moment or profile might already exist
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        initializeUserDefaults(session.user.id);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
        await initializeUserDefaults(newSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data.session) {
      setSession(data.session);
      setUser(data.user);
      if (data.user) {
        await fetchProfile(data.user.id);
        await initializeUserDefaults(data.user.id);
      }
    }
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (!error && data.user) {
      setUser(data.user);
      setSession(data.session);
      if (data.session) {
        await initializeUserDefaults(data.user.id);
      }
    }
    setLoading(false);
    return { error, user: data.user };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
    return { error };
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
