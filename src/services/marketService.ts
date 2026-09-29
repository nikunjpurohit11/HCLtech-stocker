import { StockQuote, MarketIndex, HistoricalBar, TimeFrame } from '../types';
import { MOCK_STOCKS, MOCK_INDICES } from '../data';
import { calculateSMA, calculateBollingerBands, calculateRSI } from '../utils/financialCalculations';
import { IMarketService } from './interfaces';

/**
 * Deterministically generates realistic historical candle bars with indicators
 * (SMA20, SMA50, SMA200, Bollinger Bands, RSI, MACD).
 */
export function generateHistoricalBars(
  basePrice: number,
  timeframe: TimeFrame,
  volatilityPct: number = 18
): HistoricalBar[] {
  let count = 60;
  let intervalDays = 1;
  if (timeframe === '1D') {
    count = 45; // 5-minute bars
  } else if (timeframe === '1W') {
    count = 35;
  } else if (timeframe === '1M') {
    count = 30;
  } else if (timeframe === '6M') {
    count = 60;
    intervalDays = 3;
  } else if (timeframe === '1Y') {
    count = 90;
    intervalDays = 4;
  } else if (timeframe === '3Y' || timeframe === '5Y') {
    count = 100;
    intervalDays = 15;
  }

  const bars: HistoricalBar[] = [];
  const now = Date.now();
  const stepMs = (timeframe === '1D' ? 5 * 60 * 1000 : intervalDays * 24 * 60 * 60 * 1000);
  const startTime = now - count * stepMs;

  let currentPrice = basePrice * (timeframe === '1D' ? 0.99 : 0.88);
  const dailyVol = (volatilityPct / 100) / Math.sqrt(252);

  const prices: number[] = [];

  for (let i = 0; i < count; i++) {
    const timestamp = startTime + i * stepMs;
    const dateObj = new Date(timestamp);
    const dateStr = timeframe === '1D' 
      ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: timeframe === '5Y' ? 'numeric' : undefined });

    const wave = Math.sin(i * 0.18) * (basePrice * 0.015);
    const noise = Math.cos(i * 0.45 + 1.2) * (basePrice * dailyVol * 1.5);
    const drift = (i / count) * (basePrice - currentPrice);

    const open = Math.round((currentPrice + wave * 0.3) * 100) / 100;
    const delta = (noise + drift * 0.05);
    const close = Math.round((open + delta) * 100) / 100;
    const high = Math.round((Math.max(open, close) + Math.abs(noise * 0.6) + basePrice * 0.003) * 100) / 100;
    const low = Math.round((Math.min(open, close) - Math.abs(noise * 0.5) - basePrice * 0.003) * 100) / 100;
    const volume = Math.floor(100000 + Math.abs(Math.sin(i * 0.3)) * 450000);

    currentPrice = close;
    prices.push(close);

    bars.push({
      date: dateStr,
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  // Ensure last bar close matches the basePrice exactly
  if (bars.length > 0) {
    bars[bars.length - 1].close = basePrice;
    bars[bars.length - 1].high = Math.max(bars[bars.length - 1].high, basePrice);
    bars[bars.length - 1].low = Math.min(bars[bars.length - 1].low, basePrice);
    prices[prices.length - 1] = basePrice;
  }

  // Compute Technical Indicators using centralized financial utilities
  const sma20Values = calculateSMA(prices, 20);
  const sma50Values = calculateSMA(prices, 50);
  const bb = calculateBollingerBands(prices, 20, 2.0);
  const rsiValues = calculateRSI(prices, 14);

  for (let i = 0; i < bars.length; i++) {
    bars[i].sma20 = sma20Values[i];
    bars[i].bbUpper = bb.upper[i];
    bars[i].bbLower = bb.lower[i];
    bars[i].bbMiddle = bb.middle[i];
    bars[i].sma50 = sma50Values[i] || bars[i].close;
    bars[i].sma200 = Math.round((basePrice * 0.94 + Math.sin(i * 0.05) * (basePrice * 0.02)) * 100) / 100;
    bars[i].rsi = rsiValues[i];

    // MACD (12, 26, 9)
    const ema12 = bars[i].close * 0.15 + (bars[i - 1]?.close || bars[i].close) * 0.85;
    const ema26 = bars[i].close * 0.07 + (bars[i - 1]?.close || bars[i].close) * 0.93;
    const macdLine = Math.round((ema12 - ema26) * 100) / 100;
    const signalLine = Math.round((macdLine * 0.2 + ((bars[i - 1]?.macdSignal || 0) * 0.8)) * 100) / 100;
    bars[i].macd = macdLine;
    bars[i].macdSignal = signalLine;
    bars[i].macdHist = Math.round((macdLine - signalLine) * 100) / 100;
  }

  return bars;
}

export class MockMarketService implements IMarketService {
  private static stocks: StockQuote[] = [...MOCK_STOCKS];
  private static indices: MarketIndex[] = [...MOCK_INDICES];

  public async getIndices(): Promise<MarketIndex[]> {
    return MockMarketService.indices;
  }

  public async getStocks(filters?: {
    search?: string;
    sector?: string;
    signal?: string;
    sortKey?: keyof StockQuote;
    sortOrder?: 'asc' | 'desc';
  }): Promise<StockQuote[]> {
    let result = [...MockMarketService.stocks];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        s => s.symbol.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q)
      );
    }

    if (filters?.sector && filters.sector !== 'ALL') {
      result = result.filter(s => s.sector.toLowerCase().includes(filters.sector!.toLowerCase()));
    }

    if (filters?.signal && filters.signal !== 'ALL') {
      result = result.filter(s => s.signal === filters.signal);
    }

    if (filters?.sortKey) {
      const key = filters.sortKey;
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * order;
        }
        return String(valA).localeCompare(String(valB)) * order;
      });
    }

    return result;
  }

  public async getStockBySymbol(symbol: string): Promise<StockQuote | null> {
    const found = MockMarketService.stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    return found || null;
  }

  public async getHistoricalBars(
    symbol: string,
    timeframe: TimeFrame = '1Y'
  ): Promise<HistoricalBar[]> {
    const stock = await this.getStockBySymbol(symbol);
    const basePrice = stock ? stock.price : 2500;
    const vol = stock ? stock.volatility : 18;
    return generateHistoricalBars(basePrice, timeframe, vol);
  }

  // Static backward compatibility helpers
  public static async getIndices(): Promise<MarketIndex[]> {
    return new MockMarketService().getIndices();
  }

  public static async getStocks(filters?: Parameters<IMarketService['getStocks']>[0]): Promise<StockQuote[]> {
    return new MockMarketService().getStocks(filters);
  }

  public static async getStockBySymbol(symbol: string): Promise<StockQuote | null> {
    return new MockMarketService().getStockBySymbol(symbol);
  }

  public static async getHistoricalBars(symbol: string, timeframe?: TimeFrame): Promise<HistoricalBar[]> {
    return new MockMarketService().getHistoricalBars(symbol, timeframe);
  }
}

export const MarketService = MockMarketService;
