import re
from dataclasses import dataclass


@dataclass
class ProductInfo:
    product_name: str | None
    mrp: float | None
    quantity: str | None
    expiry_date: str | None
    ingredients: list[str]
    allergens: list[str]
    fssai_number: str | None


ALLERGEN_KEYWORDS = {
    "milk",
    "whey",
    "soy",
    "soya",
    "peanut",
    "groundnut",
    "almond",
    "cashew",
    "gluten",
    "wheat",
    "egg",
    "fish",
    "mustard",
    "sesame",
}


def _find_mrp(text: str) -> float | None:
    patterns = [
        r"(?:MRP|M\.R\.P)\s*[:\-]?\s*(?:Rs\.?|₹)?\s*(\d+(?:\.\d+)?)",
        r"(?:Rs\.?|₹)\s*(\d+(?:\.\d+)?)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass

    return None


def _find_quantity(text: str) -> str | None:
    pattern = (
        r"\b(\d+(?:\.\d+)?\s*"
        r"(?:kg|g|mg|l|ml|litre|liter|litres|"
        r"liters|pcs|pieces))\b"
    )

    match = re.search(
        pattern,
        text,
        flags=re.IGNORECASE,
    )

    return match.group(1) if match else None


def _find_expiry(text: str) -> str | None:
    patterns = [
        r"(?:EXP|EXPIRY|USE\s*BY|BEST\s*BEFORE)"
        r"\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})",

        r"(?:EXP|EXPIRY|USE\s*BY|BEST\s*BEFORE)"
        r"\s*[:\-]?\s*([0-9]{1,2}[\/\-][0-9]{2,4})",

        r"(?:EXP|EXPIRY|USE\s*BY|BEST\s*BEFORE)"
        r"\s*[:\-]?\s*([A-Za-z]{3,9}\s*[0-9]{2,4})",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if match:
            return match.group(1).strip()

    return None


def _find_ingredients(text: str) -> list[str]:
    match = re.search(
        r"(?:INGREDIENTS?)\s*[:\-]\s*(.+?)(?:\n|$)",
        text,
        flags=re.IGNORECASE,
    )

    if not match:
        return []

    raw = match.group(1)

    ingredients = [
        item.strip()
        for item in re.split(r"[,;]", raw)
        if item.strip()
    ]

    return ingredients[:30]


def _find_allergens(text: str) -> list[str]:
    lowered = text.lower()

    found = []

    for allergen in sorted(ALLERGEN_KEYWORDS):
        if allergen in lowered:
            found.append(allergen)

    return found


def _find_fssai(text: str) -> str | None:
    patterns = [
        r"(?:FSSAI|FSSAI\s*NO|LICENSE\s*NO)"
        r"\s*[:\-]?\s*(\d{10,15})",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if match:
            return match.group(1)

    return None


def _find_product_name(text: str) -> str | None:
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return None

    ignored_keywords = [
        "mrp",
        "expiry",
        "ingredients",
        "fssai",
        "license",
        "net quantity",
        "best before",
        "use by",
    ]

    for line in lines[:8]:
        lowered = line.lower()

        if any(
            keyword in lowered
            for keyword in ignored_keywords
        ):
            continue

        if len(line) >= 3:
            return line[:255]

    return None


def extract_product_info(text: str) -> ProductInfo:
    if not text:
        return ProductInfo(
            product_name=None,
            mrp=None,
            quantity=None,
            expiry_date=None,
            ingredients=[],
            allergens=[],
            fssai_number=None,
        )

    return ProductInfo(
        product_name=_find_product_name(text),
        mrp=_find_mrp(text),
        quantity=_find_quantity(text),
        expiry_date=_find_expiry(text),
        ingredients=_find_ingredients(text),
        allergens=_find_allergens(text),
        fssai_number=_find_fssai(text),
    )
