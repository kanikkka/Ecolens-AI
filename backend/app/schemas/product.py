from datetime import datetime

from pydantic import BaseModel


class IdentificationResponse(BaseModel):
    id: int
    scan_id: int

    product_name: str | None
    category: str | None
    material: str | None

    confidence: float | None
    raw_text: str | None
    ai_model: str | None
    reasoning: str | None

    mrp: float | None
    quantity: str | None
    expiry_date: str | None

    ingredients: list | None
    allergens: list | None

    fssai_number: str | None

    created_at: datetime

    model_config = {"from_attributes": True}
