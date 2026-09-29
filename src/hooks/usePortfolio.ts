import { useState, useEffect, useCallback } from 'react';
import { PortfolioSummary, Holding, OrderSide, OrderType, Transaction } from '../types';
import { PortfolioService } from '../services';

interface UsePortfolioReturn {
  summary: PortfolioSummary | null;
  holdings: Holding[];
  sectors: { sector: string; value: number; percentage: number; color: string }[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  executeTrade: (order: {
    symbol: string;
    companyName: string;
    side: OrderSide;
    orderType: OrderType;
    quantity: number;
    price: number;
  }) => Promise<{ success: boolean; message: string; transaction?: Transaction }>;
}

export function usePortfolio(): UsePortfolioReturn {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [sectors, setSectors] = useState<{ sector: string; value: number; percentage: number; color: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sum, h, s] = await Promise.all([
        PortfolioService.getSummary(),
        PortfolioService.getHoldings(),
        PortfolioService.getSectorAllocation(),
      ]);
      setSummary(sum);
      setHoldings(h);
      setSectors(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const executeTrade = useCallback(
    async (order: {
      symbol: string;
      companyName: string;
      side: OrderSide;
      orderType: OrderType;
      quantity: number;
      price: number;
    }) => {
      const res = await PortfolioService.executePaperTrade(order);
      if (res.success) {
        await fetchData();
      }
      return res;
    },
    [fetchData]
  );

  return {
    summary,
    holdings,
    sectors,
    isLoading,
    error,
    refetch: fetchData,
    executeTrade,
  };
}
