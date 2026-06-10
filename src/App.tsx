import { useEffect, useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import DispatchPanel from './components/DispatchPanel';
import MapComponent from './components/Map';
import TopBar from './components/TopBar';
import { buildOptimizedRoute } from './services/routing';
import type { ActiveTab, LatLng, RouteData, RouteSummary } from './types/types';
import { formatGeneratedAt, formatRouteTime, isDuplicateDelivery } from './utils/deliveries';

const STORAGE_KEY = 'path-tracker.deliveries.v2';

const DISPATCH_HUB: RouteData = {
  address: 'Indiranagar, Bengaluru, Karnataka',
  customerName: 'PathTracker Operations',
  id: 100,
  lat: 12.9719,
  lng: 77.6412,
  mobile: '9999999999',
  placeLabel: 'Indiranagar, Bengaluru, Karnataka, India',
  product: 'Dispatch Hub',
};

const loadSavedDeliveries = (): RouteData[] => {
  if (typeof window === 'undefined') return [];

  try {
    const savedDeliveries = window.localStorage.getItem(STORAGE_KEY);
    if (!savedDeliveries) return [];

    const parsed = JSON.parse(savedDeliveries) as RouteData[];

    return Array.isArray(parsed)
      ? parsed.filter((delivery) => Number.isFinite(delivery.lat) && Number.isFinite(delivery.lng))
      : [];
  } catch {
    return [];
  }
};

function MetricTile({
  accent,
  label,
  value,
}: {
  accent: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 h-1.5 w-10 rounded-full ${accent}`} />
      <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function App() {
  const [deliveries, setDeliveries] = useState<RouteData[]>(loadSavedDeliveries);
  const [route, setRoute] = useState<RouteData[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<LatLng[]>([]);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeError, setRouteError] = useState('');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deliveries));
  }, [deliveries]);

  const orderedStops = useMemo(() => route.slice(1), [route]);
  const routeStatus = routeSummary?.isFallback
    ? 'Estimated'
    : routeSummary
      ? 'Live route'
      : deliveries.length > 0
        ? 'Ready'
        : 'Idle';
  const finalStop = orderedStops.at(-1);

  const clearRoutePlan = () => {
    setRoute([]);
    setRouteGeometry([]);
    setRouteSummary(null);
    setRouteError('');
  };

  const addDelivery = (delivery: RouteData) => {
    if (isDuplicateDelivery(deliveries, delivery)) {
      return {
        message: 'This customer and address already exist in the queue.',
        success: false,
      };
    }

    setDeliveries((previousDeliveries) => [...previousDeliveries, delivery]);
    clearRoutePlan();

    return { success: true };
  };

  const removeDelivery = (id: number) => {
    setDeliveries((previousDeliveries) => previousDeliveries.filter((delivery) => delivery.id !== id));
    clearRoutePlan();
    setActiveTab('orders');
  };

  const clearDeliveries = () => {
    if (deliveries.length > 0 && !window.confirm('Clear all delivery orders?')) return;

    setDeliveries([]);
    clearRoutePlan();
    setActiveTab('orders');
  };

  const solveRoute = async () => {
    if (deliveries.length === 0) {
      setRouteError('Add at least one delivery before optimizing the route.');
      return;
    }

    setIsOptimizing(true);
    setRouteError('');

    try {
      const plan = await buildOptimizedRoute(DISPATCH_HUB, deliveries);
      setRoute(plan.stops);
      setRouteGeometry(plan.geometry);
      setRouteSummary(plan.summary);
      setActiveTab('route');
    } catch (error) {
      setRouteError(error instanceof Error ? error.message : 'Unable to optimize this route.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f8] text-slate-950">
      <TopBar
        hasDeliveries={deliveries.length > 0}
        onAddDelivery={addDelivery}
        onClearDeliveries={clearDeliveries}
        onDeliveryAdded={() => setActiveTab('orders')}
        orderCount={deliveries.length}
      />

      <main className="mx-auto max-w-[1520px] px-4 py-5 lg:px-6">
        <section className="mb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                Bengaluru last-mile dispatch
              </p>
              <h1 className="mt-2 text-2xl font-black text-slate-950 lg:text-4xl">
                Delivery Route Planner
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">
                Plan live customer deliveries from the Indiranagar hub with geocoded orders,
                route sequencing, map geometry, and driver-ready handoff.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-white px-3 py-2 text-xs font-black uppercase text-slate-600 shadow-sm ring-1 ring-slate-200">
                Hub: Indiranagar
              </span>
              <span className="rounded-md bg-white px-3 py-2 text-xs font-black uppercase text-slate-600 shadow-sm ring-1 ring-slate-200">
                Status: {routeStatus}
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <MetricTile accent="bg-red-600" label="Orders" value={deliveries.length} />
            <MetricTile
              accent="bg-sky-600"
              label="Distance"
              value={routeSummary ? `${routeSummary.distanceKm} km` : '--'}
            />
            <MetricTile
              accent="bg-emerald-600"
              label="Drive time"
              value={formatRouteTime(routeSummary?.durationMinutes)}
            />
            <MetricTile
              accent="bg-amber-500"
              label="Route stops"
              value={routeSummary ? routeSummary.stopCount : '--'}
            />
            <MetricTile
              accent="bg-slate-950"
              label="Generated"
              value={formatGeneratedAt(routeSummary?.generatedAt)}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-8">
            <MapComponent
              deliveries={deliveries}
              hub={DISPATCH_HUB}
              isOptimizing={isOptimizing}
              route={route}
              routeGeometry={routeGeometry}
            />

            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
                    Route quality
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    {routeSummary
                      ? `${orderedStops.length} stops planned with ${routeSummary.provider}`
                      : 'No route generated yet'}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {finalStop
                      ? `Final stop: ${finalStop.customerName} near ${finalStop.address}.`
                      : 'Orders are stored locally until the next route is generated.'}
                  </p>
                </div>

                {routeSummary && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <span className="rounded-md bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
                      {routeSummary.geometryPoints} map points
                    </span>
                    <span
                      className={`rounded-md px-3 py-2 text-xs font-black ${
                        routeSummary.isFallback
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {routeSummary.isFallback ? 'Estimated' : 'Road route'}
                    </span>
                    <span className="rounded-md bg-sky-50 px-3 py-2 text-xs font-black text-sky-700">
                      Driver ready
                    </span>
                  </div>
                )}
              </div>

              {(routeError || routeSummary?.message) && (
                <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-900">
                  {routeError || routeSummary?.message}
                </p>
              )}

              {orderedStops.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  <span className="shrink-0 rounded-md bg-red-600 px-3 py-2 text-xs font-black text-white">
                    HUB
                  </span>
                  {orderedStops.map((stop, index) => (
                    <span
                      className="shrink-0 rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-700"
                      key={stop.id}
                    >
                      {index + 1}. {stop.customerName}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </section>

          <section className="lg:col-span-4">
            <DispatchPanel
              activeTab={activeTab}
              deliveries={deliveries}
              isOptimizing={isOptimizing}
              onOptimizeRoute={solveRoute}
              onRemoveDelivery={removeDelivery}
              onTabChange={setActiveTab}
              route={route}
              routeSummary={routeSummary}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
