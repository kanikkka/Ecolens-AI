import json
from urllib.parse import quote
from urllib.request import Request, urlopen


USER_AGENT = "EcoLensAI/0.1"

NOMINATIM_URL = (
    "https://nominatim.openstreetmap.org/search"
)

OSRM_URL = (
    "https://router.project-osrm.org/route/v1/driving"
)


def search_places(
    query: str,
    latitude: float | None = None,
    longitude: float | None = None,
    limit: int = 10,
) -> list[dict]:

    params = (
        f"?q={quote(query)}"
        f"&format=json"
        f"&limit={limit}"
        f"&countrycodes=in"
    )

    if latitude is not None and longitude is not None:
        params += (
            f"&lat={latitude}"
            f"&lon={longitude}"
            f"&bounded=0"
        )

    request = Request(
        NOMINATIM_URL + params,
        headers={
            "User-Agent": USER_AGENT,
        },
    )

    with urlopen(
        request,
        timeout=15,
    ) as response:

        data = json.loads(
            response.read().decode("utf-8")
        )

    return [
        {
            "name": item.get("display_name"),
            "latitude": float(item["lat"]),
            "longitude": float(item["lon"]),
            "type": item.get("type"),
            "osm_id": item.get("osm_id"),
        }
        for item in data
    ]


def get_route(
    start_latitude: float,
    start_longitude: float,
    end_latitude: float,
    end_longitude: float,
) -> dict:

    coordinates = (
        f"{start_longitude},{start_latitude};"
        f"{end_longitude},{end_latitude}"
    )

    url = (
        f"{OSRM_URL}/{coordinates}"
        "?overview=full"
        "&geometries=geojson"
    )

    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
        },
    )

    with urlopen(
        request,
        timeout=15,
    ) as response:

        data = json.loads(
            response.read().decode("utf-8")
        )

    if data.get("code") != "Ok":
        raise ValueError(
            "Unable to calculate route"
        )

    route = data["routes"][0]

    return {
        "distance_km": round(
            route["distance"] / 1000,
            2,
        ),
        "duration_minutes": round(
            route["duration"] / 60,
            1,
        ),
        "geometry": route["geometry"],
    }
