/**
 * Institutional Financial and Quantitative Calculation Utilities
 */

/**
 * Calculates unrealized or realized profit and loss
 */
export function calculatePnL(quantity: number, averagePrice: number, currentPrice: number): {
  pnl: number;
  pnlPercent: number;
  investedValue: number;
  currentValue: number;
} {
  const investedValue = quantity * averagePrice;
  const currentValue = quantity * currentPrice;
  const pnl = currentValue - investedValue;
  const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0;

  return {
    pnl: Math.round(pnl * 100) / 100,
    pnlPercent: Math.round(pnlPercent * 100) / 100,
    investedValue: Math.round(investedValue * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
  };
}

/**
 * Calculates Simple Moving Average for a series of numbers
 */
export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(data[i]);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const sum = slice.reduce((a, b) => a + b, 0);
      result.push(Math.round((sum / period) * 100) / 100);
    }
  }
  return result;
}

/**
 * Calculates Exponential Moving Average
 */
export function calculateEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [];

  let ema = data[0] || 0;
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(ema);
    } else {
      ema = data[i] * k + ema * (1 - k);
      result.push(Math.round(ema * 100) / 100);
    }
  }
  return result;
}

/**
 * Calculates Relative Strength Index (RSI, default 14 periods)
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsis: number[] = [];
  if (prices.length < 2) return prices.map(() => 50);

  const changes: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsis.push(50.0);
    } else {
      const recentChanges = changes.slice(i - period, i);
      let gain = 0;
      let loss = 0;

      for (const chg of recentChanges) {
        if (chg >= 0) gain += chg;
        else loss += Math.abs(chg);
      }

      const avgGain = gain / period;
      const avgLoss = loss / period === 0 ? 0.0001 : loss / period;
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      rsis.push(Math.round(rsi * 10) / 10);
    }
  }

  return rsis;
}

/**
 * Calculates Bollinger Bands (Upper, Middle, Lower)
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  stdDevMultiplier: number = 2.0
): { upper: number[]; middle: number[]; lower: number[] } {
  const middle = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(prices[i] * 1.02);
      lower.push(prices[i] * 0.98);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = middle[i];
      const variance = slice.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);

      upper.push(Math.round((mean + stdDevMultiplier * stdDev) * 100) / 100);
      lower.push(Math.round((mean - stdDevMultiplier * stdDev) * 100) / 100);
    }
  }

  return { upper, middle, lower };
}

/**
 * Calculates maximum peak-to-trough drawdown from an equity or price series
 */
export function calculateMaxDrawdown(series: number[]): { maxDrawdown: number; peakIndex: number; troughIndex: number } {
  let peak = -Infinity;
  let peakIdx = 0;
  let maxDD = 0;
  let troughIdx = 0;

  for (let i = 0; i < series.length; i++) {
    if (series[i] > peak) {
      peak = series[i];
      peakIdx = i;
    }
    const dd = peak > 0 ? ((series[i] - peak) / peak) * 100 : 0;
    if (dd < maxDD) {
      maxDD = dd;
      troughIdx = i;
    }
  }

  return {
    maxDrawdown: Math.round(maxDD * 100) / 100,
    peakIndex: peakIdx,
    troughIndex: troughIdx,
  };
}

/**
 * Calculates Sharpe ratio given annual return, risk free rate, and volatility
 */
export function calculateSharpeRatio(
  annualReturnPct: number,
  volatilityPct: number,
  riskFreeRatePct: number = 6.80
): number {
  if (volatilityPct <= 0) return 0;
  const sharpe = (annualReturnPct - riskFreeRatePct) / volatilityPct;
  return Math.round(sharpe * 100) / 100;
}

/**
 * Calculates Sortino ratio focusing on downside standard deviation
 */
export function calculateSortinoRatio(
  annualReturnPct: number,
  downsideVolPct: number,
  riskFreeRatePct: number = 6.80
): number {
  if (downsideVolPct <= 0) return 0;
  const sortino = (annualReturnPct - riskFreeRatePct) / downsideVolPct;
  return Math.round(sortino * 100) / 100;
}

/**
 * Calculates parametric Value at Risk (VaR)
 * Default: 95% confidence level (Z = 1.645)
 */
export function calculateVaR(
  portfolioValue: number,
  dailyVolatilityPct: number,
  confidenceLevel: 0.95 | 0.99 = 0.95
): { varAmount: number; varPercent: number } {
  const zScore = confidenceLevel === 0.99 ? 2.326 : 1.645;
  const varPercent = zScore * dailyVolatilityPct;
  const varAmount = (varPercent / 100) * portfolioValue;

  return {
    varAmount: Math.round(varAmount * 100) / 100,
    varPercent: Math.round(varPercent * 100) / 100,
  };
}
