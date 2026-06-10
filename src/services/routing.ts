import type { LatLng, RouteData, RoutePlan, RouteSummary } from '../types/types';

const OSRM_BASE_URL = 'https://router.project-osrm.org';
const FALLBACK_AVERAGE_SPEED_KMPH = 28;
const FALLBACK_ROAD_FACTOR = 1.28;
const REQUEST_TIMEOUT_MS = 12000;
const MAX_LIVE_OPTIMIZATION_STOPS = 25;

interface OsrmTripWaypoint {
  waypoint_index: number;
}

interface OsrmGeometry {
  coordinates: [number, number][];
}

interface OsrmTrip {
  distance: number;
  duration: number;
  geometry: OsrmGeometry;
}

interface OsrmTripResponse {
  code: string;
  trips?: OsrmTrip[];
  waypoints?: OsrmTripWaypoint[];
  message?: string;
}

interface OsrmRouteResponse {
  code: string;
  routes?: OsrmTrip[];
  message?: string;
}

const toCoordinateString = (stops: RouteData[]) =>
  stops.map((stop) => `${stop.lng},${stop.lat}`).join(';');

const toLatLngGeometry = (coordinates: [number, number][]): LatLng[] =>
  coordinates.map(([lng, lat]) => [lat, lng]);

const haversineKm = (from: RouteData, to: RouteData) => {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const createSummary = (
  distanceKm: number,
  durationMinutes: number,
  provider: string,
  isFallback: boolean,
  stopCount: number,
  geometryPoints: number,
  message?: string
): RouteSummary => ({
  distanceKm: Number(distanceKm.toFixed(1)),
  durationMinutes: Math.max(1, Math.round(durationMinutes)),
  provider,
  generatedAt: new Date().toISOString(),
  isFallback,
  stopCount,
  geometryPoints,
  message,
});

const fetchJson = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error('Routing service request failed.');
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export function buildEstimatedRoute(hub: RouteData, deliveries: RouteData[], message?: string): RoutePlan {
  const unvisited = [...deliveries];
  const stops = [hub];
  let current = hub;
  let directDistanceKm = 0;

  while (unvisited.length > 0) {
    let closestIndex = 0;
    let closestDistance = haversineKm(current, unvisited[0]);

    for (let index = 1; index < unvisited.length; index += 1) {
      const distance = haversineKm(current, unvisited[index]);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }

    current = unvisited[closestIndex];
    directDistanceKm += closestDistance;
    stops.push(current);
    unvisited.splice(closestIndex, 1);
  }

  const estimatedRoadDistanceKm = directDistanceKm * FALLBACK_ROAD_FACTOR;

  return {
    stops,
    geometry: stops.map((stop) => [stop.lat, stop.lng]),
    summary: createSummary(
      estimatedRoadDistanceKm,
      (estimatedRoadDistanceKm / FALLBACK_AVERAGE_SPEED_KMPH) * 60,
      'Estimated nearest-stop route',
      true,
      deliveries.length,
      stops.length,
      message ?? 'Live routing was unavailable, so this route is estimated from map distance.'
    ),
  };
}

async function fetchRoadRoute(stops: RouteData[], provider: string): Promise<RoutePlan> {
  const data = await fetchJson<OsrmRouteResponse>(
    `${OSRM_BASE_URL}/route/v1/driving/${toCoordinateString(
      stops
    )}?overview=full&geometries=geojson&steps=false`
  );
  const route = data.routes?.[0];

  if (data.code !== 'Ok' || !route) {
    throw new Error(data.message ?? 'No road route found for these stops.');
  }

  const geometry = toLatLngGeometry(route.geometry.coordinates);

  return {
    stops,
    geometry,
    summary: createSummary(
      route.distance / 1000,
      route.duration / 60,
      provider,
      false,
      stops.length - 1,
      geometry.length
    ),
  };
}

export async function buildOptimizedRoute(hub: RouteData, deliveries: RouteData[]): Promise<RoutePlan> {
  if (deliveries.length === 0) {
    return buildEstimatedRoute(hub, []);
  }

  if (deliveries.length > MAX_LIVE_OPTIMIZATION_STOPS) {
    return buildEstimatedRoute(
      hub,
      deliveries,
      `Live optimization is limited to ${MAX_LIVE_OPTIMIZATION_STOPS} stops per route in this browser build.`
    );
  }

  if (deliveries.length === 1) {
    try {
      return await fetchRoadRoute([hub, deliveries[0]], 'OSRM road route');
    } catch (error) {
      return buildEstimatedRoute(hub, deliveries, error instanceof Error ? error.message : undefined);
    }
  }

  const allStops = [hub, ...deliveries];

  try {
    const data = await fetchJson<OsrmTripResponse>(
      `${OSRM_BASE_URL}/trip/v1/driving/${toCoordinateString(
        allStops
      )}?source=first&destination=any&roundtrip=false&overview=full&geometries=geojson&steps=false`
    );
    const trip = data.trips?.[0];

    if (data.code !== 'Ok' || !trip || !data.waypoints) {
      throw new Error(data.message ?? 'No optimized road route found for these stops.');
    }

    const stops = data.waypoints
      .map((waypoint, inputIndex) => ({
        stop: allStops[inputIndex],
        order: waypoint.waypoint_index,
      }))
      .sort((a, b) => a.order - b.order)
      .map(({ stop }) => stop);

    if (stops[0]?.id !== hub.id) {
      throw new Error('Optimized route did not preserve the dispatch hub as the first stop.');
    }

    const geometry = toLatLngGeometry(trip.geometry.coordinates);

    return {
      stops,
      geometry,
      summary: createSummary(
        trip.distance / 1000,
        trip.duration / 60,
        'OSRM optimized road route',
        false,
        deliveries.length,
        geometry.length
      ),
    };
  } catch (error) {
    return buildEstimatedRoute(hub, deliveries, error instanceof Error ? error.message : undefined);
  }
}
