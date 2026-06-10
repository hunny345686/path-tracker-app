export interface RouteData {
  id: number;
  product: string;
  customerName: string;
  mobile: string;
  address: string;
  lat: number;
  lng: number;
  placeLabel?: string;
  createdAt?: string;
  isPriority?: boolean;
}

export type LatLng = [number, number];

export type ActiveTab = 'orders' | 'route';

export interface RouteSummary {
  distanceKm: number;
  durationMinutes: number;
  provider: string;
  generatedAt: string;
  isFallback: boolean;
  stopCount: number;
  geometryPoints: number;
  message?: string;
}

export interface RoutePlan {
  stops: RouteData[];
  geometry: LatLng[];
  summary: RouteSummary;
}
