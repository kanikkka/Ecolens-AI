from dataclasses import dataclass


@dataclass
class MaterialResult:
    material: str | None
    category: str | None
    confidence: float
    reasoning: str


# Initial knowledge layer.
# This is intentionally isolated so a trained ML model
# can replace it later without changing the API layer.

OBJECT_RULES = {
    "bottle": {
        "material": "PET",
        "category": "plastic",
        "confidence": 0.62,
        "reasoning": "Bottle detected; PET is a common beverage-bottle material.",
    },
    "cup": {
        "material": "PP",
        "category": "plastic",
        "confidence": 0.55,
        "reasoning": "Cup detected; polypropylene is a common reusable/disposable cup material.",
    },
    "plastic": {
        "material": "plastic",
        "category": "plastic",
        "confidence": 0.60,
        "reasoning": "Plastic object detected by the vision pipeline.",
    },
    "paper": {
        "material": "paper",
        "category": "paper",
        "confidence": 0.80,
        "reasoning": "Paper object detected.",
    },
    "cardboard": {
        "material": "cardboard",
        "category": "paper",
        "confidence": 0.82,
        "reasoning": "Cardboard object detected.",
    },
    "can": {
        "material": "aluminium",
        "category": "metal",
        "confidence": 0.72,
        "reasoning": "Can detected; aluminium is a common beverage-can material.",
    },
}


def classify_material(objects: list[dict]) -> MaterialResult:
    if not objects:
        return MaterialResult(
            material=None,
            category=None,
            confidence=0.0,
            reasoning="No supported object detected.",
        )

    best_match = None

    for obj in objects:
        label = obj.get("label", "").lower()
        detection_confidence = float(
            obj.get("confidence", 0.0)
        )

        rule = OBJECT_RULES.get(label)

        if rule is None:
            continue

        combined_confidence = (
            rule["confidence"] * 0.6
            + detection_confidence * 0.4
        )

        candidate = {
            **rule,
            "confidence": round(
                min(combined_confidence, 0.99),
                4,
            ),
        }

        if (
            best_match is None
            or candidate["confidence"]
            > best_match["confidence"]
        ):
            best_match = candidate

    if best_match is None:
        return MaterialResult(
            material="unknown",
            category="unknown",
            confidence=0.0,
            reasoning=(
                "Object detected, but the current material "
                "knowledge layer cannot determine its material reliably."
            ),
        )

    return MaterialResult(
        material=best_match["material"],
        category=best_match["category"],
        confidence=best_match["confidence"],
        reasoning=best_match["reasoning"],
    )
