import { api } from "./client";
import type {
  MapPlace,
  RouteResult,
} from "./map-types";

export function searchMapPlaces(
  token: string,
  query: string,
  latitude?: number,
  longitude?: number,
) {
  const params = new URLSearchParams();

  params.set("query", query);

  if (latitude !== undefined) {
    params.set(
      "latitude",
      String(latitude),
    );
  }

  if (longitude !== undefined) {
    params.set(
      "longitude",
      String(longitude),
    );
  }

  const endpoint =
    "/api/v1/maps/search?" +
    params.toString();

  return api.get<MapPlace[]>(
    endpoint,
    token,
  );
}

export function getRoute(
  token: string,
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
) {
  return api.post<RouteResult>(
    "/api/v1/maps/route",
    {
      start_latitude: startLatitude,
      start_longitude: startLongitude,
      end_latitude: endLatitude,
      end_longitude: endLongitude,
    },
    token,
  );
}
