from pathlib import Path

from app.models.ai.yolo_service import detect_objects
from app.services.ai.material.classifier import classify_material


def analyze_image(image_path: str) -> dict:
    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    detection_result = detect_objects(image_path)

    objects = detection_result["objects"]

    material_result = classify_material(objects)

    return {
        "objects": objects,
        "material": material_result.material,
        "category": material_result.category,
        "confidence": material_result.confidence,
        "reasoning": material_result.reasoning,
        "model": detection_result["model"],
    }
