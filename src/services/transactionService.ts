import { Transaction } from '../types';
import { supabase } from '../lib/supabase';
import { MarketService } from './marketService';
import { ITransactionService } from './interfaces';
import { INITIAL_TRANSACTIONS } from '../data/mockTransactions';

export class SupabaseTransactionService implements ITransactionService {
  private async getPortfolioId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('portfolios')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    return data && data.length > 0 ? data[0].id : null;
  }

  public async getTransactions(limit?: number): Promise<Transaction[]> {
    const portfolioId = await this.getPortfolioId();
    if (!portfolioId) {
      return limit ? INITIAL_TRANSACTIONS.slice(0, limit) : INITIAL_TRANSACTIONS;
    }

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error('Error fetching transactions from Supabase:', error?.message);
      return [];
    }

    const result: Transaction[] = [];
    for (const row of data) {
      const stock = await MarketService.getStockBySymbol(row.symbol);
      const qty = Number(row.quantity);
      const price = Number(row.price);

      result.push({
        id: row.id,
        date: row.created_at,
        symbol: row.symbol,
        companyName: stock ? stock.companyName : row.symbol,
        side: row.side,
        orderType: row.order_type,
        quantity: qty,
        price: price,
        totalValue: Math.round(qty * price * 100) / 100,
        status: row.status || 'EXECUTED',
      });
    }

    return result;
  }

  public async addTransaction(tx: Transaction): Promise<void> {
    const portfolioId = await this.getPortfolioId();
    if (!portfolioId) return;

    await supabase.from('transactions').insert({
      portfolio_id: portfolioId,
      symbol: tx.symbol,
      side: tx.side,
      order_type: tx.orderType,
      quantity: tx.quantity,
      price: tx.price,
      status: tx.status,
    });
  }

  // Static convenience wrappers
  public static async getTransactions(limit?: number): Promise<Transaction[]> {
    return new SupabaseTransactionService().getTransactions(limit);
  }

  public static async addTransaction(tx: Transaction): Promise<void> {
    return new SupabaseTransactionService().addTransaction(tx);
  }
}

export const TransactionService = SupabaseTransactionService;
