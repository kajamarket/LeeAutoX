import { VehicleLotItem, VehicleSearchResponse, AuctionFilterValues } from '../types/auction';
import { MOCK_AUCTION_VEHICLES } from '../data/mockAuctionLots';

const CACHE_KEY_PREFIX = 'leeautox_auction_cache_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache for searches
const METADATA_TTL_MS = 60 * 60 * 1000; // 1 hour for makes/filter options

// Resolve the API base URL:
// 1. If VITE_AUCTION_PROXY_URL is set (e.g. on GitHub Pages via Cloudflare/edge worker), use that
// 2. Otherwise default to our local Express proxy at /api/auction
function getApiBaseUrl(): string {
  const envProxy = (import.meta as any).env?.VITE_AUCTION_PROXY_URL;
  if (envProxy && typeof envProxy === 'string' && envProxy.trim()) {
    return envProxy.trim().replace(/\/$/, '');
  }
  return '/api/auction';
}

interface CacheEnvelope<T> {
  timestamp: number;
  data: T;
}

function getFromStorage<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!raw) return null;
    const envelope: CacheEnvelope<T> = JSON.parse(raw);
    if (Date.now() - envelope.timestamp < CACHE_TTL_MS) {
      return envelope.data;
    }
  } catch (e) {
    // Ignore storage issues
  }
  return null;
}

function setInStorage<T>(key: string, data: T): void {
  try {
    const envelope: CacheEnvelope<T> = {
      timestamp: Date.now(),
      data,
    };
    sessionStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(envelope));
  } catch (e) {
    // Ignore quota issues
  }
}

