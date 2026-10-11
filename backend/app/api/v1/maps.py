from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.v1.dependencies import get_current_user
from app.models.user import User
from app.schemas.map import (
    PlaceResponse,
    RouteRequest,
    RouteResponse,
)
from app.services.maps.service import (
    get_route,
    search_places,
)

router = APIRouter(
    prefix="/maps",
    tags=["Maps & Routing"],
)


@router.get(
    "/search",
    response_model=list[PlaceResponse],
)
def map_search(
    query: str = Query(
        ...,
        min_length=2,
        max_length=150,
    ),
    latitude: float | None = Query(
        None,
        ge=-90,
        le=90,
    ),
    longitude: float | None = Query(
        None,
        ge=-180,
        le=180,
    ),
    limit: int = Query(
        10,
        ge=1,
        le=20,
    ),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        return search_places(
            query=query,
            latitude=latitude,
            longitude=longitude,
            limit=limit,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Map search service unavailable",
        ) from exc


@router.post(
    "/route",
    response_model=RouteResponse,
)
def calculate_route(
    data: RouteRequest,
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        return get_route(
            start_latitude=data.start_latitude,
            start_longitude=data.start_longitude,
            end_latitude=data.end_latitude,
            end_longitude=data.end_longitude,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Routing service unavailable",
        ) from exc
