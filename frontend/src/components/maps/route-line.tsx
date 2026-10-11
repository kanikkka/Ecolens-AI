"use client";

import { useEffect } from "react";
import { Polyline, useMap } from "react-leaflet";

interface RouteLineProps {
  coordinates: [number, number][];
}

export function RouteLine({
  coordinates,
}: RouteLineProps) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length < 2) {
      return;
    }

    const bounds = coordinates.map(
      function (coordinate) {
        return [
          coordinate[1],
          coordinate[0],
        ] as [number, number];
      },
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [coordinates, map]);

  const leafletCoordinates =
    coordinates.map(
      function (coordinate) {
        return [
          coordinate[1],
          coordinate[0],
        ] as [number, number];
      },
    );

  return (
    <Polyline
      positions={leafletCoordinates}
      pathOptions={{
        weight: 5,
      }}
    />
  );
}
