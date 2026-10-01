from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.responses import JSONResponse, RedirectResponse

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


# Also expose interactive docs and openapi schema under /api prefix for Vercel /api rewrites
@app.get("/api/docs", include_in_schema=False)
async def api_docs():
    return get_swagger_ui_html(
        openapi_url="/api/openapi.json",
        title=f"{settings.PROJECT_NAME} - Swagger UI",
    )


@app.get("/api/redoc", include_in_schema=False)
async def api_redoc():
    return get_redoc_html(
        openapi_url="/api/openapi.json",
        title=f"{settings.PROJECT_NAME} - ReDoc",
    )


@app.get("/api/openapi.json", include_in_schema=False)
async def api_openapi():
    return JSONResponse(app.openapi())


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
