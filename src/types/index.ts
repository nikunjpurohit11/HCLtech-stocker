export type TimeFrame = '1D' | '1W' | '1M' | '6M' | '1Y' | '3Y' | '5Y';

export type SignalType = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export type OrderType = 'MARKET' | 'LIMIT';

export type OrderSide = 'BUY' | 'SELL';

export type TrendRegime = 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS';

export interface HistoricalBar {
  date: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  sma200?: number;
  bbUpper?: number;
  bbLower?: number;
  bbMiddle?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHist?: number;
}

export interface StockPrice {
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  timestamp: number;
}

export interface StockQuote {
  symbol: string;
  companyName: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  avgVolume: number;
  marketCap: number; // in Crores
  peRatio: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  rsi: number;
  volatility: number; // percentage
  trend: TrendRegime;
  signal: SignalType;
  signalConfidence: number; // 0-100
  sparkline: number[];
}

/**
 * Standard Stock alias matching domain terminology
 */
export type Stock = StockQuote;

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  sparkline: number[];
}

export interface MarketSummary {
  indices: MarketIndex[];
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  mostActive: StockQuote[];
  marketStatus: 'OPEN' | 'CLOSED' | 'PRE_MARKET';
  advanceDeclineRatio: number;
  updatedAt: string;
}

export interface Holding {
  symbol: string;
  companyName: string;
  sector: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  todayPnL: number;
  portfolioWeight: number; // percentage
  allocationColor: string;
}

export interface PortfolioSummary {
  totalValue: number;
  cashBalance: number;
  investedValue: number;
  todayPnL: number;
  todayPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  volatility: number;
  beta: number;
  var95: number; // Value at Risk 95%
}

export interface Portfolio {
  id: string;
  name: string;
  summary: PortfolioSummary;
  holdings: Holding[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  symbol: string;
  companyName: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price: number;
  totalValue: number;
  realizedPnL?: number;
  status: 'EXECUTED' | 'PENDING' | 'CANCELLED';
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  companyName: string;
  addedAt: string;
  notes?: string;
  targetPrice?: number;
  alertHigh?: number;
  alertLow?: number;
}

export interface RiskMetrics {
  annualReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  beta: number;
  maxDrawdown: number;
  var95Percent: number;
  var95Amount: number;
  stressLoss: number;
  cagr: number;
}

export interface MLPrediction {
  symbol: string;
  modelName: string;
  modelType: string;
  predictedDirection: SignalType;
  probability: number;
  predictionHorizon: string;
  predictionDate: string;
  featureImportance: {
    feature: string;
    importance: number;
    description: string;
  }[];
  modelPerformance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    testPeriod: string;
  };
}

export type MLSignal = MLPrediction;

export interface StrategyParams {
  id: string;
  name: string;
  description: string;
  type: 'MA_CROSSOVER' | 'RSI' | 'BOLLINGER' | 'ML_MOMENTUM';
  parameters: Record<string, number | string>;
}

export interface BacktestResult {
  initialCapital: number;
  finalValue: number;
  totalReturn: number;
  cagr: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  equityCurve: { date: string; strategy: number; benchmark: number }[];
  drawdownCurve: { date: string; drawdown: number }[];
}

export type StrategyResult = BacktestResult;

export interface CorrelationRow {
  symbol: string;
  correlations: Record<string, number>;
}
