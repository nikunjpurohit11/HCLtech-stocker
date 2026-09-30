from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class StrategyType(str, Enum):
    MA_CROSSOVER = "MA_CROSSOVER"
    RSI = "RSI"
    BOLLINGER = "BOLLINGER"
    ML_MOMENTUM = "ML_MOMENTUM"


class BacktestRequest(BaseModel):
    """
    Request schema to initiate a strategy backtest run.
    """
    strategy_type: StrategyType = Field(..., description="Algorithmic strategy model")
    symbol: str = Field(..., description="Stock symbol to backtest on (e.g., RELIANCE)")
    initial_capital: float = Field(100000.0, ge=1000.0, description="Virtual starting equity in INR (₹)")
    parameters: Dict[str, Any] = Field(
        default_factory=dict,
        description="Strategy specific hyperparameters (e.g. short_window, long_window, rsi_period, oversold, overbought)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "strategy_type": "MA_CROSSOVER",
                "symbol": "RELIANCE",
                "initial_capital": 100000.0,
                "parameters": {
                    "fast_period": 20,
                    "slow_period": 50
                }
            }
        }


class EquityPoint(BaseModel):
    date: str
    equity: float
    benchmark: Optional[float] = None


class DrawdownPoint(BaseModel):
    date: str
    drawdown: float


class BacktestResponse(BaseModel):
    """
    Response schema containing simulated strategy performance metrics and equity curve.
    """
    strategy_type: StrategyType
    symbol: str
    initial_capital: float
    final_value: Optional[float] = Field(None, description="Final portfolio value")
    total_return: Optional[float] = Field(None, description="Total cumulative return (%)")
    cagr: Optional[float] = Field(None, description="Compound Annual Growth Rate (%)")
    volatility: Optional[float] = Field(None, description="Annualized strategy volatility (%)")
    sharpe_ratio: Optional[float] = Field(None, description="Strategy Sharpe ratio")
    max_drawdown: Optional[float] = Field(None, description="Maximum peak-to-trough decline (%)")
    total_trades: Optional[int] = Field(None, description="Total number of trades executed")
    winning_trades: Optional[int] = Field(None, description="Total profitable trades")
    losing_trades: Optional[int] = Field(None, description="Total losing trades")
    win_rate: Optional[float] = Field(None, description="Percentage of winning trades (%)")
    profit_factor: Optional[float] = Field(None, description="Gross profit divided by gross loss")
    equity_curve: List[Dict[str, Any]] = Field(default_factory=list, description="Historical equity points")
    drawdown_curve: List[Dict[str, Any]] = Field(default_factory=list, description="Historical drawdown percentages")

    status: str = Field("foundation_ready", description="Status: 'executed', 'foundation_ready', or 'error'")
    message: str = Field(
        "Backtesting API endpoint ready. Full vector backtest simulation engine will be activated in next phase.",
        description="Status description"
    )
