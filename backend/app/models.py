from pydantic import BaseModel
from typing import List, Optional

class OverlookedItem(BaseModel):
    title: str
    severity: str
    detail: str

class WasteRecipe(BaseModel):
    pathway: str
    summary: str
    do_steps: List[str]
    dont_steps: List[str]
    safety_note: Optional[str] = None

class Destination(BaseModel):
    id: str
    name: str
    type: str
    distance_km: float
    address: str
    accepted_materials: List[str]
    verified_badge: str
    qr_code_id: str

class ScanResponse(BaseModel):
    passport_id: str
    product_name: str
    brand: str
    category: str
    confidence: float
    extracted_fields: dict
    material_info: dict
    overlooked: List[OverlookedItem]
    waste_recipe: WasteRecipe
    destinations: List[Destination]
    potential_credits: int
    estimated_co2_saved_kg: float
    status: str

class VerifyActionRequest(BaseModel):
    passport_id: str
    destination_id: str
    qr_token: str

class Mission(BaseModel):
    id: str
    title: str
    authority: str
    description: str
    deadline: str
    credits_reward: int
    participants: int
    progress_percent: int
    badge: str
