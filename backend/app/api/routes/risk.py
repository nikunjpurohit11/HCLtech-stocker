from fastapi import APIRouter
from ...schemas.risk import PortfolioRiskResponse
from ...services.risk_service import RiskService

router = APIRouter(prefix="/risk", tags=["Risk"])


@router.get(
    "/portfolio",
    response_model=PortfolioRiskResponse,
    summary="Get Portfolio Institutional Risk Metrics"
)
async def get_portfolio_risk() -> PortfolioRiskResponse:
    """
    Returns institutional risk analytics for the portfolio:
    - Annual return
    - Volatility
    - Sharpe ratio
    - Sortino ratio
    - Beta
    - Max drawdown
    - VaR 95%
    - Stress loss
    - CAGR
    """
    return await RiskService.get_portfolio_risk()
