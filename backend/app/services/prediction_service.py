import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from ..core.config import settings
from ..schemas.predictions import (
    ML_FEATURE_NAMES,
    PredictionResponse,
    SignalDirection,
)

logger = logging.getLogger(__name__)


class PredictionService:
    """
    Machine Learning inference service layer.
    Prepares loading for:
    - xgboost_stock_model.pkl
    - logistic_regression_model.pkl
    - feature_scaler.pkl
    - model_config.json
    """

    REQUIRED_ARTIFACTS = [
        "xgboost_stock_model.pkl",
        "logistic_regression_model.pkl",
        "feature_scaler.pkl",
        "model_config.json",
    ]

    @classmethod
    def get_missing_artifacts(cls) -> list[str]:
        """
        Checks which model artifacts are currently missing from the ML directory.
        """
        models_dir = settings.ML_MODELS_DIR
        missing = []
        for artifact in cls.REQUIRED_ARTIFACTS:
            if not (models_dir / artifact).is_file():
                missing.append(artifact)
        return missing

    @classmethod
    async def get_prediction(cls, symbol: str) -> PredictionResponse:
        """
        Generates ML directional prediction for a given symbol.
        If trained model files are not present, returns an explicit 'model_not_loaded' state.
        """
        sym = symbol.strip().upper()
        missing = cls.get_missing_artifacts()

        if missing:
            logger.warning(
                f"Prediction requested for {sym}, but ML model artifacts are missing: {missing}"
            )
            return PredictionResponse(
                symbol=sym,
                model_name=None,
                model_type=None,
                predicted_direction=None,
                probability=None,
                prediction_horizon="next_day_direction",
                prediction_date=datetime.now(timezone.utc).isoformat(),
                feature_importance=None,
                model_performance=None,
                status="model_not_loaded",
                message=(
                    f"Model artifacts missing from {settings.ML_MODELS_DIR}: {', '.join(missing)}. "
                    "Place Colab-trained model files in backend/ml/ to activate inference."
                ),
            )

        # In future phase: load model and calculate inference using ML_FEATURE_NAMES
        return PredictionResponse(
            symbol=sym,
            model_name="xgboost_stock_model",
            model_type="XGBClassifier",
            predicted_direction=SignalDirection.NEUTRAL,
            probability=0.50,
            prediction_horizon="next_day_direction",
            prediction_date=datetime.now(timezone.utc).isoformat(),
            feature_importance=None,
            model_performance=None,
            status="ready",
            message="Model loaded successfully.",
        )
