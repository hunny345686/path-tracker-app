import { ClipboardList, DatabaseZap, MapPinned, QrCode, Trash2 } from 'lucide-react';
import DeliveryForm from './DeliveryForm';
import type { RouteData } from '../types/types';

interface AddDeliveryResult {
  message?: string;
  success: boolean;
}

interface TopBarProps {
  hasDeliveries: boolean;
  onAddDelivery: (delivery: RouteData) => AddDeliveryResult;
  onClearDeliveries: () => void;
  onDeliveryAdded: () => void;
  onLoadDemoData: () => void;
  orderCount: number;
}

export default function TopBar({
  hasDeliveries,
  onAddDelivery,
  onClearDeliveries,
  onDeliveryAdded,
  onLoadDemoData,
  orderCount,
}: TopBarProps) {
  return (
    <header className="top-0 z-[3000] border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur lg:sticky">
      <div className="mx-auto max-w-[1520px] px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-red-600 text-white shadow-sm">
                <MapPinned size={21} strokeWidth={2.5} />
              </span>
              <div>
                <p className="text-xl font-black leading-none text-slate-950">PathTracker</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Dispatch control
                </p>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!hasDeliveries}
              onClick={onClearDeliveries}
              type="button"
            >
              <Trash2 size={16} />
              Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={onLoadDemoData}
              type="button"
            >
              <ClipboardList size={15} />
              Demo batch
            </button>
            <span className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-xs font-black uppercase text-slate-600">
              <DatabaseZap size={15} />
              {orderCount} saved orders
            </span>
            <span className="rounded-md bg-emerald-50 px-3 py-2 text-xs font-black uppercase text-emerald-700">
              Live geocoding
            </span>
            <span className="rounded-md bg-sky-50 px-3 py-2 text-xs font-black uppercase text-sky-700">
              Road routing
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-violet-50 px-3 py-2 text-xs font-black uppercase text-violet-700">
              <QrCode size={15} />
              QR intake
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <DeliveryForm onAddDelivery={onAddDelivery} onDeliveryAdded={onDeliveryAdded} />
        </div>
      </div>
    </header>
  );
}
