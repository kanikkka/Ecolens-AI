from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_user
from app.db.session import get_db
from app.models.scan import Scan
from app.models.user import User
from app.schemas.scan import ScanResponse


router = APIRouter(
    prefix="/scans",
    tags=["Scans"],
)


@router.get(
    "",
    response_model=list[ScanResponse],
)
def get_my_scans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    scans = db.scalars(
        select(Scan)
        .where(Scan.user_id == current_user.id)
        .order_by(Scan.created_at.desc())
    ).all()

    return scans
