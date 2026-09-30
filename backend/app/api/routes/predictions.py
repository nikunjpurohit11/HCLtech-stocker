from fastapi import APIRouter, Path
from ...schemas.predictions import PredictionResponse
from ...services.prediction_service import PredictionService

router = APIRouter(prefix="/predictions", tags=["ML Predictions"])


@router.get(
    "/{symbol}",
    response_model=PredictionResponse,
    summary="Get Machine Learning Directional Prediction"
)
async def get_prediction(
    symbol: str = Path(..., description="Stock symbol (e.g. RELIANCE, TCS, INFY)", min_length=1)
) -> PredictionResponse:
    """
    Returns next-day directional prediction from the trained ML models:
    - Symbol
    - Model name & type
    - Predicted direction (UP / DOWN / NEUTRAL)
    - Confidence probability
    - Feature importance weights
    - Model performance metrics
    """
    return await PredictionService.get_prediction(symbol)
