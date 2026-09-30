"""
API Routes Modules
"""
from .health import router as health_router
from .analytics import router as analytics_router
from .risk import router as risk_router
from .predictions import router as predictions_router
from .backtesting import router as backtesting_router

__all__ = [
    "health_router",
    "analytics_router",
    "risk_router",
    "predictions_router",
    "backtesting_router",
]
