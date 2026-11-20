import uuid
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import ScanResponse, VerifyActionRequest
from .data import DESTINATIONS, SAMPLE_CATALOG, MISSIONS

app = FastAPI(
    title="EcoLens AI API",
    description="Scan • Understand • Act • Earn • Impact — Environmental Intelligence Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PASSPORTS = {}
USER_STATE = {
    "user_name": "Kanika Rajput",
    "family_name": "Rajput Household",
    "green_credits": 240,
    "items_routed": 14,
    "co2_saved_kg": 4.85,
    "plastic_diverted_kg": 1.62,
    "ewaste_routed_count": 2,
    "streak_days": 6,
    "badges": ["Early Eco-Adopter", "PET Recycler"],
    "history": [
        {
            "passport_id": "EL-2026-8812",
            "product_name": "Glass Sauce Bottle (500g)",
            "pathway": "REUSE",
            "status": "VERIFIED",
            "credits_earned": 40,
            "timestamp": "2026-11-19 17:30"
        },
        {
            "passport_id": "EL-2026-8904",
            "product_name": "Old Smartphone Charger",
            "pathway": "SAFE DISPOSAL",
            "status": "VERIFIED",
            "credits_earned": 75,
            "timestamp": "2026-11-20 11:15"
        }
    ]
}


def _match_destinations(category: str, material: str):
    cat_lower = (category + " " + material).lower()
    if "battery" in cat_lower or "e-waste" in cat_lower or "lithium" in cat_lower:
        return [d for d in DESTINATIONS if d.id in ["dest-1", "dest-2"]]
    if "food" in cat_lower or "biscuit" in cat_lower:
        return [d for d in DESTINATIONS if d.id in ["dest-4", "dest-2", "dest-3"]]
    return [d for d in DESTINATIONS if d.id in ["dest-2", "dest-3"]]


@app.get("/")
def root():
    return {"message": "EcoLens AI Backend Running", "version": "1.0.0"}


@app.post("/api/scan", response_model=ScanResponse)
async def scan_item(
    sample_key: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    selected_key = "pet_bottle"

    if sample_key and sample_key in SAMPLE_CATALOG:
        selected_key = sample_key
    elif file and file.filename:
        fname = file.filename.lower()
        if any(w in fname for w in ["batt", "power", "ewaste", "phone", "charger", "lithium"]):
            selected_key = "li_ion_battery"
        elif any(w in fname for w in ["chip", "snack", "packet", "wrapper", "lays", "kurkure"]):
            selected_key = "chips_mlp"
        elif any(w in fname for w in ["biscuit", "food", "box", "expir", "milk", "bread"]):
            selected_key = "expired_biscuits"
        else:
            selected_key = "pet_bottle"

    item = SAMPLE_CATALOG[selected_key]
    passport_id = f"EL-2026-{uuid.uuid4().hex[:4].upper()}"
    matched_dests = _match_destinations(item["category"], item["material_info"]["primary_material"])

    scan_result = ScanResponse(
        passport_id=passport_id,
        product_name=item["product_name"],
        brand=item["brand"],
        category=item["category"],
        confidence=item["confidence"],
        extracted_fields=item["extracted_fields"],
        material_info=item["material_info"],
        overlooked=item["overlooked"],
        waste_recipe=item["waste_recipe"],
        destinations=matched_dests,
        potential_credits=item["potential_credits"],
        estimated_co2_saved_kg=item["estimated_co2_saved_kg"],
        status="IDENTIFIED • AWAITING VERIFIED ACTION"
    )

    PASSPORTS[passport_id] = scan_result.model_dump()
    return scan_result


@app.post("/api/verify")
def verify_disposal_action(payload: VerifyActionRequest):
    passport = PASSPORTS.get(payload.passport_id)
    if not passport:
        raise HTTPException(status_code=404, detail="Disposal Passport not found. Scan an item first.")

    if passport["status"].startswith("VERIFIED"):
        return {
            "verified": True,
            "message": "Action already verified for this Disposal Passport.",
            "passport": passport,
            "user_state": USER_STATE
        }

    dest = next((d for d in DESTINATIONS if d.id == payload.destination_id), None)
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found.")

    if payload.qr_token.strip().upper() != dest.qr_code_id:
        raise HTTPException(status_code=400, detail=f"Invalid QR Token. Expected token for {dest.name}: {dest.qr_code_id}")

    credits = passport["potential_credits"]
    co2 = passport["estimated_co2_saved_kg"]

    passport["status"] = f"VERIFIED AT {dest.name.upper()}"
    USER_STATE["green_credits"] += credits
    USER_STATE["items_routed"] += 1
    USER_STATE["co2_saved_kg"] = round(USER_STATE["co2_saved_kg"] + co2, 2)

    if "E-Waste" in passport["category"]:
        USER_STATE["ewaste_routed_count"] += 1
        if "E-Waste Guardian" not in USER_STATE["badges"]:
            USER_STATE["badges"].append("E-Waste Guardian")
    else:
        USER_STATE["plastic_diverted_kg"] = round(USER_STATE["plastic_diverted_kg"] + 0.08, 2)

    USER_STATE["history"].insert(0, {
        "passport_id": payload.passport_id,
        "product_name": passport["product_name"],
        "pathway": passport["waste_recipe"]["pathway"],
        "status": "VERIFIED",
        "credits_earned": credits,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
    })

    return {
        "verified": True,
        "message": f"Verified via {dest.verified_badge}! +{credits} Green Credits awarded.",
        "credits_earned": credits,
        "passport": passport,
        "user_state": USER_STATE
    }


@app.get("/api/dashboard")
def get_user_dashboard():
    return USER_STATE


@app.get("/api/missions")
def get_missions():
    return {"missions": [m.model_dump() for m in MISSIONS]}


@app.get("/api/gov-analytics")
def get_government_analytics():
    return {
        "city": "SAS Nagar (Mohali), Punjab",
        "total_scans_30d": 48920,
        "verified_actions_30d": 31450,
        "verification_rate_percent": 64.3,
        "estimated_waste_diverted_tons": 18.4,
        "ewaste_safely_routed_units": 2190,
        "category_breakdown": [
            {"category": "PET & HDPE Plastics (#1, #2)", "scans": 18400, "routed_correctly_pct": 78},
            {"category": "Multi-Layer Plastic (MLP #7)", "scans": 14200, "routed_correctly_pct": 41},
            {"category": "E-Waste & Li-Ion Batteries", "scans": 5120, "routed_correctly_pct": 69},
            {"category": "Organic / Expired Food", "scans": 7300, "routed_correctly_pct": 62},
            {"category": "Paper, Glass & Metal", "scans": 3900, "routed_correctly_pct": 85}
        ],
        "infrastructure_gaps": [
            {
                "ward": "Ward 19 (Landran - Kharar Belt)",
                "issue": "High MLP (#7) & E-Waste scan volume, zero authorized drop-off within 3 km",
                "priority": "HIGH"
            },
            {
                "ward": "Ward 08 (Phase 7 Market)",
                "issue": "Frequent Wrong-Bin alerts for commercial beverage bottles",
                "priority": "MEDIUM"
            }
        ],
        "community_leaderboard": [
            {"rank": 1, "name": "CGC Landran Eco-Warriors", "type": "College Club", "credits": 18450},
            {"rank": 2, "name": "Sector 70 Green RWA", "type": "Residential Society", "credits": 15920},
            {"rank": 3, "name": "Rajput Household", "type": "Family", "credits": 3420 + USER_STATE["green_credits"]}
        ]
    }
