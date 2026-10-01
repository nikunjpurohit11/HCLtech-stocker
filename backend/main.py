"""
ASGI Application Entrypoint for Vercel and production runners.
Re-exports the FastAPI app instance from app.main.
"""
from app.main import app

__all__ = ["app"]
