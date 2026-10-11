from pathlib import Path

from ultralytics import YOLO


MODEL_NAME = "yolo11n.pt"

_model = None


def get_model():
    global _model

    if _model is None:
        _model = YOLO(MODEL_NAME)

    return _model


def detect_objects(image_path: str) -> dict:
    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    model = get_model()

    results = model.predict(
        source=str(path),
        conf=0.35,
        verbose=False,
    )

    detections = []

    for result in results:
        names = result.names

        if result.boxes is None:
            continue

        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            xyxy = box.xyxy[0].tolist()

            detections.append(
                {
                    "label": names[class_id],
                    "confidence": round(confidence, 4),
                    "bounding_box": {
                        "x1": round(xyxy[0], 2),
                        "y1": round(xyxy[1], 2),
                        "x2": round(xyxy[2], 2),
                        "y2": round(xyxy[3], 2),
                    },
                }
            )

    return {
        "objects": detections,
        "model": MODEL_NAME,
    }
