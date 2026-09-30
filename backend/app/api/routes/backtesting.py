from fastapi import APIRouter
from ...schemas.backtesting import BacktestRequest, BacktestResponse
from ...services.backtest_service import BacktestService

router = APIRouter(prefix="/backtesting", tags=["Backtesting"])


@router.post(
    "/run",
    response_model=BacktestResponse,
    summary="Run Strategy Backtest Simulation"
)
async def run_backtest(request: BacktestRequest) -> BacktestResponse:
    """
    Simulates algorithmic trading strategy over historical market data:
    - Supported strategies: MA_CROSSOVER, RSI, BOLLINGER, ML_MOMENTUM
    - Computes: CAGR, Sharpe, Sortino, Max Drawdown, Win Rate, Profit Factor
    - Generates equity curve and drawdown curve
    """
    return await BacktestService.run_backtest(request)
