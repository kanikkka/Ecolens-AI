from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
def get_status():
    return {
        "status": "ok",
        "service": "EcoLens AI API",
        "version": "0.1.0",
    }
