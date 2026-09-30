from fastapi import APIRouter, Path
from ...schemas.analytics import StockAnalyticsResponse
from ...services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(
    "/stock/{symbol}",
    response_model=StockAnalyticsResponse,
    summary="Get Stock Quantitative Analytics"
)
async def get_stock_analytics(
    symbol: str = Path(..., description="Stock symbol (e.g. RELIANCE, TCS, INFY)", min_length=1)
) -> StockAnalyticsResponse:
    """
    Returns quantitative statistics for a specified stock symbol:
    - Annual return
    - Volatility
    - Sharpe ratio
    - Sortino ratio
    - Maximum drawdown
    - VaR 95%
    - Beta
    - CAGR
    """
    return await AnalyticsService.get_stock_analytics(symbol)
