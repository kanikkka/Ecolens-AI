from datetime import datetime
from pydantic import BaseModel


class ScanResponse(BaseModel):
    id: int
    user_id: int
    image_url: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
