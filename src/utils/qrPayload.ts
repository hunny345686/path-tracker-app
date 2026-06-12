import type { DeliveryDraft } from '../types/types';

type DraftKey = keyof DeliveryDraft;

const FIELD_ALIASES: Record<string, DraftKey> = {
  address: 'address',
  addr: 'address',
  customer: 'customerName',
  customer_name: 'customerName',
  customername: 'customerName',
  item: 'product',
  mobile: 'mobile',
  name: 'customerName',
  order: 'product',
  phone: 'mobile',
  product: 'product',
};

const EMPTY_DRAFT: DeliveryDraft = {
  address: '',
  customerName: '',
  mobile: '',
  product: '',
};

const normalizeKey = (value: string) => value.toLowerCase().replace(/[\s-]/g, '_').replace(/[^a-z_]/g, '');

const cleanValue = (value: unknown) => String(value ?? '').trim();

const buildDraft = (entries: Array<[string, unknown]>): DeliveryDraft => {
  const draft = { ...EMPTY_DRAFT };

  entries.forEach(([rawKey, rawValue]) => {
    const field = FIELD_ALIASES[normalizeKey(rawKey)];
    const value = cleanValue(rawValue);

    if (field && value) {
      draft[field] = value;
    }
  });

  return draft;
};

const parseJsonPayload = (payload: string) => {
  try {
    const parsed = JSON.parse(payload) as Record<string, unknown>;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }

    return buildDraft(Object.entries(parsed));
  } catch {
    return null;
  }
};

const parseUrlPayload = (payload: string) => {
  try {
    const url = new URL(payload);
    return buildDraft([...url.searchParams.entries()]);
  } catch {
    return null;
  }
};

const parseTextPayload = (payload: string) => {
  const rows = payload
    .split(/\r?\n|;/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const separatorIndex = row.search(/[:=]/);

      if (separatorIndex === -1) return null;

      return [row.slice(0, separatorIndex), row.slice(separatorIndex + 1)] as [string, string];
    })
    .filter((row): row is [string, string] => Boolean(row));

  return rows.length > 0 ? buildDraft(rows) : null;
};

export const getDemoQrPayload = () =>
  JSON.stringify({
    address: 'MG Road, Bengaluru, Karnataka',
    name: 'Demo QR Customer',
    order: 'Wireless Keyboard',
    phone: '9876543210',
  });

export function parseQrPayload(payload: string): DeliveryDraft {
  const trimmedPayload = payload.trim();

  if (!trimmedPayload) {
    throw new Error('QR payload is empty.');
  }

  const draft =
    parseJsonPayload(trimmedPayload) ??
    parseUrlPayload(trimmedPayload) ??
    parseTextPayload(trimmedPayload);

  if (!draft) {
    throw new Error('QR format not recognized. Use JSON, URL query params, or Name/Address/Order/Phone text.');
  }

  const missingFields = Object.entries(draft)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new Error('QR is missing customer name, address, order, or phone.');
  }

  return draft;
}
