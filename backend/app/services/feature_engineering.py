import logging
from typing import Dict, List, Optional
import numpy as np
import pandas as pd

from ..schemas.predictions import ML_FEATURE_NAMES

logger = logging.getLogger(__name__)


def compute_technical_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Reproduces the exact 12-feature feature engineering pipeline from the Colab model training:
    1. Adj Close: Split and dividend-adjusted closing price
    2. Volume: Trading volume
    3. Daily_Return: 1-day percentage price change
    4. SMA_20: 20-day Simple Moving Average
    5. SMA_50: 50-day Simple Moving Average
    6. SMA_200: 200-day Simple Moving Average
    7. Momentum_10: 10-day rate of change momentum
    8. Volatility_20: 20-day rolling return volatility (std)
    9. RSI_14: 14-day Relative Strength Index
    10. MACD: Moving Average Convergence Divergence (EMA12 - EMA26)
    11. Price_SMA20_Ratio: Current Price to 20 SMA ratio
    12. Price_SMA50_Ratio: Current Price to 50 SMA ratio
    """
    if df is None or df.empty:
        raise ValueError("Input DataFrame is empty or None")

    if "Adj Close" not in df.columns and "Close" in df.columns:
        logger.warning("'Adj Close' not in columns; using 'Close' as fallback.")
        df = df.copy()
        df["Adj Close"] = df["Close"]

    if "Adj Close" not in df.columns:
        raise ValueError("DataFrame must contain 'Adj Close' column for feature calculation.")

    df_calc = df.copy()
    if "Date" in df_calc.columns:
        df_calc = df_calc.sort_values("Date").reset_index(drop=True)

    adj_close = df_calc["Adj Close"].astype(float)
    volume = df_calc["Volume"].astype(float) if "Volume" in df_calc.columns else pd.Series(0.0, index=df_calc.index)

    # 1. Daily Return
    daily_return = adj_close.pct_change()

    # 2. Moving Averages
    sma_20 = adj_close.rolling(window=20, min_periods=1).mean()
    sma_50 = adj_close.rolling(window=50, min_periods=1).mean()
    sma_200 = adj_close.rolling(window=200, min_periods=1).mean()

    # 3. Momentum (10-day price ratio)
    momentum_10 = (adj_close / adj_close.shift(10).replace(0, np.nan)) - 1.0
    momentum_10 = momentum_10.fillna(0.0)

    # 4. Volatility (20-day rolling std of daily returns)
    volatility_20 = daily_return.rolling(window=20, min_periods=1).std().fillna(0.0)

    # 5. RSI 14
    delta = adj_close.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    avg_gain = gain.rolling(window=14, min_periods=1).mean()
    avg_loss = loss.rolling(window=14, min_periods=1).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi_14 = 100.0 - (100.0 / (1.0 + rs))
    rsi_14 = rsi_14.fillna(50.0)

    # 6. MACD (EMA12 - EMA26)
    ema_12 = adj_close.ewm(span=12, adjust=False).mean()
    ema_26 = adj_close.ewm(span=26, adjust=False).mean()
    macd = ema_12 - ema_26

    # 7. Price / SMA Ratios
    price_sma20_ratio = adj_close / sma_20.replace(0, np.nan)
    price_sma50_ratio = adj_close / sma_50.replace(0, np.nan)

    # Assemble structured DataFrame matching ML_FEATURE_NAMES exactly
    features_df = pd.DataFrame({
        "Adj Close": adj_close,
        "Volume": volume,
        "Daily_Return": daily_return.fillna(0.0),
        "SMA_20": sma_20,
        "SMA_50": sma_50,
        "SMA_200": sma_200,
        "Momentum_10": momentum_10,
        "Volatility_20": volatility_20,
        "RSI_14": rsi_14,
        "MACD": macd,
        "Price_SMA20_Ratio": price_sma20_ratio.fillna(1.0),
        "Price_SMA50_Ratio": price_sma50_ratio.fillna(1.0),
    })

    # Enforce exact column ordering as required by model_config.json
    return features_df[ML_FEATURE_NAMES]


def extract_latest_feature_dict(df: pd.DataFrame) -> Dict[str, float]:
    """
    Computes technical features from historical OHLCV and extracts the latest
    available row formatted as a clean dictionary ready for XGBoost inference.
    """
    features_df = compute_technical_features(df)
    latest_row = features_df.iloc[-1]
    return {col: float(latest_row[col]) for col in ML_FEATURE_NAMES}
