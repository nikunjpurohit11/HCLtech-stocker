# Machine Learning Models Directory (`backend/ml`)

This directory is designated for the trained machine learning model artifacts trained in Google Colab.

---

## Required Artifact Files

Place the following 4 files directly into this directory:

1. `xgboost_stock_model.pkl` — Trained XGBoost classifier (`XGBClassifier`)
2. `logistic_regression_model.pkl` — Trained Logistic Regression baseline model (`LogisticRegression`)
3. `feature_scaler.pkl` — Fitted feature standardizer/scaler (`StandardScaler` / `MinMaxScaler`)
4. `model_config.json` — Hyperparameters, feature schema, and validation metrics JSON

> **Note**: Do not commit large binary artifacts to public repositories without Git LFS.

---

## Feature Schema & Exact Ordering

The inference engine expects the following 12 input features in this exact sequence:

| Index | Feature Name | Description |
|:-----:|:-------------|:------------|
| 0 | `Adj Close` | Adjusted closing price (₹) |
| 1 | `Volume` | Daily traded share volume |
| 2 | `Daily_Return` | Percentage daily return $(P_t - P_{t-1}) / P_{t-1}$ |
| 3 | `SMA_20` | 20-period Simple Moving Average |
| 4 | `SMA_50` | 50-period Simple Moving Average |
| 5 | `SMA_200` | 200-period Simple Moving Average |
| 6 | `Momentum_10` | 10-day rate of price change / momentum |
| 7 | `Volatility_20` | 20-day rolling annualized standard deviation |
| 8 | `RSI_14` | 14-period Relative Strength Index |
| 9 | `MACD` | Moving Average Convergence Divergence |
| 10 | `Price_SMA20_Ratio` | Ratio of closing price to 20-day SMA ($P / SMA_{20}$) |
| 11 | `Price_SMA50_Ratio` | Ratio of closing price to 50-day SMA ($P / SMA_{50}$) |

---

## Target Definition & Task

- **Prediction Type**: `next_day_direction`
- **Target Logic**:
  $$\text{Next\_Day\_Return} = \frac{P_{t+1} - P_t}{P_t}$$
  $$\text{Target} = \begin{cases} 1 & \text{if } \text{Next\_Day\_Return} > 0 \ (\text{UP}) \\ 0 & \text{if } \text{Next\_Day\_Return} \le 0 \ (\text{DOWN}) \end{cases}$$