// Fetch with timeout and 1 retry
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 1, timeoutMs = 10000): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (attempt < retries) {
        // Backoff delay before retry
        await new Promise((res) => setTimeout(res, 800 * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Network request failed');
}

// Build URL query string from AuctionFilterValues
export function buildFilterQuery(filters: AuctionFilterValues): string {
  const params = new URLSearchParams();

  if (filters.s) params.set('s', filters.s.trim());
  if (filters.lot_status && filters.lot_status !== 'All') params.set('lot_status', filters.lot_status);
  if (filters.lot_sub_status && filters.lot_sub_status !== 'All') params.set('lot_sub_status', filters.lot_sub_status);
  if (filters.auction_type && filters.auction_type !== '0') params.set('auction_type', filters.auction_type);
  if (filters.platform && filters.platform !== 'both') params.set('platform', filters.platform);

  if (filters.make && filters.make !== 'All') params.set('make', filters.make);
  if (filters.series && filters.series !== 'All') params.set('series', filters.series);
  if (filters.model && filters.model !== 'All') params.set('model', filters.model);
  if (filters.generation_id && filters.generation_id !== 'All') params.set('generation_id', filters.generation_id);

  if (filters.type_id && filters.type_id !== 'All') params.set('type_id', filters.type_id);
  if (filters.body_style && filters.body_style !== 'All') params.set('body_style', filters.body_style);

  if (filters.year_from) params.set('year_from', String(filters.year_from));
  if (filters.year_to) params.set('year_to', String(filters.year_to));

  if (filters.price_min && Number(filters.price_min) > 0) params.set('price_min', String(filters.price_min));
  if (filters.price_max && Number(filters.price_max) < 100000) params.set('price_max', String(filters.price_max));

  if (filters.odometer_from && Number(filters.odometer_from) > 0) params.set('odometer_from', String(filters.odometer_from));
  if (filters.odometer_to && Number(filters.odometer_to) < 250000) params.set('odometer_to', String(filters.odometer_to));

  if (filters.engine_size_from && Number(filters.engine_size_from) > 0) params.set('engine_size_from', String(filters.engine_size_from));
  if (filters.engine_size_to && Number(filters.engine_size_to) < 10) params.set('engine_size_to', String(filters.engine_size_to));

  if (filters.running_condition && filters.running_condition !== 'All') params.set('run_cond', filters.running_condition);
  if (filters.has_key && filters.has_key !== 'All') params.set('has_key', filters.has_key);
  if (filters.loc_state && filters.loc_state !== 'All') params.set('loc_state', filters.loc_state);

  // Array parameters
  if (Array.isArray(filters.color)) {
    filters.color.forEach((c) => params.append('color[]', c));
  }
  if (Array.isArray(filters.fuel_type)) {
    filters.fuel_type.forEach((f) => params.append('fuel_type[]', f));
  }
  if (Array.isArray(filters.transmission)) {
    filters.transmission.forEach((t) => params.append('transmission[]', t));
  }
  if (Array.isArray(filters.drive_type)) {
    filters.drive_type.forEach((d) => params.append('drive_type[]', d));
  }
  if (Array.isArray(filters.damage)) {
    filters.damage.forEach((dm) => params.append('damage[]', dm));
  }

  if (filters.cursor) params.set('cursor', filters.cursor);
  if (filters.per_page) params.set('per_page', String(filters.per_page));
  if (filters.include_total !== undefined) params.set('include_total', filters.include_total ? 'true' : 'false');

  return params.toString();
}

// Search vehicles
export async function searchAuctionVehicles(filters: AuctionFilterValues): Promise<VehicleSearchResponse> {
  const queryStr = buildFilterQuery(filters);
  const cacheKey = `search_${queryStr}`;

  // Check cache first
  const cached = getFromStorage<VehicleSearchResponse>(cacheKey);
  if (cached) {
    return { ...cached, source: 'cached' };
  }

  const endpoint = `${getApiBaseUrl()}/vehicles${queryStr ? `?${queryStr}` : ''}`;

  try {
    const res = await fetchWithRetry(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const json = await res.json();
      const items: VehicleLotItem[] = (json.data || []).map((item: any) => normalizeLotItem(item));
      const result: VehicleSearchResponse = {
        data: items,
        meta: {
          cursor: json.meta?.cursor || null,
          total: json.meta?.total || items.length,
          per_page: json.meta?.per_page || filters.per_page || 20,
          count: items.length,
        },
        source: 'live',
      };
      setInStorage(cacheKey, result);
      return result;
    }

    if (res.status === 429) {
      console.warn('Auction API rate limit reached (429). Using cached/fallback data.');
    } else if (res.status === 401 || res.status === 403) {
      console.warn(`Auction API authentication error (${res.status}). Using cached/fallback data.`);
    }
  } catch (error) {
    console.warn('Auction API fetch notice, serving reliable fallback:', error);
  }

  // Graceful fallback to client-side filtered mock data
  const fallbackItems = filterMockVehicles(filters);
  const fallbackResult: VehicleSearchResponse = {
    data: fallbackItems,
    meta: {
      cursor: null,
      total: fallbackItems.length,
      per_page: filters.per_page || 20,
      count: fallbackItems.length,
    },
    source: 'fallback',
  };
  return fallbackResult;
}

// Fetch single lot by lot_number or slugVin
export async function getAuctionLotDetails(
  lotNumber: string | number,
  platform?: 'copart' | 'iaai',
  slugVin?: string
): Promise<VehicleLotItem | null> {
  const cacheKey = `lot_${platform || 'any'}_${lotNumber}`;
  const cached = getFromStorage<VehicleLotItem>(cacheKey);
  if (cached) return cached;

  const endpoint = `${getApiBaseUrl()}/vehicles/${encodeURIComponent(slugVin || String(lotNumber))}?lot_number=${lotNumber}${platform ? `&platform=${platform}` : ''}`;

  try {
    const res = await fetchWithRetry(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      const raw = json.data || json;
      const normalized = normalizeLotItem(raw);
      setInStorage(cacheKey, normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('Could not fetch remote lot, falling back to cached item:', err);
  }

  // Fallback to local mock vehicles
  const found = MOCK_AUCTION_VEHICLES.find(
    (v) => String(v.lot_number) === String(lotNumber) || (slugVin && v.slug_vin === slugVin)
  );
  return found || MOCK_AUCTION_VEHICLES[0];
}

// Fetch filter options (makes, models by make)
export async function getAuctionFilterOptions(make?: string): Promise<{ makes: string[]; models: string[] }> {
  const cacheKey = `filters_meta_${make || 'all'}`;
  const cached = getFromStorage<{ makes: string[]; models: string[] }>(cacheKey);
  if (cached) return cached;

  try {
    const endpoint = `${getApiBaseUrl()}/vehicles/filters${make ? `?make=${encodeURIComponent(make)}` : ''}`;
    const res = await fetchWithRetry(endpoint);
    if (res.ok) {
      const json = await res.json();
      const data = json.data || {};
      const makes = Array.isArray(data.makes) ? data.makes : [];
      const models = Array.isArray(data.models) ? data.models : [];
      const result = { makes, models };
      setInStorage(cacheKey, result);
      return result;
    }
  } catch {
    // Fallback handled below
  }

  return { makes: [], models: [] };
}

// Normalize incoming API record to clean VehicleLotItem
function normalizeLotItem(raw: any): VehicleLotItem {
  const lotNum = String(raw.lot_number || raw.id || '');
  const platform = (raw.platform || (raw.auction?.platform) || (raw.auction_type === 2 ? 'iaai' : 'copart')).toLowerCase() as 'copart' | 'iaai';
  const vin = raw.vin || '';
  const year = Number(raw.year) || 2020;
  const make = String(raw.make || '').toUpperCase();
  const model = String(raw.model || '').toUpperCase();
  const title = raw.title || `${year} ${make} ${model}`;
  const slugVin = raw.slug_vin || `${year}-${make.toLowerCase()}-${model.toLowerCase()}-${vin}`;

  const photos = Array.isArray(raw.media?.photo)
    ? raw.media.photo
    : Array.isArray(raw.photos)
    ? raw.photos
    : [raw.image || 'https://images.unsplash.com/photo-1590362891988-f7780479c656?w=800'];

  return {
    id: `${platform}-${lotNum}`,
    platform,
    lot_number: lotNum,
    vin,
    slug_vin: slugVin,
    title,
    year,
    make,
    model,
    series: raw.series || raw.vehicle_specs?.series || '',
    generation: raw.generation || '',
    vehicle_type: raw.type || raw.vehicle_type || 'SEDAN',
    specs: {
      body_style: raw.specs?.body_style || raw.vehicle_specs?.body_style || 'Sedan',
      doors: raw.specs?.doors || raw.vehicle_specs?.doors,
      color: raw.color || raw.specs?.color || 'Black',
      interior_color: raw.specs?.interior_color || '',
      engine_size: raw.specs?.engine_size || raw.vehicle_specs?.engine_size || '2.0L',
      engine_type: raw.specs?.engine_type || raw.vehicle_specs?.engine_type || '',
      cylinders: raw.specs?.cylinders || raw.vehicle_specs?.cylinders || 4,
      fuel_type: raw.fuel_type || raw.specs?.fuel_type || 'Gasoline',
      transmission: raw.transmission || raw.specs?.transmission || 'Automatic',
      drive_type: raw.drive_type || raw.specs?.drive_type || 'FWD',
      airbags: raw.specs?.airbags || 'Intact',
      restraint_system: raw.specs?.restraint_system || '',
      keys: raw.specs?.keys || raw.has_key || 'Yes',
      run_and_drive: raw.specs?.run_and_drive || raw.run_cond || 'RUNS AND DRIVES',
      odometer: Number(raw.odometer || raw.specs?.odometer) || 50000,
      odometer_status: raw.specs?.odometer_status || 'Actual',
      odometer_unit: raw.specs?.odometer_unit || 'mi',
    },
    damage: {
      primary: raw.damage?.primary || raw.damage || 'Front End',
      secondary: raw.damage?.secondary || '',
    },
    auction: {
      auction_type: platform === 'iaai' ? 2 : 1,
      platform,
      lot_number: lotNum,
      auction_date: raw.auction?.auction_date || raw.auction_date || new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      lane: raw.auction?.lane || 'A',
      item_number: raw.auction?.item_number || 1,
      status: raw.auction?.status || 'Open',
      sub_status: raw.auction?.sub_status || 'Open',
      lot_status: raw.auction?.lot_status || 'Timed',
    },
    pricing: {
      current_bid: Number(raw.pricing?.current_bid || raw.current_bid) || 2500,
      starting_bid: Number(raw.pricing?.starting_bid || raw.starting_bid) || 500,
      buy_now_price: raw.pricing?.buy_now_price ? Number(raw.pricing.buy_now_price) : null,
      est_retail_value: Number(raw.pricing?.est_retail_value || raw.est_retail_value) || 18000,
      repair_cost: Number(raw.pricing?.repair_cost) || 2500,
      currency: raw.pricing?.currency || 'USD',
      has_shipping_price: true,
      est_shipping_min: Number(raw.pricing?.est_shipping_min) || 1050,
      est_shipping_max: Number(raw.pricing?.est_shipping_max) || 3850,
    },
    location: {
      facility_id: raw.location?.facility_id || '',
      name: raw.location?.name || 'Copart / IAA Lot',
      city: raw.location?.city || 'Toronto',
      state: raw.location?.state || 'ON',
      state_name: raw.location?.state_name || 'Ontario',
      country: raw.location?.country || 'Canada',
      zip: raw.location?.zip || '',
    },
    media: {
      photo: photos,
      photo_thumb: photos,
    },
    seller: raw.seller,
    sale_document: raw.sale_document,
  };
}

// Client-side mock filter logic
function filterMockVehicles(filters: AuctionFilterValues): VehicleLotItem[] {
  return MOCK_AUCTION_VEHICLES.filter((v) => {
    if (filters.s) {
      const q = filters.s.toLowerCase().trim();
      const matchText = `${v.title} ${v.vin} ${v.lot_number} ${v.make} ${v.model} ${v.specs.body_style}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    if (filters.platform && filters.platform !== 'both' && v.platform !== filters.platform) {
      return false;
    }
    if (filters.auction_type && filters.auction_type !== '0') {
      const expectedType = filters.auction_type === '1' ? 'copart' : 'iaai';
      if (v.platform !== expectedType) return false;
    }
    if (filters.make && filters.make !== 'All' && v.make.toLowerCase() !== filters.make.toLowerCase()) {
      return false;
    }
    if (filters.model && filters.model !== 'All' && !v.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    if (filters.year_from && v.year < Number(filters.year_from)) {
      return false;
    }
    if (filters.year_to && v.year > Number(filters.year_to)) {
      return false;
    }
    if (filters.lot_status && filters.lot_status !== 'All') {
      if (v.auction.lot_status?.toLowerCase() !== filters.lot_status.toLowerCase()) return false;
    }
    if (filters.lot_sub_status && filters.lot_sub_status !== 'All') {
      if (v.auction.sub_status?.toLowerCase() !== filters.lot_sub_status.toLowerCase()) return false;
    }
    if (filters.running_condition && filters.running_condition !== 'All') {
      if (v.specs.run_and_drive?.toLowerCase() !== filters.running_condition.toLowerCase()) return false;
    }
    return true;
  });
}
