import {
  ArrowDownUp,
  LoaderCircle,
  MapPinned,
  Navigation,
  Package,
  Phone,
  Route,
  Share2,
  Trash2,
} from 'lucide-react';
import type { ActiveTab, RouteData, RouteSummary } from '../types/types';
import { formatRouteTime, getRouteStopNumber } from '../utils/deliveries';

interface DispatchPanelProps {
  activeTab: ActiveTab;
  deliveries: RouteData[];
  isOptimizing: boolean;
  onOptimizeRoute: () => void;
  onRemoveDelivery: (id: number) => void;
  onTabChange: (tab: ActiveTab) => void;
  route: RouteData[];
  routeSummary: RouteSummary | null;
}

const getGoogleMapsUrl = (route: RouteData[]) => {
  const origin = `${route[0].lat},${route[0].lng}`;
  const destination = `${route[route.length - 1].lat},${route[route.length - 1].lng}`;
  const waypoints = route
    .slice(1, -1)
    .map((point) => `${point.lat},${point.lng}`)
    .join('|');
  const url = new URL('https://www.google.com/maps/dir/');

  url.searchParams.set('api', '1');
  url.searchParams.set('origin', origin);
  url.searchParams.set('destination', destination);
  url.searchParams.set('travelmode', 'driving');

  if (waypoints) {
    url.searchParams.set('waypoints', waypoints);
  }

  return url.toString();
};

function OrdersView({
  deliveries,
  isOptimizing,
  onOptimizeRoute,
  onRemoveDelivery,
  route,
}: Pick<
  DispatchPanelProps,
  'deliveries' | 'isOptimizing' | 'onOptimizeRoute' | 'onRemoveDelivery' | 'route'
>) {
  return (
    <>
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-950">Order Queue</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">{deliveries.length} active deliveries</p>
          </div>
          <Package className="text-slate-400" size={20} />
        </div>
      </div>

      {deliveries.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Package size={23} />
          </div>
          <p className="mt-4 text-sm font-black text-slate-950">Queue is empty</p>
          <p className="mt-1 text-sm text-slate-500">New delivery orders will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {deliveries.map((delivery) => {
            const plannedStop = getRouteStopNumber(route, delivery.id);

            return (
              <article key={delivery.id} className="group px-4 py-4 transition hover:bg-slate-50">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                    <Package size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-950">{delivery.product}</p>
                        <p className="mt-0.5 truncate text-xs font-bold text-slate-600">
                          {delivery.customerName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {plannedStop && (
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">
                            Stop {plannedStop}
                          </span>
                        )}
                        <button
                          className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          onClick={() => onRemoveDelivery(delivery.id)}
                          title="Remove delivery"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {delivery.placeLabel ?? delivery.address}
                    </p>

                    <a
                      className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                      href={`tel:${delivery.mobile}`}
                    >
                      <Phone size={13} />
                      {delivery.mobile}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
          disabled={deliveries.length === 0 || isOptimizing}
          onClick={onOptimizeRoute}
          type="button"
        >
          {isOptimizing ? <LoaderCircle className="animate-spin" size={18} /> : <Route size={18} />}
          {isOptimizing ? 'Optimizing route' : 'Optimize route'}
        </button>
      </div>
    </>
  );
}

function RouteView({ route, routeSummary }: Pick<DispatchPanelProps, 'route' | 'routeSummary'>) {
  const deliveryStops = route.slice(1);
  const packingStops = [...deliveryStops].reverse();
  const hasRoute = deliveryStops.length > 0;

  const exportToGoogleMaps = () => {
    if (!hasRoute) return;
    window.open(getGoogleMapsUrl(route), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-950">Route Manifest</h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {hasRoute ? `${deliveryStops.length} planned stops` : 'No active route'}
            </p>
          </div>
          <Navigation className="text-slate-400" size={20} />
        </div>

        {routeSummary && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-md bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-black uppercase text-slate-500">Distance</p>
              <p className="mt-1 text-sm font-black text-slate-950">{routeSummary.distanceKm} km</p>
            </div>
            <div className="rounded-md bg-slate-50 px-3 py-2">
              <p className="text-[11px] font-black uppercase text-slate-500">Drive time</p>
              <p className="mt-1 text-sm font-black text-slate-950">
                {formatRouteTime(routeSummary.durationMinutes)}
              </p>
            </div>
          </div>
        )}
      </div>

      {!hasRoute ? (
        <div className="px-5 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <Route size={23} />
          </div>
          <p className="mt-4 text-sm font-black text-slate-950">Route not generated</p>
          <p className="mt-1 text-sm text-slate-500">Optimized stops will appear in delivery order.</p>
        </div>
      ) : (
        <>
          <div className="border-b border-slate-100 p-4">
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-slate-50"
              onClick={exportToGoogleMaps}
              type="button"
            >
              <Share2 size={18} />
              Open in Google Maps
            </button>
          </div>

          <div className="px-4 py-3">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-slate-500">
              <ArrowDownUp size={14} />
              Bag loading order
            </div>
            <div className="space-y-2">
              {packingStops.map((stop, index) => {
                const isDeliverFirst = index === packingStops.length - 1;

                return (
                  <article
                    className={`rounded-lg border px-3 py-3 ${
                      isDeliverFirst
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                    }`}
                    key={stop.id}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-black text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-950">{stop.product}</p>
                        <p className="truncate text-xs font-bold text-slate-600">{stop.customerName}</p>
                      </div>
                      {isDeliverFirst && (
                        <span className="rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-black uppercase text-white">
                          Deliver first
                        </span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {stop.placeLabel ?? stop.address}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function DispatchPanel({
  activeTab,
  deliveries,
  isOptimizing,
  onOptimizeRoute,
  onRemoveDelivery,
  onTabChange,
  route,
  routeSummary,
}: DispatchPanelProps) {
  return (
    <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-3">
        <div className="grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1">
          <button
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black transition ${
              activeTab === 'orders'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
            onClick={() => onTabChange('orders')}
            type="button"
          >
            <Package size={16} />
            Orders
          </button>
          <button
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 ${
              activeTab === 'route'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
            disabled={route.length === 0}
            onClick={() => onTabChange('route')}
            type="button"
          >
            <MapPinned size={16} />
            Route
          </button>
        </div>
      </div>

      <div className="max-h-[680px] overflow-y-auto">
        {activeTab === 'orders' ? (
          <OrdersView
            deliveries={deliveries}
            isOptimizing={isOptimizing}
            onOptimizeRoute={onOptimizeRoute}
            onRemoveDelivery={onRemoveDelivery}
            route={route}
          />
        ) : (
          <RouteView route={route} routeSummary={routeSummary} />
        )}
      </div>
    </aside>
  );
}
