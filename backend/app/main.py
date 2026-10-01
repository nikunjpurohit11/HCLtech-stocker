from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from .core.config import settings
from .api.routes import (
    health_router,
    analytics_router,
    risk_router,
    predictions_router,
    backtesting_router,
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Quantitative Analytics, Institutional Risk, Machine Learning Inference, and Strategy Backtesting API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS configuration for React development frontend (Port 3000 / Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register API Route Handlers under /api
app.include_router(health_router, prefix=settings.API_PREFIX)
app.include_router(analytics_router, prefix=settings.API_PREFIX)
app.include_router(risk_router, prefix=settings.API_PREFIX)
app.include_router(predictions_router, prefix=settings.API_PREFIX)
app.include_router(backtesting_router, prefix=settings.API_PREFIX)


@app.on_event("startup")
async def on_startup():
    """
    Initializes ML inference artifacts and verifies provider connectivity on startup.
    """
    from .services.prediction_service import PredictionService
    PredictionService.load_artifacts()


@app.get("/", include_in_schema=False)
async def root():
    """
    Redirect root path to interactive Swagger documentation.
    """
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
