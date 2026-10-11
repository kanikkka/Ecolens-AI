from fastapi import APIRouter

from app.api.v1.actions import router as actions_router
from app.api.v1.auth import router as auth_router
from app.api.v1.identifications import router as identification_router
from app.api.v1.locations import router as locations_router
from app.api.v1.maps import router as maps_router
from app.api.v1.scans import router as scans_router
from app.api.v1.status import router as status_router

api_router = APIRouter()

api_router.include_router(
    status_router,
    prefix="/api/v1",
)

api_router.include_router(
    auth_router,
    prefix="/api/v1",
)

api_router.include_router(
    scans_router,
    prefix="/api/v1",
)

api_router.include_router(
    identification_router,
    prefix="/api/v1",
)

api_router.include_router(
    actions_router,
    prefix="/api/v1",
)

api_router.include_router(
    locations_router,
    prefix="/api/v1",
)

api_router.include_router(
    maps_router,
    prefix="/api/v1",
)
