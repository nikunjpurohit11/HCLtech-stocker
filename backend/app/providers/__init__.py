"""
Market Data Provider Abstraction Layer.
Decouples historical and live market data ingestion from analytical and machine learning consumers.
"""
from .market_data import (
    MarketDataProvider,
    UnconfiguredMarketDataProvider,
    MarketDataUnavailableError,
    get_market_data_provider,
    set_market_data_provider,
    REQUIRED_OHLCV_COLUMNS,
)

__all__ = [
    "MarketDataProvider",
    "UnconfiguredMarketDataProvider",
    "MarketDataUnavailableError",
    "get_market_data_provider",
    "set_market_data_provider",
    "REQUIRED_OHLCV_COLUMNS",
]
