import { RiskMetrics, CorrelationRow } from '../types';
import {
  MOCK_RISK_METRICS,
  MOCK_CORRELATION_MATRIX,
  MOCK_HISTORICAL_DRAWDOWNS,
  MOCK_RISK_CONTRIBUTIONS,
} from '../data';
import { IAnalyticsService } from './interfaces';

export class MockAnalyticsService implements IAnalyticsService {
  public async getRiskMetrics(): Promise<RiskMetrics> {
    return { ...MOCK_RISK_METRICS };
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
    return new MockAnalyticsService().getRiskMetrics();
  }

  public static async getCorrelationMatrix(): Promise<CorrelationRow[]> {
    return new MockAnalyticsService().getCorrelationMatrix();
  }

  public static async getDrawdownSeries(): Promise<{ date: string; drawdown: number }[]> {
    return new MockAnalyticsService().getDrawdownSeries();
  }

  public static async getRiskContribution(): Promise<{ symbol: string; riskPct: number; allocationPct: number }[]> {
    return new MockAnalyticsService().getRiskContribution();
  }
}

export const AnalyticsService = MockAnalyticsService;
