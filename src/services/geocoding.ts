const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search';
const REQUEST_TIMEOUT_MS = 10000;
const BENGALURU_VIEWBOX = '77.45,13.15,77.80,12.75';

interface NominatimPlace {
  display_name: string;
  lat: string;
  lon: string;
}

export interface GeocodedPlace {
  label: string;
  lat: number;
  lng: number;
}

const withBengaluruContext = (address: string) => {
  const normalizedAddress = address.toLowerCase();

  if (
    normalizedAddress.includes('bengaluru') ||
    normalizedAddress.includes('bangalore') ||
    normalizedAddress.includes('karnataka')
  ) {
    return address;
  }

  return `${address}, Bengaluru, Karnataka, India`;
};

const fetchWithTimeout = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export async function geocodeAddress(address: string): Promise<GeocodedPlace> {
  const trimmedAddress = address.trim();

  if (trimmedAddress.length < 5) {
    throw new Error('Enter a more complete delivery address.');
  }

  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
    countrycodes: 'in',
    viewbox: BENGALURU_VIEWBOX,
    q: withBengaluruContext(trimmedAddress),
  });

  const response = await fetchWithTimeout(`${NOMINATIM_SEARCH_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Address lookup is unavailable right now. Please try again.');
  }

  const places = (await response.json()) as NominatimPlace[];
  const place = places[0];

  if (!place) {
    throw new Error('Address not found. Add area, city, and state for better results.');
  }

  const lat = Number.parseFloat(place.lat);
  const lng = Number.parseFloat(place.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error('Address lookup returned invalid map coordinates.');
  }

  return {
    label: place.display_name,
    lat,
    lng,
  };
}
