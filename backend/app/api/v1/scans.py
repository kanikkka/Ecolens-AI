from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.v1.dependencies import get_current_user
from app.db.session import get_db
from app.models.product import ProductIdentification
from app.models.scan import Scan
from app.models.user import User
from app.schemas.scan import ScanResponse
from app.services.ai.pipeline import process_scan

router = APIRouter(prefix="/scans", tags=["Scans"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_FILE_SIZE = 10 * 1024 * 1024


@router.post(
    "/upload",
    response_model=ScanResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_scan(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are supported.",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be smaller than 10 MB.",
        )

    extension = ALLOWED_TYPES[file.content_type]
    filename = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

    file_path.write_bytes(content)

    scan = Scan(
        user_id=current_user.id,
        image_url=f"/uploads/{filename}",
        status="processing",
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    try:
        ai_result = process_scan(str(file_path))

        ocr_result = ai_result["ocr"]
        product_info = ai_result["product"]
        vision_result = ai_result["vision"]

        identification = ProductIdentification(
            scan_id=scan.id,

            product_name=product_info.get(
                "product_name"
            ),

            category=vision_result.get(
                "category"
            ),

            material=vision_result.get(
                "material"
            ),

            confidence=vision_result.get(
                "confidence"
            ),

            raw_text=ocr_result.get(
                "text"
            ),

            ai_model=vision_result.get(
                "model"
            ),

            reasoning=vision_result.get(
                "reasoning"
            ),

            mrp=product_info.get(
                "mrp"
            ),

            quantity=product_info.get(
                "quantity"
            ),

            expiry_date=product_info.get(
                "expiry_date"
            ),

            ingredients=product_info.get(
                "ingredients"
            ),

            allergens=product_info.get(
                "allergens"
            ),

            fssai_number=product_info.get(
                "fssai_number"
            ),
        )

        db.add(identification)

        scan.status = "completed"

        db.commit()
        db.refresh(scan)

        return scan

    except Exception as exc:
        scan.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(exc)}",
        )


@router.get("", response_model=list[ScanResponse])
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
