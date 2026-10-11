"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useState,
} from "react";

import type { MapPlace } from "@/lib/api/map-types";
import {
  getRoute,
  searchMapPlaces,
} from "@/lib/api/map-services";

const MapView = dynamic(
  () =>
    import("@/components/maps/map-view").then(
      (module) => module.MapView,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#eef5ec]">
        Loading map...
      </div>
    ),
  },
);

const MATERIALS = [
  "plastic",
  "paper",
  "cardboard",
  "aluminium",
  "glass",
];

export default function MapPage() {
  const [latitude, setLatitude] = useState(30.3782);
  const [longitude, setLongitude] = useState(75.1672);

  const [material, setMaterial] = useState("plastic");

  const [places, setPlaces] = useState<MapPlace[]>([]);

  const [selectedPlace, setSelectedPlace] =
    useState<MapPlace | null>(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState<[number, number][]>([]);

  const [routeDistance, setRouteDistance] =
    useState<number | null>(null);

  const [routeDuration, setRouteDuration] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  const [locationMessage, setLocationMessage] =
    useState(
      "Using map position. Enable location for more accurate results.",
    );

  async function findPlaces() {
    setLoading(true);

    try {
      const token = localStorage.getItem("ecolens_token");

      if (!token) {
        setLocationMessage(
          "Please login to search nearby locations.",
        );
        return;
      }

      const searchQuery =
        `${material} recycling centre`;

      const result = await searchMapPlaces(
        token,
        searchQuery,
        latitude,
        longitude,
      );

      setPlaces(result);
      setSelectedPlace(null);
      setRouteCoordinates([]);
      setRouteDistance(null);
      setRouteDuration(null);
    } catch {
      setLocationMessage(
        "Unable to load nearby places right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function showRoute(place: MapPlace) {
    setSelectedPlace(place);
    setRouteLoading(true);

    try {
      const token =
        localStorage.getItem("ecolens_token");

      if (!token) {
        setLocationMessage(
          "Please login to calculate a route.",
        );
        return;
      }

      const route = await getRoute(
        token,
        latitude,
        longitude,
        place.latitude,
        place.longitude,
      );

      setRouteDistance(route.distance_km);
      setRouteDuration(route.duration_minutes);

      setRouteCoordinates(
        route.geometry.coordinates,
      );
    } catch {
      setRouteCoordinates([]);
      setRouteDistance(null);
      setRouteDuration(null);

      setLocationMessage(
        "Unable to calculate route right now.",
      );
    } finally {
      setRouteLoading(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by this browser.",
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(
          position.coords.latitude,
        );

        setLongitude(
          position.coords.longitude,
        );

        setLocationMessage(
          "Using your current location.",
        );
      },
      () => {
        setLocationMessage(
          "Location permission was not granted.",
        );
      },
    );
  }

  useEffect(() => {
    useMyLocation();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7faf5]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-6">
          <p className="text-sm font-medium text-[#3f7d4a]">
            REAL-WORLD ACTION
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#24342a]">
            Find a Recycling Point
          </h1>

          <p className="mt-2 max-w-2xl text-[#68756c]">
            Find a suitable nearby location and
            get a route from your current position.
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-[#dfe8df] bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">
                Material
              </label>

              <select
                value={material}
                onChange={(event) =>
                  setMaterial(event.target.value)
                }
                className="w-full rounded-xl border border-[#dfe8df] bg-white px-4 py-3 outline-none focus:border-[#3f7d4a]"
              >
                {MATERIALS.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item.charAt(0).toUpperCase() +
                      item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={useMyLocation}
              className="rounded-xl border border-[#3f7d4a] px-5 py-3 font-medium text-[#3f7d4a] hover:bg-[#e6f2e7]"
            >
              Use My Location
            </button>

            <button
              type="button"
              onClick={findPlaces}
              disabled={loading}
              className="rounded-xl bg-[#3f7d4a] px-6 py-3 font-medium text-white hover:bg-[#2f6339] disabled:opacity-60"
            >
              {loading ? "Finding..." : "Find Nearby"}
            </button>

          </div>

          <p className="mt-3 text-xs text-[#68756c]">
            {locationMessage}
          </p>
        </div>

        <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-[#dfe8df] bg-white shadow-sm lg:grid-cols-[1fr_360px]">

          <div className="min-h-[500px]">
            <MapView
              latitude={latitude}
              longitude={longitude}
              places={places}
              selectedPlace={selectedPlace}
              routeCoordinates={routeCoordinates}
              onSelectPlace={showRoute}
            />
          </div>

          <aside className="border-t border-[#dfe8df] bg-white lg:border-l lg:border-t-0">

            <div className="border-b border-[#dfe8df] p-5">
              <h2 className="font-semibold text-[#24342a]">
                Nearby Places
              </h2>

              <p className="mt-1 text-sm text-[#68756c]">
                {places.length} places found
              </p>
            </div>

            <div className="max-h-[560px] overflow-y-auto p-4">

              {selectedPlace &&
                routeDistance !== null && (
                  <div className="mb-4 rounded-2xl bg-[#e6f2e7] p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-[#3f7d4a]">
                      Route
                    </p>

                    <div className="mt-3 flex gap-6">

                      <div>
                        <p className="text-2xl font-bold text-[#24342a]">
                          {routeDistance} km
                        </p>

                        <p className="text-xs text-[#68756c]">
                          Driving distance
                        </p>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-[#24342a]">
                          {routeDuration} min
                        </p>

                        <p className="text-xs text-[#68756c]">
                          Estimated time
                        </p>
                      </div>

                    </div>
                  </div>
                )}

              {places.length === 0 && (
                <div className="rounded-2xl bg-[#f7faf5] p-5 text-sm text-[#68756c]">
                  Select a material and click
                  <strong> Find Nearby </strong>
                  to search.
                </div>
              )}

              <div className="space-y-3">

                {places.map((place) => (
                  <button
                    key={`${place.osm_id}-${place.latitude}`}
                    type="button"
                    onClick={() => showRoute(place)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedPlace === place
                        ? "border-[#3f7d4a] bg-[#e6f2e7]"
                        : "border-[#dfe8df] hover:bg-[#f7faf5]"
                    }`}
                  >
                    <p className="font-medium text-[#24342a]">
                      {place.name}
                    </p>

                    <p className="mt-1 text-xs text-[#68756c]">
                      {place.type ||
                        "Recycling / collection point"}
                    </p>

                    <p className="mt-3 text-xs font-medium text-[#3f7d4a]">
                      {routeLoading &&
                      selectedPlace === place
                        ? "Calculating route..."
                        : "Show route →"}
                    </p>
                  </button>
                ))}

              </div>

            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
