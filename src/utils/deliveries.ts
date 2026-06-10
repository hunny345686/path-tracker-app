import type { RouteData } from '../types/types';

export const normalizePhone = (value: string) => value.replace(/[^\d+]/g, '').trim();

export const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const isDuplicateDelivery = (deliveries: RouteData[], candidate: RouteData) =>
  deliveries.some((delivery) => {
    const existingPlace = delivery.placeLabel?.trim().toLowerCase();
    const candidatePlace = candidate.placeLabel?.trim().toLowerCase();
    const sameAddress =
      delivery.address.trim().toLowerCase() === candidate.address.trim().toLowerCase() ||
      (Boolean(existingPlace) && existingPlace === candidatePlace);
    const sameCustomer =
      delivery.customerName.trim().toLowerCase() === candidate.customerName.trim().toLowerCase();

    return sameAddress && sameCustomer;
  });

export const formatRouteTime = (minutes?: number) => {
  if (!minutes) return '--';

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const formatGeneratedAt = (value?: string) => {
  if (!value) return 'Not planned';

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
};

export const getRouteStopNumber = (route: RouteData[], deliveryId: number) => {
  const index = route.findIndex((stop) => stop.id === deliveryId);
  return index > 0 ? index : null;
};
