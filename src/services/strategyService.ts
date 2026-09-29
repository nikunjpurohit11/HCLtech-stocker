import { BacktestResult } from '../types';
import { IStrategyService } from './interfaces';

export interface StrategyRunOptions {
  strategyType: 'MA_CROSSOVER' | 'RSI' | 'BOLLINGER' | 'ML_MOMENTUM';
  symbol: string;
  initialCapital: number;
  parameters: Record<string, number | string>;
}

export class MockStrategyService implements IStrategyService {
  public async runBacktest(options: StrategyRunOptions): Promise<BacktestResult> {
    const { initialCapital, strategyType } = options;

    let totalReturnPct = 24.6;
    let winRate = 62.5;
    let totalTrades = 48;
    let winningTrades = 30;
    let losingTrades = 18;
    let sharpe = 1.45;
    let maxDrawdown = -9.4;
    let vol = 15.8;

    if (strategyType === 'MA_CROSSOVER') {
      totalReturnPct = 21.8;
      winRate = 58.0;
      totalTrades = 38;
      winningTrades = 22;
      losingTrades = 16;
      sharpe = 1.32;
      maxDrawdown = -11.2;
      vol = 16.4;
    } else if (strategyType === 'RSI') {
      totalReturnPct = 19.4;
      winRate = 66.7;
      totalTrades = 54;
      winningTrades = 36;
      losingTrades = 18;
      sharpe = 1.51;
      maxDrawdown = -8.1;
      vol = 13.9;
    } else if (strategyType === 'BOLLINGER') {
      totalReturnPct = 22.4;
      winRate = 61.2;
      totalTrades = 42;
      winningTrades = 26;
      losingTrades = 16;
      sharpe = 1.38;
      maxDrawdown = -10.5;
      vol = 15.2;
    } else if (strategyType === 'ML_MOMENTUM') {
      totalReturnPct = 28.9;
      winRate = 68.4;
      totalTrades = 57;
      winningTrades = 39;
      losingTrades = 18;
      sharpe = 1.76;
      maxDrawdown = -7.6;
      vol = 14.1;
    }

    const finalValue = Math.round(initialCapital * (1 + totalReturnPct / 100));
    const cagr = Math.round((Math.pow(finalValue / initialCapital, 1 / 2) - 1) * 1000) / 10;

    // Generate monthly equity curve for 18 months
    const equityCurve: { date: string; strategy: number; benchmark: number }[] = [];
    const drawdownCurve: { date: string; drawdown: number }[] = [];
    const months = [
      'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25',
      'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26',
      'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'
    ];

    let stratVal = initialCapital;
    let benchVal = initialCapital;
    let peakStrat = stratVal;

    months.forEach((month, idx) => {
      const stratStep = (totalReturnPct / months.length) * (0.6 + Math.sin(idx * 0.7) * 0.5 + 0.3);
      const benchStep = 0.9 + Math.cos(idx * 0.6) * 1.8;

      stratVal = Math.round(stratVal * (1 + stratStep / 100));
      benchVal = Math.round(benchVal * (1 + benchStep / 100));

      if (stratVal > peakStrat) peakStrat = stratVal;
      const dd = Math.round(((stratVal - peakStrat) / peakStrat) * 1000) / 10;

      equityCurve.push({ date: month, strategy: stratVal, benchmark: benchVal });
      drawdownCurve.push({ date: month, drawdown: dd });
    });

    return {
      initialCapital,
      finalValue,
      totalReturn: totalReturnPct,
      cagr,
      volatility: vol,
      sharpeRatio: sharpe,
      maxDrawdown,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      profitFactor: 2.14,
      equityCurve,
      drawdownCurve,
    };
  }

  // Static convenience wrapper
  public static async runBacktest(options: StrategyRunOptions): Promise<BacktestResult> {
    return new MockStrategyService().runBacktest(options);
  }
}

export const StrategyService = MockStrategyService;
