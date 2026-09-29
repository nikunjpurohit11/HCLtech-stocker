import { StockQuote, MarketIndex, HistoricalBar, TimeFrame } from '../types';

export const MARKET_INDICES: MarketIndex[] = [
  {
    symbol: 'NIFTY 50',
    name: 'NSE Nifty 50 Index',
    value: 25482.50,
    change: 142.30,
    changePercent: 0.56,
    high: 25520.10,
    low: 25390.40,
    sparkline: [25390, 25410, 25405, 25435, 25420, 25460, 25450, 25475, 25465, 25482.5],
  },
  {
    symbol: 'NIFTY BANK',
    name: 'Nifty Bank Index',
    value: 53195.40,
    change: 312.15,
    changePercent: 0.59,
    high: 53260.00,
    low: 52940.80,
    sparkline: [52940, 52990, 53020, 53010, 53110, 53090, 53150, 53140, 53180, 53195.4],
  },
  {
    symbol: 'NIFTY IT',
    name: 'Nifty IT Index',
    value: 41890.20,
    change: -110.80,
    changePercent: -0.26,
    high: 42080.50,
    low: 41820.00,
    sparkline: [42050, 42020, 41980, 41920, 41940, 41880, 41910, 41850, 41870, 41890.2],
  },
  {
    symbol: 'NIFTY NEXT 50',
    name: 'Nifty Next 50 Index',
    value: 72410.80,
    change: 495.20,
    changePercent: 0.69,
    high: 72480.00,
    low: 71980.20,
    sparkline: [71980, 72050, 72120, 72100, 72240, 72280, 72350, 72310, 72390, 72410.8],
  },
];

