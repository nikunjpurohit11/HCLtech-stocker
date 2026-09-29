import { WatchlistItem } from '../types';
import { supabase } from '../lib/supabase';
import { MarketService } from './marketService';
import { IWatchlistService } from './interfaces';

export class SupabaseWatchlistService implements IWatchlistService {
  private async getOrCreateWatchlistId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: watchlists, error } = await supabase
      .from('watchlists')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (error) {
      console.error('Error fetching watchlist from Supabase:', error.message);
      return null;
    }

    if (watchlists && watchlists.length > 0) {
      return watchlists[0].id;
    }

    // Create default watchlist
    const { data: newWl, error: createError } = await supabase
      .from('watchlists')
      .insert({
        user_id: user.id,
        name: 'My Watchlist',
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating default watchlist:', createError.message);
      return null;
    }

    return newWl?.id || null;
  }

  public async getWatchlistSymbols(): Promise<string[]> {
    const watchlistId = await this.getOrCreateWatchlistId();
    if (!watchlistId) {
      return ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
    }

    const { data, error } = await supabase
      .from('watchlist_items')
      .select('symbol')
      .eq('watchlist_id', watchlistId)
      .order('added_at', { ascending: false });

    if (error || !data) {
      return ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
    }

    return data.length > 0 ? data.map(item => item.symbol) : ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
  }

  public async getWatchlistItems(): Promise<WatchlistItem[]> {
    const watchlistId = await this.getOrCreateWatchlistId();
    if (!watchlistId) return [];

    const { data, error } = await supabase
      .from('watchlist_items')
      .select('*')
      .eq('watchlist_id', watchlistId)
      .order('added_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    const items: WatchlistItem[] = [];
    for (const row of data) {
      const stock = await MarketService.getStockBySymbol(row.symbol);
      items.push({
        id: row.id,
        symbol: row.symbol,
        companyName: stock ? stock.companyName : row.symbol,
        addedAt: row.added_at,
        notes: row.notes || undefined,
        targetPrice: row.target_price ? Number(row.target_price) : undefined,
      });
    }

    return items;
  }

  public async addToWatchlist(symbol: string, notes?: string, targetPrice?: number): Promise<boolean> {
    const watchlistId = await this.getOrCreateWatchlistId();
    if (!watchlistId) return false;

    // Check if symbol already in watchlist
    const { data: existing } = await supabase
      .from('watchlist_items')
      .select('id')
      .eq('watchlist_id', watchlistId)
      .eq('symbol', symbol)
      .limit(1);

    if (existing && existing.length > 0) {
      return true; // Already exists
    }

    const { error } = await supabase.from('watchlist_items').insert({
      watchlist_id: watchlistId,
      symbol,
      notes: notes || null,
      target_price: targetPrice || null,
    });

    return !error;
  }

  public async removeFromWatchlist(symbol: string): Promise<boolean> {
    const watchlistId = await this.getOrCreateWatchlistId();
    if (!watchlistId) return false;

    const { error } = await supabase
      .from('watchlist_items')
      .delete()
      .eq('watchlist_id', watchlistId)
      .eq('symbol', symbol);

    return !error;
  }

  // Static convenience methods
  public static async getWatchlistSymbols(): Promise<string[]> {
    return new SupabaseWatchlistService().getWatchlistSymbols();
  }

  public static async getWatchlistItems(): Promise<WatchlistItem[]> {
    return new SupabaseWatchlistService().getWatchlistItems();
  }

  public static async addToWatchlist(symbol: string, notes?: string, targetPrice?: number): Promise<boolean> {
    return new SupabaseWatchlistService().addToWatchlist(symbol, notes, targetPrice);
  }

  public static async removeFromWatchlist(symbol: string): Promise<boolean> {
    return new SupabaseWatchlistService().removeFromWatchlist(symbol);
  }
}

export const WatchlistService = SupabaseWatchlistService;
