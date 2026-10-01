import { RiskMetrics, CorrelationRow } from '../types';
import {
  MOCK_RISK_METRICS,
  MOCK_CORRELATION_MATRIX,
  MOCK_HISTORICAL_DRAWDOWNS,
  MOCK_RISK_CONTRIBUTIONS,
} from '../data';
import { IAnalyticsService } from './interfaces';
import { apiClient } from './apiClient';

export interface BackendStockAnalytics {
  symbol: string;
  annual_return?: number | null;
  volatility?: number | null;
  sharpe_ratio?: number | null;
  sortino_ratio?: number | null;
  max_drawdown?: number | null;
  var_95?: number | null;
  beta?: number | null;
  cagr?: number | null;
  status: string;
  message?: string;
}

interface BackendPortfolioRisk {
  annual_return?: number | null;
  volatility?: number | null;
  sharpe_ratio?: number | null;
  sortino_ratio?: number | null;
  beta?: number | null;
  max_drawdown?: number | null;
  var_95?: number | null;
  stress_loss?: number | null;
  cagr?: number | null;
  status: string;
  message?: string;
}

export class LiveAnalyticsService implements IAnalyticsService {
  public async getRiskMetrics(): Promise<RiskMetrics> {
    try {
      const res = await apiClient.get<BackendPortfolioRisk>('/risk/portfolio');

      if (res && res.status === 'ready') {
        return {
          annualReturn: res.annual_return != null ? Math.round(res.annual_return * 1000) / 10 : MOCK_RISK_METRICS.annualReturn,
          volatility: res.volatility != null ? Math.round(res.volatility * 1000) / 10 : MOCK_RISK_METRICS.volatility,
          sharpeRatio: res.sharpe_ratio ?? MOCK_RISK_METRICS.sharpeRatio,
          sortinoRatio: res.sortino_ratio ?? MOCK_RISK_METRICS.sortinoRatio,
          beta: res.beta ?? MOCK_RISK_METRICS.beta,
          maxDrawdown: res.max_drawdown != null ? Math.round(res.max_drawdown * 1000) / 10 : MOCK_RISK_METRICS.maxDrawdown,
          var95Percent: res.var_95 != null ? Math.round(res.var_95 * 1000) / 10 : MOCK_RISK_METRICS.var95Percent,
          var95Amount: MOCK_RISK_METRICS.var95Amount,
          stressLoss: res.stress_loss ?? MOCK_RISK_METRICS.stressLoss,
          cagr: res.cagr != null ? Math.round(res.cagr * 1000) / 10 : MOCK_RISK_METRICS.cagr,
        };
      }

      // If backend returns placeholder status, use default institutional metrics
      return { ...MOCK_RISK_METRICS };
    } catch (err) {
      console.warn('[AnalyticsService] Backend risk metrics failed, using fallback:', err);
      return { ...MOCK_RISK_METRICS };
    }
  }

  public async getStockAnalytics(symbol: string): Promise<BackendStockAnalytics | null> {
    const sym = symbol.trim().toUpperCase();
    try {
      return await apiClient.get<BackendStockAnalytics>(`/analytics/stock/${encodeURIComponent(sym)}`);
    } catch (err) {
      console.warn(`[AnalyticsService] Failed to fetch live analytics for ${sym}:`, err);
      return null;
    }
  }

  public async getCorrelationMatrix(): Promise<CorrelationRow[]> {
    return [...MOCK_CORRELATION_MATRIX];
  }

  public async getDrawdownSeries(): Promise<{ date: string; drawdown: number }[]> {
    return [...MOCK_HISTORICAL_DRAWDOWNS];
  }

  public async getRiskContribution(): Promise<{ symbol: string; riskPct: number; allocationPct: number }[]> {
    return [...MOCK_RISK_CONTRIBUTIONS];
  }

  // Static convenience wrappers
  public static async getRiskMetrics(): Promise<RiskMetrics> {
    return new LiveAnalyticsService().getRiskMetrics();
  }

  public static async getStockAnalytics(symbol: string): Promise<BackendStockAnalytics | null> {
    return new LiveAnalyticsService().getStockAnalytics(symbol);
  }

  public static async getCorrelationMatrix(): Promise<CorrelationRow[]> {
    return new LiveAnalyticsService().getCorrelationMatrix();
  }

  public static async getDrawdownSeries(): Promise<{ date: string; drawdown: number }[]> {
    return new LiveAnalyticsService().getDrawdownSeries();
  }

  public static async getRiskContribution(): Promise<{ symbol: string; riskPct: number; allocationPct: number }[]> {
    return new LiveAnalyticsService().getRiskContribution();
  }
}

export const AnalyticsService = LiveAnalyticsService;