export const INITIAL_STOCKS: StockQuote[] = [
  {
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd.',
    sector: 'Energy & Conglomerate',
    price: 2984.45,
    change: 38.60,
    changePercent: 1.31,
    open: 2950.00,
    high: 2995.00,
    low: 2942.10,
    previousClose: 2945.85,
    volume: 8420000,
    avgVolume: 7900000,
    marketCap: 2018500, // Crores
    peRatio: 28.4,
    beta: 1.05,
    fiftyTwoWeekHigh: 3024.90,
    fiftyTwoWeekLow: 2220.30,
    rsi: 63.8,
    volatility: 16.2,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 82,
    sparkline: [2920, 2935, 2930, 2950, 2945, 2965, 2960, 2975, 2970, 2984.45],
  },
  {
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services Ltd.',
    sector: 'Information Technology',
    price: 4215.30,
    change: -22.40,
    changePercent: -0.53,
    open: 4240.00,
    high: 4255.00,
    low: 4202.10,
    previousClose: 4237.70,
    volume: 2150000,
    avgVolume: 2400000,
    marketCap: 1524300,
    peRatio: 31.8,
    beta: 0.78,
    fiftyTwoWeekHigh: 4585.00,
    fiftyTwoWeekLow: 3313.00,
    rsi: 48.2,
    volatility: 14.5,
    trend: 'SIDEWAYS',
    signal: 'NEUTRAL',
    signalConfidence: 58,
    sparkline: [4260, 4250, 4245, 4255, 4230, 4235, 4220, 4225, 4210, 4215.3],
  },
  {
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd.',
    sector: 'Financial Services',
    price: 1668.75,
    change: 14.20,
    changePercent: 0.86,
    open: 1658.00,
    high: 1674.50,
    low: 1652.30,
    previousClose: 1654.55,
    volume: 14200000,
    avgVolume: 16500000,
    marketCap: 1268400,
    peRatio: 18.9,
    beta: 1.12,
    fiftyTwoWeekHigh: 1794.00,
    fiftyTwoWeekLow: 1363.55,
    rsi: 59.4,
    volatility: 17.8,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 76,
    sparkline: [1645, 1650, 1648, 1655, 1658, 1662, 1660, 1665, 1664, 1668.75],
  },
  {
    symbol: 'INFY',
    companyName: 'Infosys Ltd.',
    sector: 'Information Technology',
    price: 1912.60,
    change: -11.35,
    changePercent: -0.59,
    open: 1928.00,
    high: 1934.00,
    low: 1904.50,
    previousClose: 1923.95,
    volume: 6800000,
    avgVolume: 7100000,
    marketCap: 793500,
    peRatio: 29.5,
    beta: 0.88,
    fiftyTwoWeekHigh: 1991.45,
    fiftyTwoWeekLow: 1358.35,
    rsi: 52.1,
    volatility: 19.1,
    trend: 'SIDEWAYS',
    signal: 'NEUTRAL',
    signalConfidence: 61,
    sparkline: [1935, 1930, 1928, 1932, 1920, 1925, 1915, 1920, 1910, 1912.6],
  },
  {
    symbol: 'ICICIBANK',
    companyName: 'ICICI Bank Ltd.',
    sector: 'Financial Services',
    price: 1245.90,
    change: 18.45,
    changePercent: 1.50,
    open: 1230.00,
    high: 1251.00,
    low: 1228.00,
    previousClose: 1227.45,
    volume: 9900000,
    avgVolume: 11200000,
    marketCap: 876900,
    peRatio: 17.6,
    beta: 1.08,
    fiftyTwoWeekHigh: 1257.80,
    fiftyTwoWeekLow: 913.80,
    rsi: 68.2,
    volatility: 16.9,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 88,
    sparkline: [1215, 1222, 1225, 1230, 1232, 1238, 1240, 1244, 1242, 1245.9],
  },
  {
    symbol: 'BHARTIARTL',
    companyName: 'Bharti Airtel Ltd.',
    sector: 'Telecommunications',
    price: 1548.20,
    change: 22.80,
    changePercent: 1.49,
    open: 1528.00,
    high: 1555.00,
    low: 1525.10,
    previousClose: 1525.40,
    volume: 4800000,
    avgVolume: 5300000,
    marketCap: 914000,
    peRatio: 64.2,
    beta: 0.72,
    fiftyTwoWeekHigh: 1582.00,
    fiftyTwoWeekLow: 902.00,
    rsi: 64.7,
    volatility: 15.3,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 79,
    sparkline: [1510, 1520, 1518, 1528, 1530, 1535, 1540, 1542, 1545, 1548.2],
  },
  {
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd.',
    sector: 'Automobile',
    price: 978.10,
    change: -14.60,
    changePercent: -1.47,
    open: 994.00,
    high: 998.00,
    low: 972.40,
    previousClose: 992.70,
    volume: 12400000,
    avgVolume: 10800000,
    marketCap: 358400,
    peRatio: 10.4,
    beta: 1.34,
    fiftyTwoWeekHigh: 1179.05,
    fiftyTwoWeekLow: 605.00,
    rsi: 38.6,
    volatility: 26.4,
    trend: 'DOWNTREND',
    signal: 'BEARISH',
    signalConfidence: 71,
    sparkline: [1005, 998, 995, 992, 988, 985, 982, 980, 975, 978.1],
  },
  {
    symbol: 'ITC',
    companyName: 'ITC Limited',
    sector: 'Consumer Goods',
    price: 512.40,
    change: 4.10,
    changePercent: 0.81,
    open: 509.00,
    high: 514.80,
    low: 507.20,
    previousClose: 508.30,
    volume: 16800000,
    avgVolume: 14200000,
    marketCap: 641200,
    peRatio: 30.1,
    beta: 0.54,
    fiftyTwoWeekHigh: 524.00,
    fiftyTwoWeekLow: 399.30,
    rsi: 58.3,
    volatility: 12.1,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 69,
    sparkline: [502, 505, 506, 508, 509, 510, 511, 510, 511, 512.4],
  },
  {
    symbol: 'SUNPHARMA',
    companyName: 'Sun Pharmaceutical Industries',
    sector: 'Healthcare & Pharma',
    price: 1894.50,
    change: 8.90,
    changePercent: 0.47,
    open: 1888.00,
    high: 1905.00,
    low: 1882.00,
    previousClose: 1885.60,
    volume: 1900000,
    avgVolume: 2200000,
    marketCap: 454500,
    peRatio: 39.4,
    beta: 0.65,
    fiftyTwoWeekHigh: 1940.00,
    fiftyTwoWeekLow: 1110.00,
    rsi: 61.2,
    volatility: 14.8,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 74,
    sparkline: [1865, 1870, 1875, 1880, 1885, 1888, 1892, 1890, 1892, 1894.5],
  },
  {
    symbol: 'LT',
    companyName: 'Larsen & Toubro Ltd.',
    sector: 'Capital Goods & Infrastructure',
    price: 3640.00,
    change: 42.50,
    changePercent: 1.18,
    open: 3605.00,
    high: 3655.00,
    low: 3598.00,
    previousClose: 3597.50,
    volume: 2800000,
    avgVolume: 2500000,
    marketCap: 500200,
    peRatio: 36.2,
    beta: 1.15,
    fiftyTwoWeekHigh: 3919.90,
    fiftyTwoWeekLow: 2872.00,
    rsi: 56.4,
    volatility: 18.2,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 72,
    sparkline: [3560, 3580, 3575, 3595, 3605, 3615, 3620, 3630, 3635, 3640],
  },
  {
    symbol: 'KOTAKBANK',
    companyName: 'Kotak Mahindra Bank Ltd.',
    sector: 'Financial Services',
    price: 1845.20,
    change: -6.80,
    changePercent: -0.37,
    open: 1855.00,
    high: 1862.00,
    low: 1838.00,
    previousClose: 1852.00,
    volume: 3400000,
    avgVolume: 3800000,
    marketCap: 367100,
    peRatio: 22.3,
    beta: 0.95,
    fiftyTwoWeekHigh: 1932.00,
    fiftyTwoWeekLow: 1544.15,
    rsi: 49.5,
    volatility: 17.1,
    trend: 'SIDEWAYS',
    signal: 'NEUTRAL',
    signalConfidence: 55,
    sparkline: [1860, 1855, 1858, 1852, 1848, 1850, 1845, 1848, 1842, 1845.2],
  },
  {
    symbol: 'BAJFINANCE',
    companyName: 'Bajaj Finance Ltd.',
    sector: 'Financial Services',
    price: 7380.00,
    change: 112.00,
    changePercent: 1.54,
    open: 7280.00,
    high: 7410.00,
    low: 7265.00,
    previousClose: 7268.00,
    volume: 1100000,
    avgVolume: 1250000,
    marketCap: 456800,
    peRatio: 32.7,
    beta: 1.28,
    fiftyTwoWeekHigh: 8192.00,
    fiftyTwoWeekLow: 6160.00,
    rsi: 62.9,
    volatility: 22.5,
    trend: 'UPTREND',
    signal: 'BULLISH',
    signalConfidence: 81,
    sparkline: [7210, 7240, 7255, 7270, 7290, 7320, 7340, 7360, 7370, 7380],
  },
];

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

  // Pseudo-random deterministic walk
  const prices: number[] = [];

  for (let i = 0; i < count; i++) {
    const timestamp = startTime + i * stepMs;
    const dateObj = new Date(timestamp);
    const dateStr = timeframe === '1D' 
      ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: timeframe === '5Y' ? 'numeric' : undefined });

    // Deterministic sine wave + pseudo noise
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
  }

  // Compute Technical Indicators
  for (let i = 0; i < bars.length; i++) {
    // SMA 20
    if (i >= 19) {
      const slice20 = prices.slice(i - 19, i + 1);
      const mean20 = slice20.reduce((a, b) => a + b, 0) / 20;
      bars[i].sma20 = Math.round(mean20 * 100) / 100;

      // Bollinger Bands (20, 2 std dev)
      const variance = slice20.reduce((acc, p) => acc + Math.pow(p - mean20, 2), 0) / 20;
      const stdDev = Math.sqrt(variance);
      bars[i].bbUpper = Math.round((mean20 + 2 * stdDev) * 100) / 100;
      bars[i].bbLower = Math.round((mean20 - 2 * stdDev) * 100) / 100;
      bars[i].bbMiddle = bars[i].sma20;
    } else {
      bars[i].sma20 = bars[i].close;
      bars[i].bbUpper = bars[i].close * 1.02;
      bars[i].bbLower = bars[i].close * 0.98;
      bars[i].bbMiddle = bars[i].close;
    }

    // SMA 50
    if (i >= 49) {
      const slice50 = prices.slice(i - 49, i + 1);
      bars[i].sma50 = Math.round((slice50.reduce((a, b) => a + b, 0) / 50) * 100) / 100;
    } else {
      bars[i].sma50 = Math.round((prices.slice(0, i + 1).reduce((a, b) => a + b, 0) / (i + 1)) * 100) / 100;
    }

    // SMA 200 (approximated for shorter spans)
    bars[i].sma200 = Math.round((basePrice * 0.94 + Math.sin(i * 0.05) * (basePrice * 0.02)) * 100) / 100;

    // RSI (14 period)
    if (i >= 14) {
      let gains = 0;
      let losses = 0;
      for (let j = i - 13; j <= i; j++) {
        const diff = prices[j] - prices[j - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const avgGain = gains / 14;
      const avgLoss = losses / 14 === 0 ? 0.001 : losses / 14;
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      bars[i].rsi = Math.round(rsi * 10) / 10;
    } else {
      bars[i].rsi = 54.5;
    }

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

export class MarketService {
  private static stocks: StockQuote[] = [...INITIAL_STOCKS];

  public static async getIndices(): Promise<MarketIndex[]> {
    return MARKET_INDICES;
  }

  public static async getStocks(filters?: {
    search?: string;
    sector?: string;
    signal?: string;
    sortKey?: keyof StockQuote;
    sortOrder?: 'asc' | 'desc';
  }): Promise<StockQuote[]> {
    let result = [...this.stocks];

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

  public static async getStockBySymbol(symbol: string): Promise<StockQuote | null> {
    const found = this.stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    return found || null;
  }

  public static async getHistoricalBars(
    symbol: string,
    timeframe: TimeFrame = '1Y'
  ): Promise<HistoricalBar[]> {
    const stock = await this.getStockBySymbol(symbol);
    const basePrice = stock ? stock.price : 2500;
    const vol = stock ? stock.volatility : 18;
    return generateHistoricalBars(basePrice, timeframe, vol);
  }
}
