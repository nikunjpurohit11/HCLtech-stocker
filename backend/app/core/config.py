import os
from pathlib import Path
from typing import List

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    PROJECT_NAME: str = os.getenv(
        "PROJECT_NAME",
        "Advanced Stock Trading & Portfolio Management Platform API"
    )
    VERSION: str = "1.0.0"
    API_PREFIX: str = os.getenv("API_PREFIX", "/api")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Allowed CORS Origins for React development frontend
    # Development defaults to localhost port 3000 and 5173 (standard Vite ports)
    _default_cors = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        origins = list(self._default_cors)
        origins_env = os.getenv("CORS_ORIGINS")
        if origins_env:
            origins.extend([o.strip() for o in origins_env.split(",") if o.strip()])
        vercel_url = os.getenv("VERCEL_URL")
        if vercel_url:
            origins.append(f"https://{vercel_url}")
        prod_url = os.getenv("VERCEL_PROJECT_PRODUCTION_URL")
        if prod_url:
            origins.append(f"https://{prod_url}")
        return list(dict.fromkeys(origins))

    # Machine learning artifacts directory
    ML_MODELS_DIR: Path = Path(os.getenv("ML_MODELS_DIR", str(BASE_DIR / "ml")))

    # Market Data Provider selection: "yahoo_finance" or "unconfigured"
    MARKET_DATA_PROVIDER: str = os.getenv("MARKET_DATA_PROVIDER", "yahoo_finance")


settings = Settings()
