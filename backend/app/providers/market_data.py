import logging
from abc import ABC, abstractmethod
from typing import List, Optional
import pandas as pd

logger = logging.getLogger(__name__)

# Standardized schema for historical OHLCV data across all providers
REQUIRED_OHLCV_COLUMNS: List[str] = [
    "Date",
    "Open",
    "High",
    "Low",
    "Close",
    "Adj Close",
    "Volume",
]


class MarketDataUnavailableError(Exception):
    """Raised when market data cannot be fetched or provider is not configured."""
    pass


class MarketDataProvider(ABC):
    """
    Pluggable abstract interface for market data providers.
    Decouples raw data sourcing (e.g. Yahoo Finance, Alpha Vantage, Polygon, NSE India API)
    from downstream quantitative analytics, risk metrics, and ML feature engineering.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the underlying provider implementation."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns True if the provider is fully configured with credentials/access."""
        pass

    @abstractmethod
    async def get_historical_ohlcv(
        self,
        symbol: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        interval: str = "1d",
    ) -> Optional[pd.DataFrame]:
        """
        Retrieves historical OHLCV pricing data for a given ticker symbol.

        Requirements for returning DataFrame:
        - Must contain normalized columns: Date, Open, High, Low, Close, Adj Close, Volume.
        - Date must be datetime64 or sorted ISO timestamp string.
        - Numerical price columns must be float64.
        - Sorted chronologically ascending by Date.
        - 'Adj Close' MUST be retained and normalized to preserve split/dividend adjustments
          consistent with Colab model training methodology.
        """
        pass


class UnconfiguredMarketDataProvider(MarketDataProvider):
    """
    Default placeholder provider when no external market data provider has been selected.
    Does NOT fabricate mock data; explicitly reports unconfigured status.
    """

    @property
    def provider_name(self) -> str:
        return "unconfigured"

    def is_configured(self) -> bool:
        return False

    async def get_historical_ohlcv(
        self,
        symbol: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        interval: str = "1d",
    ) -> Optional[pd.DataFrame]:
        logger.info(
            f"MarketDataProvider is currently unconfigured. "
            f"Historical OHLCV for '{symbol}' requested but no provider active."
        )
        return None


# Global active provider cache
_active_provider: Optional[MarketDataProvider] = None


def get_market_data_provider() -> MarketDataProvider:
    """
    Returns the active market data provider based on configuration settings.
    Supports 'yahoo_finance' and 'unconfigured'.
    """
    global _active_provider
    if _active_provider is not None:
        return _active_provider

    from ..core.config import settings

    provider_choice = settings.MARKET_DATA_PROVIDER.lower().strip()
    if provider_choice == "yahoo_finance":
        from .yahoo_finance import YahooFinanceMarketDataProvider
        _active_provider = YahooFinanceMarketDataProvider()
        logger.info("Initialized active MarketDataProvider: YahooFinanceMarketDataProvider")
    else:
        _active_provider = UnconfiguredMarketDataProvider()
        logger.info("Initialized active MarketDataProvider: UnconfiguredMarketDataProvider")

    return _active_provider


def set_market_data_provider(provider: MarketDataProvider) -> None:
    """
    Explicitly overrides or swaps the active market data provider implementation.
    """
    global _active_provider
    if not isinstance(provider, MarketDataProvider):
        raise TypeError("Provider must implement MarketDataProvider interface")
    _active_provider = provider
    logger.info(f"Market data provider updated to: {provider.provider_name}")
