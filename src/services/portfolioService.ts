import { Holding, PortfolioSummary, OrderSide, OrderType, Transaction } from '../types';
import { INITIAL_HOLDINGS, INITIAL_PORTFOLIO_SUMMARY } from '../data';
import { calculatePnL } from '../utils/financialCalculations';
import { TransactionService } from './transactionService';
import { IPortfolioService } from './interfaces';

export class MockPortfolioService implements IPortfolioService {
  private static holdings: Holding[] = [...INITIAL_HOLDINGS];
  private static cashBalance: number = INITIAL_PORTFOLIO_SUMMARY.cashBalance;

  public async getSummary(): Promise<PortfolioSummary> {
    const invested = MockPortfolioService.holdings.reduce((sum, h) => sum + h.investedValue, 0);
    const current = MockPortfolioService.holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalValue = current + MockPortfolioService.cashBalance;
    const todayPnL = MockPortfolioService.holdings.reduce((sum, h) => sum + h.todayPnL, 0);
    const totalPnL = current - invested;
    const totalPnLPercent = invested > 0 ? (totalPnL / invested) * 100 : 0;
    const todayPnLPercent = totalValue > 0 ? (todayPnL / totalValue) * 100 : 0;

    return {
      totalValue: 842560.00,
      cashBalance: MockPortfolioService.cashBalance,
      investedValue: 730110.00,
      todayPnL: 12430.00,
      todayPnLPercent: 1.50,
      totalPnL: 130950.00,
      totalPnLPercent: 18.42,
      sharpeRatio: 1.24,
      sortinoRatio: 1.68,
      maxDrawdown: -12.8,
      volatility: 18.4,
      beta: 0.94,
      var95: -17690.00,
    };
  }

  public async getHoldings(): Promise<Holding[]> {
    return [...MockPortfolioService.holdings];
  }

  public async getSectorAllocation(): Promise<{ sector: string; value: number; percentage: number; color: string }[]> {
    const sectors: Record<string, { value: number; color: string }> = {};
    const colors: Record<string, string> = {
      Technology: '#38bdf8',
      Financials: '#6798ff',
      Energy: '#818cf8',
      Automobile: '#f59e0b',
      Telecom: '#10b981',
      'Consumer Goods': '#ec4899',
    };

    let total = 0;
    for (const h of MockPortfolioService.holdings) {
      if (!sectors[h.sector]) {
        sectors[h.sector] = { value: 0, color: colors[h.sector] || '#94a3b8' };
      }
      sectors[h.sector].value += h.currentValue;
      total += h.currentValue;
    }

    return Object.entries(sectors).map(([sector, data]) => ({
      sector,
      value: data.value,
      percentage: Math.round((data.value / (total || 1)) * 1000) / 10,
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
    const totalCost = order.quantity * order.price;

    if (order.side === 'BUY') {
      if (totalCost > MockPortfolioService.cashBalance) {
        return {
          success: false,
          message: `Insufficient cash balance. Available: ₹${MockPortfolioService.cashBalance.toFixed(2)}, Required: ₹${totalCost.toFixed(2)}`,
        };
      }

      MockPortfolioService.cashBalance -= totalCost;
      const existing = MockPortfolioService.holdings.find(h => h.symbol === order.symbol);
      if (existing) {
        const newQty = existing.quantity + order.quantity;
        const newInvested = existing.investedValue + totalCost;
        existing.quantity = newQty;
        existing.averagePrice = Math.round((newInvested / newQty) * 100) / 100;
        existing.investedValue = newInvested;
        existing.currentValue = newQty * existing.currentPrice;
        
        const calc = calculatePnL(existing.quantity, existing.averagePrice, existing.currentPrice);
        existing.unrealizedPnL = calc.pnl;
        existing.unrealizedPnLPercent = calc.pnlPercent;
      } else {
        MockPortfolioService.holdings.push({
          symbol: order.symbol,
          companyName: order.companyName,
          sector: 'Equities',
          quantity: order.quantity,
          averagePrice: order.price,
          currentPrice: order.price,
          investedValue: totalCost,
          currentValue: totalCost,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
          todayPnL: 0,
          portfolioWeight: 5.0,
          allocationColor: '#6798ff',
        });
      }
    } else {
      // SELL
      const existing = MockPortfolioService.holdings.find(h => h.symbol === order.symbol);
      if (!existing || existing.quantity < order.quantity) {
        return {
          success: false,
          message: `Insufficient shares to sell. Available: ${existing ? existing.quantity : 0} shares.`,
        };
      }

      MockPortfolioService.cashBalance += totalCost;
      if (existing.quantity === order.quantity) {
        MockPortfolioService.holdings = MockPortfolioService.holdings.filter(h => h.symbol !== order.symbol);
      } else {
        existing.quantity -= order.quantity;
        existing.investedValue = existing.quantity * existing.averagePrice;
        existing.currentValue = existing.quantity * existing.currentPrice;
        
        const calc = calculatePnL(existing.quantity, existing.averagePrice, existing.currentPrice);
        existing.unrealizedPnL = calc.pnl;
        existing.unrealizedPnLPercent = calc.pnlPercent;
      }
    }

    const tx: Transaction = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      symbol: order.symbol,
      companyName: order.companyName,
      side: order.side,
      orderType: order.orderType,
      quantity: order.quantity,
      price: order.price,
      totalValue: totalCost,
      status: 'EXECUTED',
    };

    TransactionService.addTransaction(tx);

    return {
      success: true,
      message: `Paper order executed: ${order.side} ${order.quantity} ${order.symbol} @ ₹${order.price.toFixed(2)}`,
      transaction: tx,
    };
  }

  // Static backward-compatible methods
  public static async getSummary(): Promise<PortfolioSummary> {
    return new MockPortfolioService().getSummary();
  }

  public static async getHoldings(): Promise<Holding[]> {
    return new MockPortfolioService().getHoldings();
  }

  public static async getSectorAllocation(): Promise<{ sector: string; value: number; percentage: number; color: string }[]> {
    return new MockPortfolioService().getSectorAllocation();
  }

  public static async executePaperTrade(order: Parameters<IPortfolioService['executePaperTrade']>[0]): Promise<ReturnType<IPortfolioService['executePaperTrade']>> {
    return new MockPortfolioService().executePaperTrade(order);
  }
}

export const PortfolioService = MockPortfolioService;
