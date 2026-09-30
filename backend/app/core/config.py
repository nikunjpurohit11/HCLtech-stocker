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
        origins_env = os.getenv("CORS_ORIGINS")
        if origins_env:
            return [o.strip() for o in origins_env.split(",") if o.strip()]
        return self._default_cors

    # Machine learning artifacts directory
    ML_MODELS_DIR: Path = Path(os.getenv("ML_MODELS_DIR", str(BASE_DIR / "ml")))


settings = Settings()
