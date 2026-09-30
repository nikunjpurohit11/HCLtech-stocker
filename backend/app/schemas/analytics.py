from typing import Optional
from pydantic import BaseModel, Field


class StockAnalyticsResponse(BaseModel):
    """
    Response schema for single-stock quantitative analytics.
    """
    symbol: str = Field(..., description="Stock ticker symbol (e.g., RELIANCE, TCS)")
    annual_return: Optional[float] = Field(None, description="Annualized percentage return")
    volatility: Optional[float] = Field(None, description="Annualized historical volatility (%)")
    sharpe_ratio: Optional[float] = Field(None, description="Annualized Sharpe ratio")
    sortino_ratio: Optional[float] = Field(None, description="Annualized Sortino downside risk-adjusted ratio")
    max_drawdown: Optional[float] = Field(None, description="Maximum historical drawdown (%)")
    var_95: Optional[float] = Field(None, description="Daily Value at Risk at 95% confidence level (%)")
    beta: Optional[float] = Field(None, description="Stock beta relative to benchmark index (e.g. NIFTY 50)")
    cagr: Optional[float] = Field(None, description="Compound Annual Growth Rate (%)")
    
    status: str = Field("placeholder", description="Operational status: 'ready', 'placeholder', or 'error'")
    message: str = Field(
        "Quantitative analytics foundation ready. Live market calculation engine will be connected in next stage.",
        description="Informational status message explaining data readiness"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "RELIANCE",
                "annual_return": None,
                "volatility": None,
                "sharpe_ratio": None,
                "sortino_ratio": None,
                "max_drawdown": None,
                "var_95": None,
                "beta": None,
                "cagr": None,
                "status": "placeholder",
                "message": "Quantitative analytics foundation ready. Live market calculation engine will be connected in next stage."
            }
        }
