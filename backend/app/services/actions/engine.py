from dataclasses import dataclass


@dataclass
class ActionRecommendation:
    primary_action: str
    alternative_action: str | None
    title: str
    summary: str
    steps: list[str]
    warnings: list[str]
    reason: str
    confidence: float


MATERIAL_ACTIONS = {
    "PET": {
        "primary": "recycle",
        "alternative": "reuse",
        "title": "Recycle this PET bottle",
        "summary": (
            "Clean the bottle and send it to a verified "
            "plastic recycling or collection point."
        ),
        "steps": [
            "Empty the bottle completely.",
            "Rinse it if possible.",
            "Keep the bottle dry before collection.",
            "Separate the cap if your local collector requires it.",
            "Send it to a verified plastic collection point.",
        ],
        "warnings": [
            "Do not burn the bottle.",
            "Do not mix it with wet organic waste.",
        ],
        "reason": (
            "PET is commonly recyclable when collected and "
            "sorted through the appropriate waste stream."
        ),
        "confidence": 0.88,
    },

    "PP": {
        "primary": "recycle",
        "alternative": "reuse",
        "title": "Recycle this polypropylene item",
        "summary": (
            "Check local collection availability before sending "
            "the item for recycling."
        ),
        "steps": [
            "Remove remaining contents.",
            "Clean and dry the item.",
            "Check whether your local recycler accepts PP.",
            "Place it in the appropriate collection stream.",
        ],
        "warnings": [
            "Do not burn plastic.",
        ],
        "reason": (
            "Polypropylene can be recyclable, but acceptance "
            "depends on local collection infrastructure."
        ),
        "confidence": 0.78,
    },

    "paper": {
        "primary": "recycle",
        "alternative": "reuse",
        "title": "Recycle this paper item",
        "summary": (
            "Keep paper clean and dry before placing it "
            "in the paper recycling stream."
        ),
        "steps": [
            "Remove food or liquid contamination.",
            "Keep the paper dry.",
            "Remove non-paper attachments when practical.",
            "Place it in the paper recycling stream.",
        ],
        "warnings": [
            "Wet or heavily contaminated paper may not be recyclable.",
        ],
        "reason": (
            "Clean and dry paper is generally suitable for "
            "paper recycling."
        ),
        "confidence": 0.90,
    },

    "cardboard": {
        "primary": "recycle",
        "alternative": "reuse",
        "title": "Recycle this cardboard",
        "summary": (
            "Flatten clean cardboard and send it through "
            "the appropriate paper/cardboard collection stream."
        ),
        "steps": [
            "Remove plastic or other non-cardboard parts.",
            "Flatten the cardboard.",
            "Keep it dry.",
            "Send it to a paper/cardboard collector.",
        ],
        "warnings": [
            "Oil-soaked or heavily contaminated cardboard may not be recyclable.",
        ],
        "reason": (
            "Clean cardboard is commonly accepted in paper recycling."
        ),
        "confidence": 0.91,
    },

    "aluminium": {
        "primary": "recycle",
        "alternative_action": None,
        "title": "Recycle this aluminium item",
        "summary": (
            "Empty and clean the aluminium container before "
            "sending it to a metal collection stream."
        ),
        "steps": [
            "Empty the container.",
            "Rinse if necessary.",
            "Keep it separate from wet waste.",
            "Send it to a verified metal recycler or collection point.",
        ],
        "warnings": [
            "Do not burn or melt the item yourself.",
        ],
        "reason": (
            "Aluminium is highly recyclable when properly collected."
        ),
        "confidence": 0.93,
    },
}


def get_action_recommendation(
    material: str | None,
    category: str | None,
) -> ActionRecommendation:

    normalized_material = (
        material.strip().lower()
        if material
        else ""
    )

    material_key = None

    for key in MATERIAL_ACTIONS:
        if key.lower() == normalized_material:
            material_key = key
            break

    if material_key:
        rule = MATERIAL_ACTIONS[material_key]

        return ActionRecommendation(
            primary_action=rule["primary"],
            alternative_action=rule.get("alternative")
            or rule.get("alternative_action"),
            title=rule["title"],
            summary=rule["summary"],
            steps=rule["steps"],
            warnings=rule["warnings"],
            reason=rule["reason"],
            confidence=rule["confidence"],
        )

    # Safe fallback when material is unknown.
    return ActionRecommendation(
        primary_action="verify",
        alternative_action=None,
        title="Verify the material before disposing",
        summary=(
            "The material could not be identified reliably. "
            "Do not guess the disposal method."
        ),
        steps=[
            "Check the packaging material symbol.",
            "Look for local recycling instructions.",
            "Use a verified collection centre if available.",
            "Avoid burning or dumping the item.",
        ],
        warnings=[
            "Do not dispose of an unknown material based only on appearance.",
        ],
        reason=(
            "EcoLens could not identify the material with sufficient confidence."
        ),
        confidence=0.0,
    )
