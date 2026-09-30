from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str = Field("ok", description="API health status")
    service: str = Field("stock-trading-api", description="Service identifier")


@router.get("/health", response_model=HealthResponse)
async def get_health() -> HealthResponse:
    """
    Verifies that the FastAPI backend application is operational.
    """
    return HealthResponse(status="ok", service="stock-trading-api")
