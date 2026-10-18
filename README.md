[![Architecture diagram of nikunjpurohit11/hcltech-stocker](https://gitdiagram.com/nikunjpurohit11/hcltech-stocker/diagram.png)](https://gitdiagram.com/nikunjpurohit11/hcltech-stocker?utm_source=readme&utm_medium=picture)
# Vertex Capital Terminal (HCLTech-Stocker)

![Vertex Capital Terminal](https://img.shields.io/badge/Platform-Active-success)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Machine Learning](https://img.shields.io/badge/ML-XGBoost%20%2B%20Scikit--Learn-F37626)
![Deployment](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)

Vertex Capital Terminal is an advanced, full-stack stock trading and portfolio management platform. It integrates a high-performance React UI with a Python-powered machine learning backend to deliver real-time market data, risk analytics, and AI-driven next-day directional stock predictions.

## 🚀 Key Features

*   **AI-Driven Market Insights:** Next-day stock direction predictions (UP/DOWN) powered by a highly tuned XGBoost classifier.
*   **Real-Time Portfolio Dashboard:** Track portfolio valuation, daily P&L, Sharpe ratio, and sector allocations.
*   **Strategy Lab & Risk Analytics:** Backtest trading strategies and analyze maximum drawdown, volatility, and benchmark outperformance.
*   **Robust Backend Architecture:** Self-contained FastAPI backend with built-in fallbacks, requiring zero complex environment configuration to boot.
*   **Secure Authentication:** User sessions and portfolio data securely managed via Supabase.

## 🧠 Machine Learning Pipeline

The prediction engine is located in the `backend/ml/` directory and utilizes a custom-trained model evaluating 12 key technical indicators:
1. `Adj Close`
2. `Volume`
3. `Daily_Return`
4. `SMA_20` & `SMA_50` & `SMA_200`
5. `Momentum_10`
6. `Volatility_20`
7. `RSI_14`
8. `MACD`
9. `Price_SMA20_Ratio`
10. `Price_SMA50_Ratio`

**Inference Flow:** 
Incoming API payloads are strictly validated using Pydantic, processed through a fitted `StandardScaler`, and evaluated by the `XGBClassifier` to return a directional signal and confidence probability.

## 🛠️ Technology Stack

**Frontend:**
*   React 18 + Vite
*   TypeScript
*   Tailwind CSS
*   Supabase Client (Auth/Database)

**Backend:**
*   Python 3.10+
*   FastAPI & Uvicorn
*   Pandas & NumPy
*   Scikit-Learn & XGBoost

## ⚙️ Local Development Setup

The platform is divided into a frontend web app and a backend API. 

### 1. Clone the Repository
```bash
git clone [https://github.com/nikunjpurohit11/HCLtech-stocker.git](https://github.com/nikunjpurohit11/HCLtech-stocker.git)
cd HCLtech-stocker
