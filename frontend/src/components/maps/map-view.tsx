"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { MapPlace } from "@/lib/api/map-types";
import { RouteLine } from "./route-line";

const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  latitude: number;
  longitude: number;
  places: MapPlace[];
  selectedPlace: MapPlace | null;
  routeCoordinates: [number, number][];
  onSelectPlace: (place: MapPlace) => void;
}

export function MapView({
  latitude,
  longitude,
  places,
  selectedPlace,
  routeCoordinates,
  onSelectPlace,
}: MapViewProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        position={[latitude, longitude]}
        icon={markerIcon}
      >
        <Popup>
          <strong>Your location</strong>
        </Popup>
      </Marker>

      {places.map((place, index) => (
        <Marker
          key={
            String(place.osm_id) +
            "-" +
            String(place.latitude) +
            "-" +
            String(index)
          }
          position={[
            place.latitude,
            place.longitude,
          ]}
          icon={markerIcon}
          eventHandlers={{
            click: function () {
              onSelectPlace(place);
            },
          }}
        >
          <Popup>
            <div className="max-w-60">
              <p className="font-semibold">
                {place.name}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                {place.type ||
                  "Collection point"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {selectedPlace &&
        routeCoordinates.length > 1 && (
          <RouteLine
            coordinates={routeCoordinates}
          />
        )}
    </MapContainer>
  );
}
