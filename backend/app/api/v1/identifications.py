from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_user
from app.db.session import get_db
from app.models.product import ProductIdentification
from app.models.scan import Scan
from app.models.user import User
from app.schemas.product import IdentificationResponse

router = APIRouter(
    prefix="/identifications",
    tags=["AI Identification"],
)


@router.get(
    "/scan/{scan_id}",
    response_model=IdentificationResponse,
)
def get_scan_identification(
    scan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    scan = db.scalar(
        select(Scan).where(
            Scan.id == scan_id,
            Scan.user_id == current_user.id,
        )
    )

    if scan is None:
        raise HTTPException(
            status_code=404,
            detail="Scan not found",
        )

    result = db.scalar(
        select(ProductIdentification)
        .where(ProductIdentification.scan_id == scan_id)
        .order_by(ProductIdentification.created_at.desc())
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="AI identification is not available yet",
        )

    return result
