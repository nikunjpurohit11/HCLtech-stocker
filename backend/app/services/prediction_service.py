import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import HTTPException, status

from ..core.config import settings
from ..schemas.predictions import (
    ML_FEATURE_NAMES,
    PredictionResponse,
    SignalDirection,
)
from ..providers.market_data import get_market_data_provider, MarketDataProvider
from .feature_engineering import compute_technical_features, extract_latest_feature_dict

logger = logging.getLogger(__name__)


class PredictionService:
    """
    Production Machine Learning Inference Service.
    Loads and serves trained artifacts from backend/ml/:
    - xgboost_stock_model.pkl
    - feature_scaler.pkl
    - model_config.json
    - logistic_regression_model.pkl (optional baseline)
    """

    _xgb_model: Any = None
    _logistic_model: Any = None
    _scaler: Any = None
    _model_config: Optional[Dict[str, Any]] = None
    _feature_names: List[str] = ML_FEATURE_NAMES
    _is_loaded: bool = False

    @classmethod
    def load_artifacts(cls) -> bool:
        """
        Loads XGBoost model, StandardScaler, and JSON config from settings.ML_MODELS_DIR.
        Invoked on server startup.
        """
        models_dir: Path = settings.ML_MODELS_DIR
        xgb_path = models_dir / "xgboost_stock_model.pkl"
        scaler_path = models_dir / "feature_scaler.pkl"
        config_path = models_dir / "model_config.json"
        logistic_path = models_dir / "logistic_regression_model.pkl"

        logger.info(f"Loading ML artifacts from directory: {models_dir}")

        missing_files = []
        if not xgb_path.is_file():
            missing_files.append("xgboost_stock_model.pkl")
        if not scaler_path.is_file():
            missing_files.append("feature_scaler.pkl")
        if not config_path.is_file():
            missing_files.append("model_config.json")

        if missing_files:
            logger.warning(
                f"ML model artifacts missing in {models_dir}: {missing_files}. "
                "Inference will remain inactive until artifacts are placed."
            )
            cls._is_loaded = False
            return False

        try:
            # 1. Load trained XGBoost model
            cls._xgb_model = joblib.load(xgb_path)
            logger.info("Successfully loaded XGBoost model artifact.")

            # 2. Load fitted feature scaler
            cls._scaler = joblib.load(scaler_path)
            logger.info("Successfully loaded StandardScaler artifact.")

            # 3. Load model configuration and schema
            with open(config_path, "r", encoding="utf-8") as f:
                cls._model_config = json.load(f)
            logger.info("Successfully loaded model_config.json.")

            # 4. Extract feature ordering from config if present
            if cls._model_config and "features" in cls._model_config:
                cls._feature_names = cls._model_config["features"]
            elif cls._model_config and "feature_names" in cls._model_config:
                cls._feature_names = cls._model_config["feature_names"]
            else:
                cls._feature_names = ML_FEATURE_NAMES

            # 5. Optionally load logistic regression baseline if available
            if logistic_path.is_file():
                try:
                    cls._logistic_model = joblib.load(logistic_path)
                    logger.info("Successfully loaded Logistic Regression baseline.")
                except Exception as ex:
                    logger.warning(f"Could not load logistic regression model: {ex}")

            cls._is_loaded = True
            logger.info("All ML inference artifacts loaded successfully and ready.")
            return True

        except Exception as e:
            logger.error(f"Failed to load ML artifacts: {str(e)}", exc_info=True)
            cls._is_loaded = False
            return False

    @classmethod
    def is_loaded(cls) -> bool:
        return cls._is_loaded

    @classmethod
    def predict(cls, symbol: str, features_dict: Dict[str, float]) -> PredictionResponse:
        """
        Executes ML inference on incoming 12 market features:
        1. Validates presence and ordering of exact 12 features.
        2. Constructs a single-row pandas DataFrame.
        3. Scales features with StandardScaler.
        4. Predicts next-day direction with XGBoost model (1 -> 'UP', 0 -> 'DOWN').
        5. Computes prediction probability.
        6. Extracts feature importances and validation metrics.
        """
        sym = symbol.strip().upper()

        # If not loaded yet, attempt lazy load
        if not cls._is_loaded:
            loaded = cls.load_artifacts()
            if not loaded or cls._xgb_model is None or cls._scaler is None:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail=(
                        f"Machine learning model artifacts are not loaded. "
                        f"Ensure xgboost_stock_model.pkl, feature_scaler.pkl, and model_config.json "
                        f"are present in {settings.ML_MODELS_DIR}."
                    ),
                )

        # Validate that all required 12 features are provided
        missing_features = [f for f in cls._feature_names if f not in features_dict]
        if missing_features:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Missing required market features: {missing_features}. "
                    f"Payload must contain all 12 features in exact configuration: {cls._feature_names}"
                ),
            )

        try:
            # 1. Convert input to DataFrame with exact column ordering
            df = pd.DataFrame([features_dict])
            ordered_df = df[cls._feature_names].astype(float)

            # 2. Scale features using loaded StandardScaler
            scaled_features = cls._scaler.transform(ordered_df)

            # 3. Predict class label with XGBoost (1 = UP, 0 = DOWN)
            raw_prediction = cls._xgb_model.predict(scaled_features)
            pred_class = int(raw_prediction[0])
            predicted_direction = SignalDirection.UP if pred_class == 1 else SignalDirection.DOWN

            # 4. Predict probability
            probability: Optional[float] = None
            if hasattr(cls._xgb_model, "predict_proba"):
                probs = cls._xgb_model.predict_proba(scaled_features)[0]
                probability = float(np.round(probs[pred_class], 4))

            # 5. Extract feature importances if available
            feature_importance: Optional[Dict[str, float]] = None
            if hasattr(cls._xgb_model, "feature_importances_"):
                importances = cls._xgb_model.feature_importances_
                feature_importance = {
                    feat: float(np.round(weight, 4))
                    for feat, weight in zip(cls._feature_names, importances)
                }

            # 6. Extract model metrics from config
            model_performance: Optional[Dict[str, float]] = None
            if cls._model_config:
                model_performance = (
                    cls._model_config.get("metrics")
                    or cls._model_config.get("performance")
                    or cls._model_config.get("model_performance")
                )

            return PredictionResponse(
                symbol=sym,
                model_name=getattr(cls._xgb_model, "__class__", type(cls._xgb_model)).__name__,
                model_type="XGBClassifier",
                predicted_direction=predicted_direction,
                probability=probability,
                prediction_horizon="next_day_direction",
                prediction_date=datetime.now(timezone.utc).isoformat(),
                feature_importance=feature_importance,
                model_performance=model_performance,
                status="success",
                message=f"Next-day directional inference completed successfully for {sym}.",
            )

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Inference execution failed for symbol {sym}: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Inference execution error: {str(e)}",
            )

    @classmethod
    async def predict_from_historical_data(
        cls,
        symbol: str,
        provider: Optional[MarketDataProvider] = None,
    ) -> PredictionResponse:
        """
        Consumes normalized historical OHLCV data from the pluggable MarketDataProvider,
        reproduces the exact Colab 12-feature technical engineering pipeline, and executes
        inference through the trained XGBoost model.
        """
        sym = symbol.strip().upper()
        active_provider = provider or get_market_data_provider()

        if not active_provider.is_configured():
            logger.info(
                f"Prediction requested for '{sym}', but market data provider '{active_provider.provider_name}' "
                "is not configured."
            )
            return PredictionResponse(
                symbol=sym,
                model_name=None,
                model_type="XGBClassifier",
                predicted_direction=None,
                probability=None,
                prediction_horizon="next_day_direction",
                prediction_date=datetime.now(timezone.utc).isoformat(),
                feature_importance=None,
                model_performance=None,
                status="data_source_not_connected",
                message=(
                    f"No active market data provider configured for '{sym}'. "
                    f"A historical market data provider (e.g., yfinance, AlphaVantage, Polygon) "
                    f"must be plugged in to generate the 12 technical features from historical OHLCV."
                ),
            )

        # Retrieve OHLCV series
        df = await active_provider.get_historical_ohlcv(sym)
        if df is None or df.empty or len(df) < 20:
            return PredictionResponse(
                symbol=sym,
                model_name=None,
                model_type="XGBClassifier",
                predicted_direction=None,
                probability=None,
                prediction_horizon="next_day_direction",
                prediction_date=datetime.now(timezone.utc).isoformat(),
                feature_importance=None,
                model_performance=None,
                status="insufficient_data",
                message=f"Insufficient historical price records ({0 if df is None else len(df)}) to compute 12 technical features for '{sym}'.",
            )

        # Compute technical features using exact Colab methodology
        features_dict = extract_latest_feature_dict(df)

        # Execute prediction with verified 12-feature vector
        return cls.predict(symbol=sym, features_dict=features_dict)

