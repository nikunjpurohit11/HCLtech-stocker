# Advanced Stock Trading & Portfolio Management Platform — FastAPI Backend

Institutional Quantitative Analytics, Risk Engine, Machine Learning Inference, and Strategy Backtesting API service built with FastAPI.

---

## Architecture Overview

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI application entry point with CORS
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py               # Application settings and environment configuration
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── analytics.py            # Pydantic schemas for quantitative analytics
│   │   ├── risk.py                 # Pydantic schemas for portfolio risk
│   │   ├── predictions.py          # Pydantic schemas for ML directional signals
│   │   └── backtesting.py          # Pydantic schemas for strategy backtesting
│   ├── services/
│   │   ├── __init__.py
│   │   ├── analytics_service.py    # Analytics computational service layer
│   │   ├── risk_service.py         # Institutional risk service layer
│   │   ├── prediction_service.py   # Machine learning inference service layer
│   │   └── backtest_service.py     # Vectorized backtesting service layer
│   └── api/
│       ├── __init__.py
│       └── routes/
│           ├── __init__.py
│           ├── health.py           # Healthcheck endpoint (/api/health)
│           ├── analytics.py        # Analytics endpoint (/api/analytics/stock/{symbol})
│           ├── risk.py             # Risk endpoint (/api/risk/portfolio)
│           ├── predictions.py      # ML prediction endpoint (/api/predictions/{symbol})
│           └── backtesting.py      # Backtest run endpoint (/api/backtesting/run)
├── ml/
│   └── README.md                   # Model artifact specifications (Colab models)
├── requirements.txt                # Python dependencies
└── README.md                       # Backend documentation (this file)
```

---

## Quickstart & Installation

### 1. Prerequisites
- Python 3.10+ (Recommended Python 3.11+)
- `pip` and `virtualenv`

### 2. Setup Virtual Environment

Navigate to the `backend/` directory:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Running the Development Server

From inside the `backend/` directory:

```bash
uvicorn app.main:app --reload --port 8000
```

The service will start on `http://127.0.0.1:8000`.

---

## Interactive API Documentation

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **OpenAPI Schema**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

---

## API Endpoints

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/api/health` | Health verification returning operational status |
| `GET` | `/api/analytics/stock/{symbol}` | Statistical metrics: return, volatility, Sharpe, Sortino, VaR 95%, Beta, CAGR |
| `GET` | `/api/risk/portfolio` | Institutional portfolio risk metrics: VaR 95%, max drawdown, stress loss |
| `GET` | `/api/predictions/{symbol}` | ML next-day directional prediction (UP / DOWN) and probability |
| `POST` | `/api/backtesting/run` | Strategy backtest execution (`MA_CROSSOVER`, `RSI`, `BOLLINGER`, `ML_MOMENTUM`) |

### Health Check Example

```bash
curl http://127.0.0.1:8000/api/health
```

Response:
```json
{
  "status": "ok",
  "service": "stock-trading-api"
}
```

---

## Machine Learning Integration (`backend/ml/`)

Trained models from Google Colab are placed in `backend/ml/`:
- `xgboost_stock_model.pkl`
- `logistic_regression_model.pkl`
- `feature_scaler.pkl`
- `model_config.json`

If files are not present, the prediction endpoint safely returns status `model_not_loaded` with diagnostic instructions without breaking runtime execution.

---

## Roadmap & Next Stages

1. **Stage 1 (Completed)**: Clean FastAPI architecture, typed Pydantic models, CORS configuration, and endpoints foundation.
2. **Stage 2**: Load Colab ML model weights and execute real feature inference pipeline.
3. **Stage 3**: Connect historical OHLCV data pipeline for live quantitative analytics calculations.
4. **Stage 4**: Implement vectorized backtesting simulation engine over historical market price series.
5. **Stage 5**: Connect frontend client services to FastAPI endpoints with secure authentication headers.
