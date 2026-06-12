import { useState } from 'react';
import type { FormEvent } from 'react';
import { LoaderCircle, MapPin, PackagePlus, Phone, UserRound } from 'lucide-react';
import QrScanner from './QrScanner';
import { geocodeAddress } from '../services/geocoding';
import type { DeliveryDraft, RouteData } from '../types/types';
import { isValidPhone, normalizePhone } from '../utils/deliveries';

interface AddDeliveryResult {
  message?: string;
  success: boolean;
}

interface DeliveryFormProps {
  onAddDelivery: (delivery: RouteData) => AddDeliveryResult;
  onDeliveryAdded: () => void;
}

const inputClass =
  'h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';

export default function DeliveryForm({ onAddDelivery, onDeliveryAdded }: DeliveryFormProps) {
  const [product, setProduct] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setProduct('');
    setAddress('');
    setCustomerName('');
    setMobile('');
  };

  const applyQrDraft = (draft: DeliveryDraft) => {
    setProduct(draft.product);
    setAddress(draft.address);
    setCustomerName(draft.customerName);
    setMobile(draft.mobile);
    setFormError('');
  };

  const handleAddDelivery = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');

    const trimmedProduct = product.trim();
    const trimmedAddress = address.trim();
    const trimmedCustomerName = customerName.trim();
    const normalizedMobile = normalizePhone(mobile);

    if (!trimmedProduct || !trimmedAddress || !trimmedCustomerName || !normalizedMobile) {
      setFormError('Fill all delivery fields before adding the order.');
      return;
    }

    if (!isValidPhone(normalizedMobile)) {
      setFormError('Enter a valid customer phone number.');
      return;
    }

    setIsLoading(true);

    try {
      const place = await geocodeAddress(trimmedAddress);
      const delivery: RouteData = {
        id: Date.now(),
        product: trimmedProduct,
        customerName: trimmedCustomerName,
        mobile: normalizedMobile,
        address: trimmedAddress,
        placeLabel: place.label,
        lat: place.lat,
        lng: place.lng,
        createdAt: new Date().toISOString(),
      };
      const result = onAddDelivery(delivery);

      if (!result.success) {
        setFormError(result.message ?? 'This delivery could not be added.');
        return;
      }

      resetForm();
      onDeliveryAdded();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to add this delivery.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddDelivery} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.05fr_1fr_0.85fr_1.7fr]">
        <label className="block">
          <span className="mb-1 block text-[11px] font-black uppercase text-slate-500">Product</span>
          <div className="relative">
            <PackagePlus
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              className={`${inputClass} pl-9`}
              onChange={(event) => setProduct(event.target.value)}
              placeholder="Order item"
              type="text"
              value={product}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-black uppercase text-slate-500">Customer</span>
          <div className="relative">
            <UserRound
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              className={`${inputClass} pl-9`}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Customer name"
              type="text"
              value={customerName}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-black uppercase text-slate-500">Phone</span>
          <div className="relative">
            <Phone
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              className={`${inputClass} pl-9`}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="Mobile"
              type="tel"
              value={mobile}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-black uppercase text-slate-500">Address</span>
          <div className="relative">
            <MapPin
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              className={`${inputClass} pl-9`}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Area, landmark, city"
              type="text"
              value={address}
            />
          </div>
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold leading-5 text-slate-500">
          Add manually or scan a QR. Review details before creating the delivery.
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <QrScanner onApplyDraft={applyQrDraft} />
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-wait disabled:opacity-70"
            disabled={isLoading}
            title="Add delivery"
            type="submit"
          >
            {isLoading ? <LoaderCircle className="animate-spin" size={18} /> : <PackagePlus size={18} />}
            Add delivery
          </button>
        </div>
      </div>

      {formError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          {formError}
        </p>
      )}
    </form>
  );
}
