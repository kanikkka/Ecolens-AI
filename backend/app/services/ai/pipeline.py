from app.services.ai.ocr.service import extract_text
from app.services.ai.product.extractor import extract_product_info
from app.services.ai.vision.service import analyze_image


def process_scan(image_path: str) -> dict:
    ocr_result = extract_text(image_path)

    raw_text = ocr_result.get("text", "")

    product_info = extract_product_info(raw_text)

    vision_result = analyze_image(image_path)

    return {
        "ocr": ocr_result,
        "product": {
            "product_name": product_info.product_name,
            "mrp": product_info.mrp,
            "quantity": product_info.quantity,
            "expiry_date": product_info.expiry_date,
            "ingredients": product_info.ingredients,
            "allergens": product_info.allergens,
            "fssai_number": product_info.fssai_number,
        },
        "vision": vision_result,
    }
