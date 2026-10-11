from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_user
from app.db.session import get_db
from app.models.collection_center import CollectionCenter
from app.models.user import User
from app.schemas.collection_center import CollectionCenterResponse
from app.services.locations.distance import calculate_distance_km

router = APIRouter(
    prefix="/locations",
    tags=["Collection Locations"],
)


@router.get(
    "/nearby",
    response_model=list[CollectionCenterResponse],
)
def get_nearby_centers(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    material: str | None = Query(None),
    radius_km: float = Query(
        25,
        gt=0,
        le=100,
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    centers = db.scalars(
        select(CollectionCenter)
        .where(CollectionCenter.is_active == True)
    ).all()

    results = []

    for center in centers:

        if material:
            accepted = center.accepted_materials.lower()

            if material.lower() not in accepted:
                continue

        distance = calculate_distance_km(
            latitude,
            longitude,
            center.latitude,
            center.longitude,
        )

        if distance <= radius_km:
            results.append(
                (
                    distance,
                    center,
                )
            )

    results.sort(
        key=lambda item: item[0]
    )

    return [
        center
        for _, center in results
    ]
