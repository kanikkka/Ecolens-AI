from pydantic import BaseModel, Field


class PlaceResponse(BaseModel):
    name: str
    latitude: float
    longitude: float
    type: str | None
    osm_id: int | None


class RouteResponse(BaseModel):
    distance_km: float
    duration_minutes: float
    geometry: dict


class RouteRequest(BaseModel):
    start_latitude: float = Field(ge=-90, le=90)
    start_longitude: float = Field(ge=-180, le=180)

    end_latitude: float = Field(ge=-90, le=90)
    end_longitude: float = Field(ge=-180, le=180)
