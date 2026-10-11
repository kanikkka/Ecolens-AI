from pathlib import Path
import os

import cv2
import pytesseract


TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
TESSDATA_DIR = Path(__file__).resolve().parents[4] / "tessdata"

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

os.environ["TESSDATA_PREFIX"] = str(TESSDATA_DIR)


def _preprocess_image(image_path: str):
    image = cv2.imread(image_path)

    if image is None:
        raise FileNotFoundError(
            f"Unable to read image: {image_path}"
        )

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY,
    )

    gray = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC,
    )

    gray = cv2.GaussianBlur(
        gray,
        (3, 3),
        0,
    )

    processed = cv2.threshold(
        gray,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU,
    )[1]

    return processed


def extract_text(image_path: str) -> dict:
    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    trained_data = TESSDATA_DIR / "eng.traineddata"

    if not trained_data.exists():
        raise FileNotFoundError(
            f"English OCR data not found: {trained_data}"
        )

    processed_image = _preprocess_image(
        str(path)
    )

    text = pytesseract.image_to_string(
        processed_image,
        lang="eng",
        config="--psm 6",
    )

    cleaned_text = "\n".join(
        line.strip()
        for line in text.splitlines()
        if line.strip()
    )

    return {
        "text": cleaned_text,
        "engine": "tesseract",
        "version": str(
            pytesseract.get_tesseract_version()
        ),
    }
