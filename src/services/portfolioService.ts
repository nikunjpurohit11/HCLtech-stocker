import { Holding, PortfolioSummary, OrderSide, OrderType, Transaction } from '../types';
import { supabase } from '../lib/supabase';
import { MarketService } from './marketService';
import { calculatePnL } from '../utils/financialCalculations';
import { IPortfolioService } from './interfaces';
import { INITIAL_HOLDINGS, INITIAL_PORTFOLIO_SUMMARY } from '../data/mockPortfolio';

const ALLOCATION_PALETTE = ['#6798ff', '#38bdf8', '#818cf8', '#a855f7', '#f59e0b', '#10b981', '#ec4899', '#14b8a6'];

export class SupabasePortfolioService implements IPortfolioService {
  /**
   * Helper to fetch or create the authenticated user's portfolio
   */
  private async getActivePortfolio() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching portfolio from Supabase:', error.message);
      return null;
    }

    if (portfolios && portfolios.length > 0) {
      return portfolios[0];
    }

    // If none exists, create default portfolio with starting paper-trading cash 100,000
    const { data: newPortfolio, error: createError } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        name: 'My Portfolio',
        cash_balance: 100000.0,
      })
      .select('*')
      .single();

    if (createError) {
      console.error('Error creating default portfolio:', createError.message);
      return null;
    }

    return newPortfolio;
  }

  public async getSummary(): Promise<PortfolioSummary> {
    const portfolio = await this.getActivePortfolio();
    if (!portfolio) {
      // Unauthenticated demo/guest fallback
      return INITIAL_PORTFOLIO_SUMMARY;
    }

    const holdings = await this.getHoldings();
    const cashBalance = Number(portfolio.cash_balance) || 0;
    const investedValue = holdings.reduce((sum, h) => sum + h.investedValue, 0);
    const currentHoldingsValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalValue = currentHoldingsValue + cashBalance;
    const todayPnL = holdings.reduce((sum, h) => sum + h.todayPnL, 0);
    const totalPnL = currentHoldingsValue - investedValue;
    const totalPnLPercent = investedValue > 0 ? (totalPnL / investedValue) * 100 : 0;
    const todayPnLPercent = totalValue > 0 ? (todayPnL / totalValue) * 100 : 0;

    return {
      totalValue: Math.round(totalValue * 100) / 100,
      cashBalance: Math.round(cashBalance * 100) / 100,
      investedValue: Math.round(investedValue * 100) / 100,
      todayPnL: Math.round(todayPnL * 100) / 100,
      todayPnLPercent: Math.round(todayPnLPercent * 100) / 100,
      totalPnL: Math.round(totalPnL * 100) / 100,
      totalPnLPercent: Math.round(totalPnLPercent * 100) / 100,
      sharpeRatio: 1.24,
      sortinoRatio: 1.68,
      maxDrawdown: -12.8,
      volatility: 18.4,
      beta: 0.94,
      var95: -Math.round(totalValue * 0.021 * 100) / 100,
    };
  }

  public async getHoldings(): Promise<Holding[]> {
    const portfolio = await this.getActivePortfolio();
    if (!portfolio) {
      // Unauthenticated demo/guest fallback
      return INITIAL_HOLDINGS;
    }

    const { data: dbHoldings, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .order('created_at', { ascending: false });

    if (error || !dbHoldings) {
      console.error('Error fetching holdings from Supabase:', error?.message);
      return [];
    }

    // Resolve market quotes to compute live derived values
    const holdingsList: Holding[] = [];
    let totalMarketVal = 0;

    // First pass: compute current prices and market values
    for (let i = 0; i < dbHoldings.length; i++) {
      const row = dbHoldings[i];
      const stock = await MarketService.getStockBySymbol(row.symbol);
      const currentPrice = stock ? stock.price : Number(row.average_price);
      const quantity = Number(row.quantity);
      const averagePrice = Number(row.average_price);
      const calc = calculatePnL(quantity, averagePrice, currentPrice);
      totalMarketVal += calc.currentValue;

      holdingsList.push({
        symbol: row.symbol,
        companyName: stock ? stock.companyName : row.symbol,
        sector: stock ? stock.sector.split(' ')[0] : 'Equities',
        quantity,
        averagePrice,
        currentPrice,
        investedValue: calc.investedValue,
        currentValue: calc.currentValue,
        unrealizedPnL: calc.pnl,
        unrealizedPnLPercent: calc.pnlPercent,
        todayPnL: stock ? Math.round(quantity * stock.change * 100) / 100 : 0,
        portfolioWeight: 0, // calculated in second pass
        allocationColor: ALLOCATION_PALETTE[i % ALLOCATION_PALETTE.length],
      });
    }

    // Second pass: compute weights
    const cash = Number(portfolio.cash_balance) || 0;
    const totalPortfolioVal = totalMarketVal + cash;

    for (const h of holdingsList) {
      h.portfolioWeight = totalPortfolioVal > 0 
        ? Math.round((h.currentValue / totalPortfolioVal) * 1000) / 10 
        : 0;
    }

    return holdingsList;
  }

  public async getSectorAllocation(): Promise<{ sector: string; value: number; percentage: number; color: string }[]> {
    const holdings = await this.getHoldings();
    const sectors: Record<string, { value: number; color: string }> = {};

    let total = 0;
    holdings.forEach((h, idx) => {
      if (!sectors[h.sector]) {
        sectors[h.sector] = {
          value: 0,
          color: ALLOCATION_PALETTE[idx % ALLOCATION_PALETTE.length],
        };
      }
      sectors[h.sector].value += h.currentValue;
      total += h.currentValue;
    });

    return Object.entries(sectors).map(([sector, data]) => ({
      sector,
      value: Math.round(data.value * 100) / 100,
      percentage: total > 0 ? Math.round((data.value / total) * 1000) / 10 : 0,
      color: data.color,
    }));
  }

  public async executePaperTrade(order: {
    symbol: string;
    companyName: string;
    side: OrderSide;
    orderType: OrderType;
    quantity: number;
    price: number;
  }): Promise<{ success: boolean; message: string; transaction?: Transaction }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const quantity = Number(order.quantity);
      const price = Number(order.price);
      const totalCost = quantity * price;

      const txResult: Transaction = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        symbol: order.symbol,
        companyName: order.companyName,
        side: order.side,
        orderType: order.orderType,
        quantity,
        price,
        totalValue: totalCost,
        status: 'EXECUTED',
      };

      return {
        success: true,
        message: `Paper order executed (Guest Mode): ${order.side} ${quantity} ${order.symbol} @ ₹${price.toFixed(2)}. Sign in with Supabase to persist your positions!`,
        transaction: txResult,
      };
    }

    const portfolio = await this.getActivePortfolio();
    if (!portfolio) {
      return {
        success: false,
        message: 'Could not access active portfolio.',
      };
    }

    const quantity = Number(order.quantity);
    const price = Number(order.price);
    const totalCost = quantity * price;
    const currentCash = Number(portfolio.cash_balance) || 0;

    if (order.side === 'BUY') {
      if (totalCost > currentCash) {
        return {
          success: false,
          message: `Insufficient cash balance. Available: ₹${currentCash.toFixed(2)}, Required: ₹${totalCost.toFixed(2)}`,
        };
      }

      // Check existing holding
      const { data: existingHoldings } = await supabase
        .from('holdings')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .eq('symbol', order.symbol)
        .limit(1);

      const existing = existingHoldings && existingHoldings.length > 0 ? existingHoldings[0] : null;

      // 1. Update Portfolio Cash Balance
      const newCash = currentCash - totalCost;
      const { error: cashError } = await supabase
        .from('portfolios')
        .update({
          cash_balance: newCash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', portfolio.id);

      if (cashError) {
        return { success: false, message: `Failed to update cash balance: ${cashError.message}` };
      }

      // 2. Insert or update holding
      if (existing) {
        const oldQty = Number(existing.quantity);
        const oldAvg = Number(existing.average_price);
        const newQty = oldQty + quantity;
        const newAvg = Math.round(((oldQty * oldAvg + totalCost) / newQty) * 100) / 100;

        await supabase
          .from('holdings')
          .update({
            quantity: newQty,
            average_price: newAvg,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('holdings').insert({
          portfolio_id: portfolio.id,
          symbol: order.symbol,
          quantity,
          average_price: price,
        });
      }
    } else {
      // SELL
      const { data: existingHoldings } = await supabase
        .from('holdings')
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .eq('symbol', order.symbol)
        .limit(1);

      const existing = existingHoldings && existingHoldings.length > 0 ? existingHoldings[0] : null;

      if (!existing || Number(existing.quantity) < quantity) {
        return {
          success: false,
          message: `Insufficient shares to sell. Available: ${existing ? existing.quantity : 0} shares.`,
        };
      }

      // 1. Update Portfolio Cash Balance
      const newCash = currentCash + totalCost;
      const { error: cashError } = await supabase
        .from('portfolios')
        .update({
          cash_balance: newCash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', portfolio.id);

      if (cashError) {
        return { success: false, message: `Failed to update cash balance: ${cashError.message}` };
      }

      // 2. Decrement or remove holding
      const remainingQty = Number(existing.quantity) - quantity;
      if (remainingQty <= 0) {
        await supabase.from('holdings').delete().eq('id', existing.id);
      } else {
        await supabase
          .from('holdings')
          .update({
            quantity: remainingQty,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      }
    }

    // 3. Insert transaction row
    const { data: txRow, error: txError } = await supabase
      .from('transactions')
      .insert({
        portfolio_id: portfolio.id,
        symbol: order.symbol,
        side: order.side,
        order_type: order.orderType,
        quantity,
        price,
        status: 'EXECUTED',
      })
      .select('*')
      .single();

    if (txError) {
      console.error('Error recording transaction:', txError.message);
    }

    // 4. Insert paper_trades row
    await supabase.from('paper_trades').insert({
      user_id: user.id,
      portfolio_id: portfolio.id,
      symbol: order.symbol,
      side: order.side,
      quantity,
      status: 'EXECUTED',
    });

    const txResult: Transaction = {
      id: txRow?.id || `TX-${Date.now().toString().slice(-6)}`,
      date: txRow?.created_at || new Date().toISOString(),
      symbol: order.symbol,
      companyName: order.companyName,
      side: order.side,
      orderType: order.orderType,
      quantity,
      price,
      totalValue: totalCost,
      status: 'EXECUTED',
    };

    return {
      success: true,
      message: `Paper order executed: ${order.side} ${quantity} ${order.symbol} @ ₹${price.toFixed(2)}`,
      transaction: txResult,
    };
  }

  // Static backward-compatible helper methods
  public static async getSummary(): Promise<PortfolioSummary> {
    return new SupabasePortfolioService().getSummary();
  }

  public static async getHoldings(): Promise<Holding[]> {
    return new SupabasePortfolioService().getHoldings();
  }

  public static async getSectorAllocation(): Promise<{ sector: string; value: number; percentage: number; color: string }[]> {
    return new SupabasePortfolioService().getSectorAllocation();
  }

  public static async executePaperTrade(order: Parameters<IPortfolioService['executePaperTrade']>[0]): Promise<ReturnType<IPortfolioService['executePaperTrade']>> {
    return new SupabasePortfolioService().executePaperTrade(order);
  }
}

export const PortfolioService = SupabasePortfolioService;
