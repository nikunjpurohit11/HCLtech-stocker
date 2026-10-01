from fastapi import APIRouter, Body, Path

from ...schemas.predictions import PredictionRequest, PredictionResponse
from ...services.prediction_service import PredictionService

router = APIRouter(prefix="/predictions", tags=["ML Predictions"])


@router.post(
    "/{symbol}",
    response_model=PredictionResponse,
    summary="Generate Machine Learning Next-Day Directional Prediction",
)
async def predict_stock_direction(
    symbol: str = Path(
        ...,
        description="Stock ticker symbol (e.g. RELIANCE, TCS, INFY)",
        min_length=1,
    ),
    payload: PredictionRequest = Body(
        ...,
        description="Market technical and momentum features dictionary matching model_config.json",
    ),
) -> PredictionResponse:
    """
    Executes trained XGBoost classification inference for next-day price direction:
    - Accepts the 12 exact market features:
      1. Adj Close
      2. Volume
      3. Daily_Return
      4. SMA_20
      5. SMA_50
      6. SMA_200
      7. Momentum_10
      8. Volatility_20
      9. RSI_14
      10. MACD
      11. Price_SMA20_Ratio
      12. Price_SMA50_Ratio
    - Applies StandardScaler transformation
    - Generates predicted direction: UP (1) or DOWN (0)
    - Returns class confidence probability and feature importances
    """
    features_dict = payload.get_features_dict()
    return PredictionService.predict(symbol=symbol, features_dict=features_dict)


@router.get(
    "/{symbol}",
    response_model=PredictionResponse,
    summary="Generate Directional Prediction from Historical Market Data",
)
async def predict_stock_direction_from_provider(
    symbol: str = Path(
        ...,
        description="Stock ticker symbol (e.g. RELIANCE, TCS, INFY)",
        min_length=1,
    ),
) -> PredictionResponse:
    """
    Queries historical OHLCV data from the active MarketDataProvider abstraction,
    executes the Colab 12-feature technical engineering pipeline, and runs inference.
    """
    return await PredictionService.predict_from_historical_data(symbol)

