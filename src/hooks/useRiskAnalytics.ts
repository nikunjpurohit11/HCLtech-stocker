import { useState, useEffect, useCallback } from 'react';
import { RiskMetrics, CorrelationRow } from '../types';
import { AnalyticsService } from '../services';

interface UseRiskAnalyticsReturn {
  metrics: RiskMetrics | null;
  correlations: CorrelationRow[];
  drawdowns: { date: string; drawdown: number }[];
  riskContributions: { symbol: string; riskPct: number; allocationPct: number }[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRiskAnalytics(): UseRiskAnalyticsReturn {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [correlations, setCorrelations] = useState<CorrelationRow[]>([]);
  const [drawdowns, setDrawdowns] = useState<{ date: string; drawdown: number }[]>([]);
  const [riskContributions, setRiskContributions] = useState<{ symbol: string; riskPct: number; allocationPct: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [m, c, dd, rc] = await Promise.all([
        AnalyticsService.getRiskMetrics(),
        AnalyticsService.getCorrelationMatrix(),
        AnalyticsService.getDrawdownSeries(),
        AnalyticsService.getRiskContribution(),
      ]);
      setMetrics(m);
      setCorrelations(c);
      setDrawdowns(dd);
      setRiskContributions(rc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    metrics,
    correlations,
    drawdowns,
    riskContributions,
    isLoading,
    error,
    refetch: fetchData,
  };
}
