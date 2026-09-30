from typing import Optional
from pydantic import BaseModel, Field


class PortfolioRiskResponse(BaseModel):
    """
    Response schema for portfolio risk analytics.
    """
    annual_return: Optional[float] = Field(None, description="Annualized portfolio return (%)")
    volatility: Optional[float] = Field(None, description="Portfolio annualized volatility (%)")
    sharpe_ratio: Optional[float] = Field(None, description="Portfolio Sharpe ratio")
    sortino_ratio: Optional[float] = Field(None, description="Portfolio Sortino ratio")
    beta: Optional[float] = Field(None, description="Portfolio systematic beta")
    max_drawdown: Optional[float] = Field(None, description="Portfolio maximum drawdown (%)")
    var_95: Optional[float] = Field(None, description="Value at Risk (VaR) at 95% confidence level (%)")
    stress_loss: Optional[float] = Field(None, description="Simulated stress loss scenario (%)")
    cagr: Optional[float] = Field(None, description="Compound Annual Growth Rate (%)")

    status: str = Field("placeholder", description="Operational status: 'ready', 'placeholder', or 'error'")
    message: str = Field(
        "Portfolio risk foundation ready. Direct Supabase portfolio linkage will be implemented in the next phase.",
        description="Status message regarding live portfolio connectivity"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "annual_return": None,
                "volatility": None,
                "sharpe_ratio": None,
                "sortino_ratio": None,
                "beta": None,
                "max_drawdown": None,
                "var_95": None,
                "stress_loss": None,
                "cagr": None,
                "status": "placeholder",
                "message": "Portfolio risk foundation ready. Direct Supabase portfolio linkage will be implemented in the next phase."
            }
        }
