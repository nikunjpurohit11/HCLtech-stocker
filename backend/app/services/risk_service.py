import logging
from ..schemas.risk import PortfolioRiskResponse

logger = logging.getLogger(__name__)


class RiskService:
    """
    Portfolio Risk Engine service layer.
    Prepares institutional risk models: VaR 95%, Stress testing, Sortino, Drawdowns.
    """

    @classmethod
    async def get_portfolio_risk(cls) -> PortfolioRiskResponse:
        """
        Retrieves institutional risk metrics for the portfolio.
        Returns a clean placeholder foundation state until the Supabase portfolio
        service-role / authenticated pipeline is linked.
        """
        logger.info("Portfolio risk assessment foundation requested.")

        return PortfolioRiskResponse(
            annual_return=None,
            volatility=None,
            sharpe_ratio=None,
            sortino_ratio=None,
            beta=None,
            max_drawdown=None,
            var_95=None,
            stress_loss=None,
            cagr=None,
            status="portfolio_unlinked",
            message="Portfolio risk foundation ready. Direct Supabase portfolio linkage will be implemented in the next phase."
        )
