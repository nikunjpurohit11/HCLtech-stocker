from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class SignalDirection(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    NEUTRAL = "NEUTRAL"


# Constant feature names in exact model order as established in Colab
ML_FEATURE_NAMES: List[str] = [
    "Adj Close",
    "Volume",
    "Daily_Return",
    "SMA_20",
    "SMA_50",
    "SMA_200",
    "Momentum_10",
    "Volatility_20",
    "RSI_14",
    "MACD",
    "Price_SMA20_Ratio",
    "Price_SMA50_Ratio",
]


class PredictionRequest(BaseModel):
    """
    Request payload containing the 12 required market features for ML inference.
    Supports either nested {"features": {...}} or direct top-level key-value mapping.
    """
    features: Optional[Dict[str, float]] = Field(
        None,
        description="Dictionary containing the 12 exact market features required by model_config.json"
    )

    class Config:
        extra = "allow"
        json_schema_extra = {
            "example": {
                "features": {
                    "Adj Close": 2850.5,
                    "Volume": 4200000.0,
                    "Daily_Return": 0.0125,
                    "SMA_20": 2810.0,
                    "SMA_50": 2780.0,
                    "SMA_200": 2650.0,
                    "Momentum_10": 0.035,
                    "Volatility_20": 0.185,
                    "RSI_14": 58.4,
                    "MACD": 12.3,
                    "Price_SMA20_Ratio": 1.014,
                    "Price_SMA50_Ratio": 1.025
                }
            }
        }

    def get_features_dict(self) -> Dict[str, float]:
        """
        Extracts features dictionary from nested 'features' or top-level extra fields.
        """
        if self.features and isinstance(self.features, dict):
            return self.features
        extra_data = {k: float(v) for k, v in self.__dict__.items() if k != "features" and v is not None}
        return extra_data


class PredictionResponse(BaseModel):
    """
    Response schema for ML directional prediction.
    """
    symbol: str = Field(..., description="Stock ticker symbol")
    model_name: Optional[str] = Field(None, description="Name of the model (e.g. 'xgboost_stock_model')")
    model_type: Optional[str] = Field(None, description="Model type (e.g. 'XGBClassifier', 'LogisticRegression')")
    predicted_direction: Optional[SignalDirection] = Field(None, description="Predicted price direction: UP or DOWN")
    probability: Optional[float] = Field(None, description="Confidence probability (0.0 to 1.0)")
    prediction_horizon: Optional[str] = Field("next_day_direction", description="Horizon for prediction")
    prediction_date: Optional[str] = Field(None, description="ISO timestamp of prediction calculation")
    feature_importance: Optional[Dict[str, float]] = Field(None, description="Feature weights from the trained model")
    model_performance: Optional[Dict[str, float]] = Field(None, description="Trained model metrics (Accuracy, ROC-AUC, F1)")

    status: str = Field("model_not_loaded", description="Operational status: 'ready' or 'model_not_loaded'")
    message: str = Field(
        "Model files not loaded. Please ensure trained artifacts are in backend/ml/ (xgboost_stock_model.pkl, logistic_regression_model.pkl, feature_scaler.pkl, model_config.json).",
        description="Detailed status message"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "TCS",
                "model_name": None,
                "model_type": None,
                "predicted_direction": None,
                "probability": None,
                "prediction_horizon": "next_day_direction",
                "prediction_date": None,
                "feature_importance": None,
                "model_performance": None,
                "status": "model_not_loaded",
                "message": "Model files not loaded. Please ensure trained artifacts are in backend/ml/ (xgboost_stock_model.pkl, logistic_regression_model.pkl, feature_scaler.pkl, model_config.json)."
            }
        }
