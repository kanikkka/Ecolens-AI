from pydantic import BaseModel


class CollectionCenterResponse(BaseModel):
    id: int
    name: str
    center_type: str
    address: str
    city: str
    latitude: float
    longitude: float
    accepted_materials: str
    is_verified: bool
    is_active: bool

    model_config = {"from_attributes": True}
