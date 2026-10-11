from pydantic import BaseModel


class ActionRecommendationResponse(BaseModel):
    primary_action: str
    alternative_action: str | None

    title: str
    summary: str

    steps: list[str]
    warnings: list[str]

    reason: str
    confidence: float
