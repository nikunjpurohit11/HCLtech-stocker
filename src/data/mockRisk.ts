import { RiskMetrics, CorrelationRow } from '../types';

export const MOCK_RISK_METRICS: RiskMetrics = {
  annualReturn: 18.42,
  volatility: 18.40,
  sharpeRatio: 1.24,
  sortinoRatio: 1.68,
  beta: 0.94,
  maxDrawdown: -12.80,
  var95Percent: -2.10,
  var95Amount: 17690.00,
  stressLoss: -58420.00,
  cagr: 16.85,
};

export const MOCK_CORRELATION_MATRIX: CorrelationRow[] = [
  {
    symbol: 'RELIANCE',
    correlations: { RELIANCE: 1.00, TCS: 0.28, HDFCBANK: 0.45, INFY: 0.24, TATAMOTORS: 0.52, BHARTIARTL: 0.38 },
  },
  {
    symbol: 'TCS',
    correlations: { RELIANCE: 0.28, TCS: 1.00, HDFCBANK: 0.31, INFY: 0.78, TATAMOTORS: 0.19, BHARTIARTL: 0.22 },
  },
  {
    symbol: 'HDFCBANK',
    correlations: { RELIANCE: 0.45, TCS: 0.31, HDFCBANK: 1.00, INFY: 0.35, TATAMOTORS: 0.48, BHARTIARTL: 0.29 },
  },
  {
    symbol: 'INFY',
    correlations: { RELIANCE: 0.24, TCS: 0.78, HDFCBANK: 0.35, INFY: 1.00, TATAMOTORS: 0.21, BHARTIARTL: 0.26 },
  },
  {
    symbol: 'TATAMOTORS',
    correlations: { RELIANCE: 0.52, TCS: 0.19, HDFCBANK: 0.48, INFY: 0.21, TATAMOTORS: 1.00, BHARTIARTL: 0.41 },
  },
  {
    symbol: 'BHARTIARTL',
    correlations: { RELIANCE: 0.38, TCS: 0.22, HDFCBANK: 0.29, INFY: 0.26, TATAMOTORS: 0.41, BHARTIARTL: 1.00 },
  },
];

export const MOCK_HISTORICAL_DRAWDOWNS: { date: string; drawdown: number }[] = [
  { date: 'Jan 2026', drawdown: -1.2 },
  { date: 'Feb 2026', drawdown: -4.8 },
  { date: 'Mar 2026', drawdown: -12.8 },
  { date: 'Apr 2026', drawdown: -8.4 },
  { date: 'May 2026', drawdown: -3.2 },
  { date: 'Jun 2026', drawdown: -5.6 },
  { date: 'Jul 2026', drawdown: -2.1 },
  { date: 'Aug 2026', drawdown: -6.4 },
  { date: 'Sep 2026', drawdown: -1.8 },
];

export const MOCK_RISK_CONTRIBUTIONS: { symbol: string; riskPct: number; allocationPct: number }[] = [
  { symbol: 'RELIANCE', riskPct: 24.2, allocationPct: 26.6 },
  { symbol: 'TCS', riskPct: 16.5, allocationPct: 20.0 },
  { symbol: 'HDFCBANK', riskPct: 19.8, allocationPct: 17.8 },
  { symbol: 'INFY', riskPct: 14.1, allocationPct: 11.4 },
  { symbol: 'TATAMOTORS', riskPct: 18.9, allocationPct: 7.0 },
  { symbol: 'BHARTIARTL', riskPct: 6.5, allocationPct: 5.5 },
];
