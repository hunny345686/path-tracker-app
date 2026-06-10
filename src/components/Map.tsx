import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLng, RouteData } from '../types/types';

interface MapProps {
  deliveries: RouteData[];
  hub: RouteData;
  isOptimizing: boolean;
  route: RouteData[];
  routeGeometry: LatLng[];
}

const createMarkerIcon = (label: string, variant: 'hub' | 'stop' | 'pending') => {
  const isHub = variant === 'hub';
  const background = isHub ? '#dc2626' : variant === 'stop' ? '#0f172a' : '#2563eb';
  const size = isHub ? 42 : 32;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${background};
        border: 3px solid #ffffff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
        font-size: ${isHub ? 11 : 12}px;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.28);
      ">
        ${label}
      </div>`,
    className: 'path-tracker-marker',
    iconAnchor: [size / 2, size / 2],
    iconSize: [size, size],
  });
};

function FitMapToRoute({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 12);
      return;
    }

    map.fitBounds(points, {
      maxZoom: 14,
      padding: [44, 44],
    });
  }, [map, points]);

  return null;
}

export default function MapComponent({ hub, route, deliveries, routeGeometry, isOptimizing }: MapProps) {
  const hasOptimizedRoute = route.length > 1;
  const visibleStops = hasOptimizedRoute ? route.slice(1) : deliveries;
  const linePositions =
    routeGeometry.length > 0 ? routeGeometry : route.map((stop) => [stop.lat, stop.lng] as LatLng);
  const fitPoints =
    linePositions.length > 0
      ? linePositions
      : [[hub.lat, hub.lng] as LatLng, ...deliveries.map((delivery) => [delivery.lat, delivery.lng] as LatLng)];

  return (
    <div className="relative h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:h-[680px]">
      <MapContainer center={[12.9716, 77.5946]} className="h-full w-full" zoom={12} zoomControl>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapToRoute points={fitPoints} />

        <Marker icon={createMarkerIcon('HUB', 'hub')} position={[hub.lat, hub.lng]}>
          <Popup>
            <div className="font-sans">
              <p className="m-0 text-[10px] font-black uppercase tracking-wider text-red-600">Dispatch hub</p>
              <p className="m-0 mt-1 text-sm font-black text-slate-950">{hub.address}</p>
            </div>
          </Popup>
        </Marker>

        {visibleStops.map((delivery, index) => (
          <Marker
            icon={createMarkerIcon(String(index + 1), hasOptimizedRoute ? 'stop' : 'pending')}
            key={delivery.id}
            position={[delivery.lat, delivery.lng]}
          >
            <Popup>
              <div className="font-sans">
                <p className="m-0 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {hasOptimizedRoute ? `Route stop ${index + 1}` : 'Pending order'}
                </p>
                <p className="m-0 mt-1 text-sm font-black text-slate-950">{delivery.product}</p>
                <p className="m-0 text-xs font-semibold text-slate-600">{delivery.customerName}</p>
                <p className="m-0 mt-2 max-w-[230px] text-xs leading-4 text-slate-500">
                  {delivery.placeLabel ?? delivery.address}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {linePositions.length > 1 && (
          <>
            <Polyline color="#dc2626" opacity={0.16} positions={linePositions} weight={12} />
            <Polyline color="#dc2626" opacity={0.95} positions={linePositions} weight={5} />
          </>
        )}
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 z-[400] rounded-lg border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
          Bengaluru operations grid
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-black text-red-700">Hub</span>
          <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-700">Pending</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-700">
            Planned
          </span>
        </div>
      </div>

      {deliveries.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[400] rounded-lg border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <p className="text-sm font-black text-slate-950">No deliveries mapped</p>
          <p className="mt-1 text-sm text-slate-600">The hub is ready for the next dispatch batch.</p>
        </div>
      )}

      {isOptimizing && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-950 shadow-xl">
            Building road route...
          </div>
        </div>
      )}
    </div>
  );
}
