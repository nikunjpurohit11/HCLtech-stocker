import asyncio
import logging
import time
from typing import Dict, Optional, Tuple
import pandas as pd
import yfinance as yf

from .market_data import MarketDataProvider, REQUIRED_OHLCV_COLUMNS

logger = logging.getLogger(__name__)


class YahooFinanceMarketDataProvider(MarketDataProvider):
    """
    Concrete Market Data Provider integrating Yahoo Finance via the yfinance package.
    Supports symbol normalization for Indian NSE equities, in-memory caching with TTL,
    and strict OHLCV schema normalization.
    """

    def __init__(self, cache_ttl_seconds: int = 300):
        self._cache_ttl = cache_ttl_seconds
        # In-memory cache: (normalized_symbol, period, interval) -> (timestamp, DataFrame)
        self._cache: Dict[Tuple[str, str, str], Tuple[float, pd.DataFrame]] = {}

    @property
    def provider_name(self) -> str:
        return "yahoo_finance"

    def is_configured(self) -> bool:
        return True

    @staticmethod
    def normalize_symbol(symbol: str) -> str:
        """
        Normalizes stock symbols for Yahoo Finance.
        Indian equities on NSE (e.g. RELIANCE, TCS, INFY) require the '.NS' suffix.
        Symbols with existing suffixes (e.g. '.BO', '.NS', '^NSEI') or currencies are preserved.
        """
        sym = symbol.strip().upper()
        if not sym:
            return sym

        # If symbol already specifies an exchange, market index, or currency, preserve it
        if "." in sym or "^" in sym or "=" in sym:
            return sym

        # Default Indian equity tickers without suffix to NSE
        return f"{sym}.NS"

    def _fetch_from_yfinance_sync(
        self,
        normalized_symbol: str,
        period: str = "2y",
        interval: str = "1d",
    ) -> Optional[pd.DataFrame]:
        """
        Synchronous download execution designed to run within asyncio.to_thread.
        """
        try:
            ticker = yf.Ticker(normalized_symbol)
            # Explicit auto_adjust=False preserves both Close and split/dividend-adjusted 'Adj Close'
            hist = ticker.history(period=period, interval=interval, auto_adjust=False)

            if hist is None or hist.empty:
                logger.warning(
                    f"Yahoo Finance returned empty historical dataset for symbol '{normalized_symbol}'."
                )
                return None

            # Reset index to extract Date column
            df = hist.reset_index()

            # 1. Normalize Date column to timezone-naive datetime
            if "Date" in df.columns:
                df["Date"] = pd.to_datetime(df["Date"])
                if hasattr(df["Date"].dt, "tz") and df["Date"].dt.tz is not None:
                    df["Date"] = df["Date"].dt.tz_localize(None)

            # 2. Check and ensure 'Adj Close' exists (fallback to 'Close' if provider omits it)
            if "Adj Close" not in df.columns and "Close" in df.columns:
                df["Adj Close"] = df["Close"]

            # 3. Ensure all required columns are present
            missing_cols = [col for col in REQUIRED_OHLCV_COLUMNS if col not in df.columns]
            if missing_cols:
                logger.error(
                    f"Yahoo Finance payload for '{normalized_symbol}' missing columns: {missing_cols}"
                )
                return None

            # 4. Filter and enforce exact column schema
            df_clean = df[REQUIRED_OHLCV_COLUMNS].copy()

            # 5. Convert numeric columns to float64/int64
            numeric_cols = ["Open", "High", "Low", "Close", "Adj Close", "Volume"]
            for col in numeric_cols:
                df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce")

            # 6. Drop invalid or NaN price rows
            df_clean = df_clean.dropna(subset=["Close", "Adj Close"])

            # 7. Sort chronologically and drop duplicate timestamps
            df_clean = df_clean.sort_values("Date").drop_duplicates(subset=["Date"], keep="last")
            df_clean = df_clean.reset_index(drop=True)

            if df_clean.empty:
                logger.warning(f"No valid price observations remaining for '{normalized_symbol}'.")
                return None

            return df_clean

        except Exception as e:
            logger.error(
                f"Error retrieving Yahoo Finance data for '{normalized_symbol}': {str(e)}",
                exc_info=True,
            )
            return None

    async def get_historical_ohlcv(
        self,
        symbol: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        interval: str = "1d",
    ) -> Optional[pd.DataFrame]:
        """
        Retrieves historical OHLCV pricing data for a ticker symbol.
        Leverages in-memory cache to prevent redundant HTTP downloads during request flows.
        """
        norm_sym = self.normalize_symbol(symbol)
        period = "2y"  # 2 years provides ~500 bars, well above 200 required for SMA_200

        # Check Cache
        cache_key = (norm_sym, period, interval)
        now = time.time()
        if cache_key in self._cache:
            ts, cached_df = self._cache[cache_key]
            if now - ts < self._cache_ttl:
                logger.debug(f"Serving cached OHLCV for '{norm_sym}' (age: {int(now - ts)}s)")
                return cached_df.copy()

        # Run I/O in worker thread so FastAPI async loop is not blocked
        df = await asyncio.to_thread(
            self._fetch_from_yfinance_sync,
            normalized_symbol=norm_sym,
            period=period,
            interval=interval,
        )

        if df is not None and not df.empty:
            self._cache[cache_key] = (now, df)
            return df.copy()

        return None
