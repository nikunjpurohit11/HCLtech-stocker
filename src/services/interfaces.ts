import {
  StockQuote,
  MarketIndex,
  HistoricalBar,
  TimeFrame,
  PortfolioSummary,
  Holding,
  Transaction,
  OrderSide,
  OrderType,
  RiskMetrics,
  CorrelationRow,
  MLPrediction,
  BacktestResult,
  StrategyParams,
} from '../types';

export interface IMarketService {
  getIndices(): Promise<MarketIndex[]>;
  getStocks(filters?: {
    search?: string;
    sector?: string;
    signal?: string;
    sortKey?: keyof StockQuote;
    sortOrder?: 'asc' | 'desc';
  }): Promise<StockQuote[]>;
  getStockBySymbol(symbol: string): Promise<StockQuote | null>;
  getHistoricalBars(symbol: string, timeframe?: TimeFrame): Promise<HistoricalBar[]>;
}

export interface IPortfolioService {
  getSummary(): Promise<PortfolioSummary>;
  getHoldings(): Promise<Holding[]>;
  getSectorAllocation(): Promise<{ sector: string; value: number; percentage: number; color: string }[]>;
  executePaperTrade(order: {
    symbol: string;
    companyName: string;
    side: OrderSide;
    orderType: OrderType;
    quantity: number;
    price: number;
  }): Promise<{ success: boolean; message: string; transaction?: Transaction }>;
}

export interface ITransactionService {
  getTransactions(limit?: number): Promise<Transaction[]>;
  addTransaction(tx: Transaction): void;
}

export interface IAnalyticsService {
  getRiskMetrics(): Promise<RiskMetrics>;
  getCorrelationMatrix(): Promise<CorrelationRow[]>;
  getDrawdownSeries(): Promise<{ date: string; drawdown: number }[]>;
  getRiskContribution(): Promise<{ symbol: string; riskPct: number; allocationPct: number }[]>;
}

export interface IStrategyService {
  runBacktest(options: {
    strategyType: 'MA_CROSSOVER' | 'RSI' | 'BOLLINGER' | 'ML_MOMENTUM';
    symbol: string;
    initialCapital: number;
    parameters: Record<string, number | string>;
  }): Promise<BacktestResult>;
}

export interface IPredictionService {
  getPredictionForSymbol(symbol: string): Promise<MLPrediction>;
}
