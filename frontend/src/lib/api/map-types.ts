export interface MapPlace {
  name: string;
  latitude: number;
  longitude: number;
  type: string | null;
  osm_id: number | null;
}

export interface RouteResult {
  distance_km: number;
  duration_minutes: number;
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
}
