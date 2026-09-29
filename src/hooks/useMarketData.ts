import { useState, useEffect, useCallback } from 'react';
import { StockQuote, MarketIndex } from '../types';
import { MarketService } from '../services';

interface UseMarketDataReturn {
  stocks: StockQuote[];
  indices: MarketIndex[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getStock: (symbol: string) => StockQuote | undefined;
}

export function useMarketData(): UseMarketDataReturn {
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedStocks, fetchedIndices] = await Promise.all([
        MarketService.getStocks(),
        MarketService.getIndices(),
      ]);
      setStocks(fetchedStocks);
      setIndices(fetchedIndices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStock = useCallback(
    (symbol: string) => {
      return stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    },
    [stocks]
  );

  return {
    stocks,
    indices,
    isLoading,
    error,
    refetch: fetchData,
    getStock,
  };
}
