import logging
from typing import Optional
import numpy as np
import pandas as pd

from ..schemas.analytics import StockAnalyticsResponse
from ..providers.market_data import get_market_data_provider, MarketDataProvider

logger = logging.getLogger(__name__)


class AnalyticsService:
    """
    Quantitative Analytics service layer.
    Consumes historical OHLCV data from the pluggable MarketDataProvider interface.
    Computes statistical return, volatility, Sharpe, Sortino, VaR, and CAGR.
    """

    @classmethod
    async def get_stock_analytics(
        cls,
        symbol: str,
        provider: Optional[MarketDataProvider] = None,
    ) -> StockAnalyticsResponse:
        """
        Retrieves quantitative analytics for a stock symbol by querying the active
        MarketDataProvider abstraction. Does NOT fabricate mock data when provider
        is unconfigured.
        """
        sym = symbol.strip().upper()
        active_provider = provider or get_market_data_provider()

        # 1. Check if provider is configured
        if not active_provider.is_configured():
            logger.info(
                f"Analytics queried for '{sym}', but market data provider '{active_provider.provider_name}' "
                "is not configured."
            )
            return StockAnalyticsResponse(
                symbol=sym,
                annual_return=None,
                volatility=None,
                sharpe_ratio=None,
                sortino_ratio=None,
                max_drawdown=None,
                var_95=None,
                beta=None,
                cagr=None,
                status="data_source_not_connected",
                message=(
                    f"No active market data provider configured for '{sym}'. "
                    f"Historical OHLCV data provider (e.g., yfinance, AlphaVantage, Polygon, NSE) "
                    f"must be plugged in."
                ),
            )

        # 2. Fetch historical OHLCV from pluggable provider
        try:
            df = await active_provider.get_historical_ohlcv(sym)
            if df is None or df.empty:
                return StockAnalyticsResponse(
                    symbol=sym,
                    annual_return=None,
                    volatility=None,
                    sharpe_ratio=None,
                    sortino_ratio=None,
                    max_drawdown=None,
                    var_95=None,
                    beta=None,
                    cagr=None,
                    status="symbol_not_found",
                    message=f"No market data found for symbol '{sym}'. Please verify that the ticker symbol is valid.",
                )

            if len(df) < 30:
                return StockAnalyticsResponse(
                    symbol=sym,
                    annual_return=None,
                    volatility=None,
                    sharpe_ratio=None,
                    sortino_ratio=None,
                    max_drawdown=None,
                    var_95=None,
                    beta=None,
                    cagr=None,
                    status="insufficient_data",
                    message=f"Insufficient historical price observations ({len(df)}) returned for symbol '{sym}'. Minimum 30 trading days required for statistical analytics.",
                )

            # 3. Use 'Adj Close' consistently with training methodology
            price_series = df["Adj Close"] if "Adj Close" in df.columns else df["Close"]
            price_series = price_series.astype(float)
            returns = price_series.pct_change().dropna()

            if len(returns) == 0:
                return StockAnalyticsResponse(
                    symbol=sym,
                    status="insufficient_data",
                    message=f"Could not compute return series for symbol '{sym}'.",
                )

            # 4. Statistical Metrics calculation
            trading_days = 252
            mean_daily = returns.mean()
            daily_std = returns.std()

            annual_return = float(mean_daily * trading_days)
            annual_volatility = float(daily_std * np.sqrt(trading_days)) if daily_std > 0 else 0.0

            # Sharpe Ratio (Risk-free rate assumed at 5% / 0.05)
            rf = 0.05
            excess_return = annual_return - rf
            sharpe_ratio = float(excess_return / annual_volatility) if annual_volatility > 0 else 0.0

            # Sortino Ratio (Downside deviation)
            downside_returns = returns[returns < 0]
            downside_std = downside_returns.std() * np.sqrt(trading_days) if len(downside_returns) > 0 else 0.0
            sortino_ratio = float(excess_return / downside_std) if downside_std > 0 else 0.0

            # Maximum Drawdown
            cumulative = (1.0 + returns).cumprod()
            rolling_max = cumulative.cummax()
            drawdowns = (cumulative - rolling_max) / rolling_max
            max_drawdown = float(abs(drawdowns.min())) if len(drawdowns) > 0 else 0.0

            # Historical Value at Risk (95% confidence, 1-day)
            var_95 = float(abs(np.percentile(returns, 5))) if len(returns) >= 20 else 0.0

            # Compound Annual Growth Rate (CAGR)
            start_price = float(price_series.iloc[0])
            end_price = float(price_series.iloc[-1])
            years = max(len(price_series) / trading_days, 0.01)
            cagr = float(((end_price / start_price) ** (1.0 / years)) - 1.0) if start_price > 0 else 0.0

            return StockAnalyticsResponse(
                symbol=sym,
                annual_return=round(annual_return, 4),
                volatility=round(annual_volatility, 4),
                sharpe_ratio=round(sharpe_ratio, 4),
                sortino_ratio=round(sortino_ratio, 4),
                max_drawdown=round(max_drawdown, 4),
                var_95=round(var_95, 4),
                beta=None,  # Market benchmark covariance requires market index feed
                cagr=round(cagr, 4),
                status="success",
                message=f"Calculated quantitative analytics successfully for '{sym}' from {len(price_series)} historical records.",
            )

        except Exception as e:
            logger.error(f"Error computing analytics for '{sym}': {str(e)}", exc_info=True)
            return StockAnalyticsResponse(
                symbol=sym,
                status="computation_error",
                message=f"Error computing quantitative metrics for '{sym}': {str(e)}",
            )
