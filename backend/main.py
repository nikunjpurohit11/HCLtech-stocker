"""
ASGI Application Entrypoint for Vercel and production runners.
Re-exports the FastAPI app instance from app.main.
"""
import sys
from pathlib import Path

_backend_root = Path(__file__).resolve().parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from app.main import app

__all__ = ["app"]

