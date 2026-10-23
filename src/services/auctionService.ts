import { 
  VehicleLotItem, 
  VehicleSearchResponse, 
  AuctionFilterValues, 
  FilterOptionsMetadata 
} from '../types/auction';
import { MOCK_AUCTION_VEHICLES } from '../data/mockAuctionLots';
import { STATIC_FILTER_METADATA } from '../data/auctionFilters';

const CACHE_KEY_PREFIX = 'leeautox_auction_cache_v2_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache for search queries
const METADATA_TTL_MS = 60 * 60 * 1000; // 1 hour for filter facet metadata

// Diagnostic tracking store
export interface RelayDiagnostics {
  endpoint: string;
  status: number;
  key_configured: boolean;
  timestamp: string;
  error_class?: string;
  error_message?: string;
  relay_url: string;
  source: 'live' | 'cached' | 'fallback';
}

let currentDiagnostics: RelayDiagnostics = {
  endpoint: '',
  status: 0,
  key_configured: false,
  timestamp: new Date().toISOString(),
  relay_url: getApiBaseUrl(),
  source: 'live',
};

export function getAuctionDiagnostics(): RelayDiagnostics {
  return { ...currentDiagnostics };
}

// Resolve the API base URL:
// 1. If VITE_AUCTION_PROXY_URL is set (e.g. on GitHub Pages via Cloudflare worker), use that
// 2. Otherwise default to our local Express proxy at /api/auction (or localhost for node SSR/tests)
export function getApiBaseUrl(): string {
  const envProxy = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_AUCTION_PROXY_URL;
  if (envProxy && typeof envProxy === 'string' && envProxy.trim()) {
    return envProxy.trim().replace(/\/$/, '');
  }
  if (typeof window === 'undefined') {
    return `http://127.0.0.1:${process.env.PORT || 3000}/api/auction`;
  }
  return '/api/auction';
}

interface CacheEnvelope<T> {
  timestamp: number;
  data: T;
}

function getFromStorage<T>(key: string, customTtl = CACHE_TTL_MS): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!raw) return null;
    const envelope: CacheEnvelope<T> = JSON.parse(raw);
    if (Date.now() - envelope.timestamp < customTtl) {
      return envelope.data;
    }
  } catch {
    // Ignore quota or session storage parsing issues
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
  } catch {
    // Ignore storage quota limits gracefully
  }
}

// Fetch with timeout and 1 backoff retry
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 1, timeoutMs = 9000): Promise<Response> {
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
        await new Promise((res) => setTimeout(res, 600 * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Network request failed');
}

// Test relay connectivity & key status without revealing the secret
export async function checkRelayStatus(): Promise<{ ok: boolean; key_configured: boolean; relay_url: string; status: number }> {
  const relayUrl = getApiBaseUrl();
  const testEndpoint = relayUrl.includes('/api/auction') 
    ? '/api/auction-status' 
    : `${relayUrl}/health`;

  try {
    const res = await fetch(testEndpoint, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const json = await res.json();
      return {
        ok: true,
        key_configured: Boolean(json.key_configured),
        relay_url: relayUrl,
        status: res.status,
      };
    }
    return {
      ok: false,
      key_configured: false,
      relay_url: relayUrl,
      status: res.status,
    };
  } catch {
    return {
      ok: false,
      key_configured: false,
      relay_url: relayUrl,
      status: 0,
    };
  }
}

// Build URL query string from AuctionFilterValues according to Apibara's OpenAPI spec
// Rule: NEVER send a parameter unless it was changed from default.
export function buildFilterQuery(filters: AuctionFilterValues): string {
  const params = new URLSearchParams();

  // Search keyword / VIN / Lot
  if (filters.s && filters.s.trim()) {
    params.set('s', filters.s.trim());
  }

  // Lot Status: 'All', 'Buy Now', 'Timed' (only send if not 'All')
  if (filters.lot_status && filters.lot_status !== 'All') {
    params.set('lot_status', filters.lot_status);
  }

  // Lot Sub Status: 'Open', 'Live', 'Ended' (only send if not default 'Open' or not 'All')
  if (filters.lot_sub_status && filters.lot_sub_status !== 'All') {
    params.set('lot_sub_status', filters.lot_sub_status);
  }

  // Auction Type / Platform:
  // auction_type: 1 = Copart, 2 = IAAI, 0 = All
  if (filters.auction_type && filters.auction_type !== '0' && filters.auction_type !== 'All') {
    params.set('auction_type', filters.auction_type);
  } else if (filters.platform && filters.platform !== 'both' && filters.platform !== 'All') {
    params.set('platform', filters.platform.toLowerCase());
  }

  // Make, Series, Model, Generation
  if (filters.make && filters.make !== 'All') {
    params.set('make', filters.make);
  }
  if (filters.series && filters.series !== 'All') {
    params.set('series', filters.series);
  }
  if (filters.model && filters.model !== 'All') {
    params.set('model', filters.model);
  }
  if (filters.generation_id && filters.generation_id !== 'All') {
    params.set('generation_id', filters.generation_id);
  } else if (filters.generation && filters.generation !== 'All') {
    params.set('generation', filters.generation);
  }

  // Vehicle Type ID
  if (filters.type_id && filters.type_id !== 'All' && filters.type_id !== '0') {
    params.set('type', filters.type_id);
  } else if (filters.type && filters.type !== 'All') {
    params.set('type', filters.type);
  }

  // Year from / to (only send if changed from full range defaults 1900–2027)
  if (filters.year_from && Number(filters.year_from) > 1900) {
    params.set('year_from', String(filters.year_from));
  }
  if (filters.year_to && Number(filters.year_to) < 2027) {
    params.set('year_to', String(filters.year_to));
  }

  // Price (USD) range 0 to 250,000 (do not send default 0 or 250,000)
  if (filters.price_min && Number(filters.price_min) > 0) {
    params.set('price_min', String(filters.price_min));
  }
  if (filters.price_max && Number(filters.price_max) < 250000) {
    params.set('price_max', String(filters.price_max));
  }

  // Odometer (mi) range 0 to 500,000 mi
  if (filters.odometer_from && Number(filters.odometer_from) > 0) {
    params.set('odometer_from', String(filters.odometer_from));
  }
  if (filters.odometer_to && Number(filters.odometer_to) < 500000) {
    params.set('odometer_to', String(filters.odometer_to));
  }

  // Engine size (litres) range 0 to 20
  if (filters.engine_size_from && Number(filters.engine_size_from) > 0) {
    params.set('engine_size_from', String(filters.engine_size_from));
  }
  if (filters.engine_size_to && Number(filters.engine_size_to) < 20) {
    params.set('engine_size_to', String(filters.engine_size_to));
  }

  // Running Condition
  if (filters.running_condition && filters.running_condition !== 'All') {
    params.set('run_cond', filters.running_condition);
  }

  // Has Key: 'With', 'No', 'All'
  if (filters.has_key && filters.has_key !== 'All') {
    params.set('has_key', filters.has_key);
  }

  // Location / State
  if (filters.loc_state && filters.loc_state !== 'All') {
    params.set('loc_state', filters.loc_state);
  }

  // Array parameters: Color
  if (Array.isArray(filters.color) && filters.color.length > 0) {
    filters.color.forEach((c) => params.append('color[]', c));
  }

  // Array parameters: Fuel
  if (Array.isArray(filters.fuel_type) && filters.fuel_type.length > 0) {
    filters.fuel_type.forEach((f) => params.append('fuel_type[]', f));
  }

  // Array parameters: Transmission
  if (Array.isArray(filters.transmission) && filters.transmission.length > 0) {
    filters.transmission.forEach((t) => params.append('transmission[]', t));
  }

  // Array parameters: Drive Type
  if (Array.isArray(filters.drive_type) && filters.drive_type.length > 0) {
    filters.drive_type.forEach((d) => params.append('drive_type[]', d));
  }

  // Array parameters: Damage
  if (Array.isArray(filters.damage) && filters.damage.length > 0) {
    filters.damage.forEach((dm) => params.append('damage[]', dm));
  }

  // Array parameters: Cylinders
  if (Array.isArray(filters.cylinders) && filters.cylinders.length > 0) {
    filters.cylinders.forEach((cyl) => params.append('cylinders[]', String(cyl)));
  }

  // Engine type (I, V, W, B)
  if (filters.engine_type) {
    if (Array.isArray(filters.engine_type)) {
      filters.engine_type.forEach((et) => params.append('engine_type[]', et));
    } else if (filters.engine_type !== 'All') {
      params.set('engine_type', filters.engine_type);
    }
  }

  // Upcoming
  if (filters.upcoming) {
    params.set('upcoming', filters.upcoming);
  }

  // Pagination & Cursor
  if (filters.cursor) {
    params.set('cursor', filters.cursor);
  }
  if (filters.per_page) {
    params.set('per_page', String(filters.per_page));
  }
  if (filters.include_total) {
    params.set('include_total', 'true');
  }

  return params.toString();
}

// Search vehicles from Apibara with automatic fallback and diagnostics
export async function searchAuctionVehicles(filters: AuctionFilterValues): Promise<VehicleSearchResponse> {
  const queryStr = buildFilterQuery(filters);
  const cacheKey = `search_${queryStr}`;

  // Check in-memory / session cache first
  const cached = getFromStorage<VehicleSearchResponse>(cacheKey);
  if (cached) {
    currentDiagnostics = {
      endpoint: `/vehicles?${queryStr}`,
      status: 200,
      key_configured: true,
      timestamp: new Date().toISOString(),
      relay_url: getApiBaseUrl(),
      source: 'cached',
    };
    return { ...cached, source: 'cached', diagnostics: currentDiagnostics };
  }

  const base = getApiBaseUrl();
  const endpoint = `${base}/vehicles${queryStr ? `?${queryStr}` : ''}`;

  let httpStatus = 0;
  let errorClass = 'None';
  let errorMessage = '';

  try {
    const res = await fetchWithRetry(endpoint, {
      headers: { Accept: 'application/json' },
    });
    httpStatus = res.status;

    if (res.ok) {
      const json = await res.json();
      const rawItems = Array.isArray(json.data) ? json.data : [];
      const items: VehicleLotItem[] = rawItems.map(normalizeLotItem);

      const nextCursor = json.meta?.next_cursor || json.meta?.cursor || null;
      const prevCursor = json.meta?.prev_cursor || null;
      const hasMore = Boolean(json.meta?.has_more ?? (nextCursor !== null));
      const total = typeof json.meta?.total === 'number' ? json.meta.total : null;
      const totalIsExact = Boolean(json.meta?.total_is_exact);

      currentDiagnostics = {
        endpoint: `/vehicles${queryStr ? `?${queryStr}` : ''}`,
        status: httpStatus,
        key_configured: true,
        timestamp: new Date().toISOString(),
        relay_url: base,
        source: 'live',
      };

      const result: VehicleSearchResponse = {
        data: items,
        meta: {
          cursor: nextCursor,
          next_cursor: nextCursor,
          prev_cursor: prevCursor,
          has_more: hasMore,
          total: total,
          total_is_exact: totalIsExact,
          per_page: json.meta?.per_page || filters.per_page || 20,
          count: items.length,
        },
        source: 'live',
        diagnostics: currentDiagnostics,
      };

      setInStorage(cacheKey, result);
      return result;
    }

    if (res.status === 401 || res.status === 403) {
      errorClass = 'AuthenticationError';
      errorMessage = 'AUCTION_API_KEY is missing or invalid on relay.';
    } else if (res.status === 429) {
      errorClass = 'RateLimitExceeded';
      errorMessage = 'Apibara API plan rate limit reached.';
    } else {
      errorClass = `HttpError_${res.status}`;
      errorMessage = `API returned HTTP ${res.status}`;
    }
  } catch (error: any) {
    errorClass = error?.name === 'AbortError' ? 'TimeoutError' : 'NetworkError';
    errorMessage = error?.message || 'Failed to fetch from relay';
  }

  currentDiagnostics = {
    endpoint: `/vehicles${queryStr ? `?${queryStr}` : ''}`,
    status: httpStatus,
    key_configured: httpStatus !== 401,
    timestamp: new Date().toISOString(),
    relay_url: base,
    source: 'fallback',
    error_class: errorClass,
    error_message: errorMessage,
  };

  // Safe client fallback
  const fallbackItems = filterMockVehicles(filters);
  return {
    data: fallbackItems,
    meta: {
      cursor: null,
      next_cursor: null,
      prev_cursor: null,
      has_more: false,
      total: fallbackItems.length,
      total_is_exact: true,
      per_page: filters.per_page || 20,
      count: fallbackItems.length,
    },
    source: 'fallback',
    diagnostics: currentDiagnostics,
  };
}

// Fetch single lot details by VIN, Lot number, or slugVin with sale history
export async function getAuctionLotDetails(
  lotNumber: string | number,
  platform?: 'copart' | 'iaai',
  slugVin?: string
): Promise<VehicleLotItem | null> {
  const identifier = slugVin || String(lotNumber);
  const cacheKey = `lot_detail_${encodeURIComponent(identifier)}`;
  const cached = getFromStorage<VehicleLotItem>(cacheKey);
  if (cached) return cached;

  const base = getApiBaseUrl();
  const endpoint = `${base}/vehicles/${encodeURIComponent(identifier)}?include=history,vin_lots`;

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
    console.warn('Could not fetch single lot detail, using fallback:', err);
  }

  // Fallback to mock item
  const found = MOCK_AUCTION_VEHICLES.find(
    (v) => String(v.lot_number) === String(lotNumber) || (slugVin && v.slug_vin === slugVin)
  );
  return found || MOCK_AUCTION_VEHICLES[0];
}

// Fetch exactly 4 related vehicles for lot page
export async function getRelatedAuctionVehicles(
  slugVinOrLot: string,
  make?: string,
  model?: string
): Promise<VehicleLotItem[]> {
  const cacheKey = `related_${encodeURIComponent(slugVinOrLot)}`;
  const cached = getFromStorage<VehicleLotItem[]>(cacheKey);
  if (cached) return cached;

  const base = getApiBaseUrl();
  const endpoint = `${base}/vehicles/${encodeURIComponent(slugVinOrLot)}/related`;

  try {
    const res = await fetchWithRetry(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data || {};
      const upcoming = Array.isArray(data.upcoming) ? data.upcoming : [];
      const past = Array.isArray(data.past) ? data.past : [];
      const combined = [...upcoming, ...past];

      if (combined.length > 0) {
        const normalized = combined.slice(0, 4).map(normalizeLotItem);
        setInStorage(cacheKey, normalized);
        return normalized;
      }
    }
  } catch {
    // Fall through to query by make
  }

  // Fallback: query vehicles of same make
  if (make) {
    const similarRes = await searchAuctionVehicles({ make, per_page: 5 });
    const filtered = similarRes.data.filter((v) => v.lot_number !== slugVinOrLot).slice(0, 4);
    if (filtered.length > 0) {
      return filtered;
    }
  }

  return MOCK_AUCTION_VEHICLES.slice(0, 4);
}

// Fetch live filter facets from /vehicles/filters with storage caching
export async function getAuctionFilterOptions(
  make?: string,
  series?: string,
  model?: string
): Promise<FilterOptionsMetadata> {
  const queryParams = new URLSearchParams();
  if (make && make !== 'All') queryParams.set('make', make);
  if (series && series !== 'All') queryParams.set('series', series);
  if (model && model !== 'All') queryParams.set('model', model);

  const queryStr = queryParams.toString();
  const cacheKey = `filters_meta_${queryStr || 'root'}`;
  const cached = getFromStorage<FilterOptionsMetadata>(cacheKey, METADATA_TTL_MS);
  if (cached) return cached;

  const base = getApiBaseUrl();
  const endpoint = `${base}/vehicles/filters${queryStr ? `?${queryStr}` : ''}`;

  try {
    const res = await fetchWithRetry(endpoint, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      const d = json.data || {};

      const makes: string[] = Array.isArray(d.make_model?.makes) 
        ? d.make_model.makes 
        : STATIC_FILTER_METADATA.makes;

      const modelsByMake: Record<string, string[]> = d.make_model?.models_by_make || STATIC_FILTER_METADATA.modelsByMake;

      const seriesList = Array.isArray(d.series?.options) ? d.series.options : [];
      const generationList = Array.isArray(d.generation?.options) ? d.generation.options : [];

      const typesList = Array.isArray(d.types) 
        ? d.types.map((t: any) => ({ id: t.id, name: t.name })) 
        : STATIC_FILTER_METADATA.types.map((t, idx) => ({ id: idx + 1, name: t.name }));

      const colorsList: string[] = Array.isArray(d.color?.options) ? d.color.options : STATIC_FILTER_METADATA.colors;
      const fuelsList: string[] = Array.isArray(d.fuel_type?.options) ? d.fuel_type.options : STATIC_FILTER_METADATA.fuels;
      const transmissionsList: string[] = Array.isArray(d.transmission?.options) ? d.transmission.options : STATIC_FILTER_METADATA.transmissions;
      const driveTypesList = Array.isArray(d.drive_type?.options) 
        ? d.drive_type.options 
        : STATIC_FILTER_METADATA.driveTypes.map((d) => ({ value: d, label: d }));

      const runConditionsList = Array.isArray(d.running_condition?.options)
        ? d.running_condition.options
        : [
            { value: 'RUNS AND DRIVES', label: 'Run and Drive' },
            { value: 'ENGINE START PROGRAM', label: 'Vehicle starts' },
            { value: 'STATIONARY / NO INFORMATION', label: 'Stationary / No information' },
          ];

      const damageTypesList: string[] = Array.isArray(d.damage?.options) ? d.damage.options : [
        'Mechanical', 'Hail', 'Fire', 'Water', 'Theft', 'Repossession', 'Rollover', 'Vandalized', 'Chemical'
      ];

      const cylindersList: number[] = Array.isArray(d.cylinders?.options) ? d.cylinders.options : [1, 2, 3, 4, 5, 6, 8, 10, 12];
      const engineTypesList = Array.isArray(d.engine_type?.options)
        ? d.engine_type.options
        : [
            { value: 'I', label: 'I - Inline' },
            { value: 'V', label: 'V - Engine' },
            { value: 'W', label: 'W - Engine' },
            { value: 'B', label: 'B - Boxer' },
          ];

      const hasKeyOptions: string[] = Array.isArray(d.has_key?.options) ? d.has_key.options : ['With', 'No', 'All'];

      const ranges = d.ranges || {
        price_usd: { min: 0, max: 250000, min_default: 0, max_default: 100000 },
        year: { min: 1900, max: 2027, from_default: 1900, to_default: 2026 },
        odometer_mi: { min: 0, max: 500000, from_default: 0, to_default: 250000 },
        engine_size_l: { min: 0, max: 20, from_default: 0, to_default: 10, step: 0.1 },
      };

      const result: FilterOptionsMetadata = {
        makes,
        modelsByMake,
        seriesOptionsByMake: make ? { [make]: seriesList } : {},
        generationOptionsByMakeAndModel: make ? { [make]: generationList } : {},
        types: typesList,
        colors: colorsList,
        fuels: fuelsList,
        transmissions: transmissionsList,
        driveTypes: driveTypesList,
        runConditions: runConditionsList,
        damageTypes: damageTypesList,
        cylinderOptions: cylindersList,
        engineTypes: engineTypesList,
        hasKeyOptions,
        ranges,
      };

      setInStorage(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('Could not fetch filter options, using defaults:', err);
  }

  // Fallback metadata
  return {
    makes: STATIC_FILTER_METADATA.makes,
    modelsByMake: STATIC_FILTER_METADATA.modelsByMake,
    seriesOptionsByMake: {},
    generationOptionsByMakeAndModel: {},
    types: STATIC_FILTER_METADATA.types.map((t, idx) => ({ id: idx + 1, name: t.name })),
    colors: STATIC_FILTER_METADATA.colors,
    fuels: STATIC_FILTER_METADATA.fuels,
    transmissions: STATIC_FILTER_METADATA.transmissions,
    driveTypes: STATIC_FILTER_METADATA.driveTypes,
    runConditions: [
      { value: 'RUNS AND DRIVES', label: 'Run and Drive' },
      { value: 'ENGINE START PROGRAM', label: 'Vehicle starts' },
      { value: 'STATIONARY / NO INFORMATION', label: 'Stationary / No information' },
    ],
    damageTypes: ['Mechanical', 'Hail', 'Fire', 'Water', 'Theft', 'Repossession', 'Rollover', 'Vandalized', 'Chemical'],
    cylinderOptions: [1, 2, 3, 4, 5, 6, 8, 10, 12],
    engineTypes: [
      { value: 'I', label: 'I - Inline' },
      { value: 'V', label: 'V - Engine' },
      { value: 'W', label: 'W - Engine' },
      { value: 'B', label: 'B - Boxer' },
    ],
    hasKeyOptions: ['With', 'No', 'All'],
    ranges: {
      price_usd: { min: 0, max: 250000, min_default: 0, max_default: 100000 },
      year: { min: 1900, max: 2027, from_default: 1900, to_default: 2026 },
      odometer_mi: { min: 0, max: 500000, from_default: 0, to_default: 250000 },
      engine_size_l: { min: 0, max: 20, from_default: 0, to_default: 10, step: 0.1 },
    },
  };
}

// Normalize incoming API record to clean VehicleLotItem
export function normalizeLotItem(raw: any): VehicleLotItem {
  const lotNum = String(raw.lot_number || raw.id || raw.details?.attributes?.StockNumber || '');
  const platform = (
    raw.platform ||
    raw.auction?.platform ||
    (raw.platform_id === 2 ? 'iaai' : 'copart')
  ).toLowerCase() as 'copart' | 'iaai';

  const vin = raw.vin || raw.details?.attributes?.VIN || '';
  const year = Number(raw.year || raw.details?.attributes?.Year) || 2020;
  const make = String(raw.make || raw.details?.attributes?.Make || '').toUpperCase();
  const model = String(raw.model || raw.details?.attributes?.Model || '').toUpperCase();
  const title = raw.title || `${year} ${make} ${model}`;
  const slugVin = raw.slug_vin || `${year}-${make.toLowerCase()}-${model.toLowerCase()}-${vin || lotNum}`;

  // Extract photos
  let photos: string[] = [];
  let thumbs: string[] = [];

  if (Array.isArray(raw.media?.items)) {
    raw.media.items.forEach((item: any) => {
      if (item.type === 'image') {
        if (item.large) photos.push(item.large);
        if (item.thumb) thumbs.push(item.thumb);
      }
    });
  }

  if (photos.length === 0 && Array.isArray(raw.media?.thumbs)) {
    photos = [...raw.media.thumbs];
    thumbs = [...raw.media.thumbs];
  }

  if (photos.length === 0 && Array.isArray(raw.photos)) {
    photos = [...raw.photos];
    thumbs = [...raw.photos];
  }

  if (photos.length === 0 && raw.image) {
    photos = [raw.image];
    thumbs = [raw.image];
  }

  if (photos.length === 0) {
    photos = ['https://images.unsplash.com/photo-1590362891988-f7780479c656?w=1080'];
    thumbs = ['https://images.unsplash.com/photo-1590362891988-f7780479c656?w=400'];
  }

  // 360 View support
  const has360 = Boolean(
    raw.media?.has_360 || 
    raw.details?.attributes?.Image360Exists === 'True' ||
    raw.details?.attributes?.Link360
  );
  const vr360Url = raw.media?.items?.find((i: any) => i.type === 'vr360')?.url || 
    raw.details?.attributes?.Link360 || 
    null;

  // Pricing
  const currentBidUsd = raw.pricing?.current_bid_usd !== undefined && raw.pricing?.current_bid_usd !== null
    ? Number(raw.pricing.current_bid_usd)
    : raw.pricing?.current_bid !== undefined
    ? Number(raw.pricing.current_bid)
    : null;

  const buyNowUsd = raw.pricing?.buy_now_usd !== undefined && raw.pricing?.buy_now_usd !== null
    ? Number(raw.pricing.buy_now_usd)
    : raw.pricing?.buy_now_price !== undefined
    ? Number(raw.pricing.buy_now_price)
    : null;

  const estRetailValue = raw.pricing?.estimated_retail_value_usd ?? (
    raw.details?.attributes?.ProviderACV ? Number(raw.details.attributes.ProviderACV) : null
  );

  const estCostText = raw.pricing?.estimated_cost?.text || null;
  const estCostFrom = raw.pricing?.estimated_cost?.from || null;
  const estCostTo = raw.pricing?.estimated_cost?.to || null;
  const repairCost = raw.pricing?.repair_cost ? Number(raw.pricing.repair_cost) : (
    raw.details?.attributes?.EstRepairCost ? Number(raw.details.attributes.EstRepairCost) : null
  );

  // Odometer
  const odoMi = raw.odometer?.mi !== undefined && raw.odometer?.mi !== null
    ? Number(raw.odometer.mi)
    : typeof raw.odometer === 'number'
    ? raw.odometer
    : raw.details?.attributes?.ODOValue
    ? Number(raw.details.attributes.ODOValue)
    : null;

  const odoKm = raw.odometer?.km !== undefined && raw.odometer?.km !== null
    ? Number(raw.odometer.km)
    : odoMi !== null
    ? Math.round(odoMi * 1.60934)
    : null;

  // Run condition & Damage
  const runCondObj = raw.condition?.run_condition;
  const runCondValue = runCondObj?.value || raw.run_cond || raw.specs?.run_and_drive || raw.details?.attributes?.StartsDesc || 'STATIONARY / NO INFORMATION';
  const runCondLabel = runCondObj?.label || (
    runCondValue === 'RUNS AND DRIVES' ? 'Run and Drive' :
    runCondValue === 'ENGINE START PROGRAM' ? 'Vehicle starts' :
    'Stationary / No information'
  );
  const runCondClass = runCondObj?.class_hint || (
    runCondValue === 'RUNS AND DRIVES' ? 'success' :
    runCondValue === 'ENGINE START PROGRAM' ? 'warning' : 'neutral'
  );

  const primaryDamage = raw.condition?.primary_damage || raw.damage?.primary || raw.details?.attributes?.PrimaryDamageDesc || 'Unknown';
  const secondaryDamage = raw.condition?.secondary_damage || raw.damage?.secondary || raw.details?.attributes?.SecondaryDamageDesc || '';

  const hasKey = raw.condition?.has_key !== undefined
    ? Boolean(raw.condition.has_key)
    : raw.details?.attributes?.Keys === 'True'
    ? true
    : raw.specs?.keys === 'Yes' || raw.specs?.keys === true;

  // Auction Date & status
  const auctionDateIso = raw.ad || raw.auction?.full_date || raw.auction?.ad || raw.auction?.auction_at || raw.auction_date || null;
  const auctionState = (raw.auction?.state || raw.auction?.status || 'open').toLowerCase();

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
    series: typeof raw.series === 'object' ? raw.series?.name || raw.series?.key : raw.series || raw.vehicle_specs?.series || '',
    generation: typeof raw.generation === 'object' ? raw.generation?.name || raw.generation?.label : raw.generation || '',
    vehicle_type: raw.type || raw.vehicle_type || raw.details?.attributes?.InventoryType || 'Automobile',
    specs: {
      body_style: raw.vehicle_specs?.body_style || raw.specs?.body_style || raw.details?.attributes?.BodyStyleName || 'Sedan',
      doors: raw.specs?.doors || raw.vehicle_specs?.doors,
      color: raw.vehicle_specs?.exterior_color || raw.color || raw.specs?.color || raw.details?.attributes?.ExteriorColor || 'Unknown',
      interior_color: raw.vehicle_specs?.interior_color || raw.specs?.interior_color || raw.details?.attributes?.InteriorColor || '',
      engine_size: raw.vehicle_specs?.engine?.size_l || raw.specs?.engine_size || '',
      engine_type: raw.vehicle_specs?.engine?.layout || raw.specs?.engine_type || '',
      engine_raw: raw.vehicle_specs?.engine?.raw || raw.details?.attributes?.EngineInformation || raw.details?.attributes?.EngineSize || '',
      engine_hp: raw.vehicle_specs?.engine?.hp || null,
      cylinders: raw.vehicle_specs?.cylinders || raw.specs?.cylinders || raw.details?.attributes?.Cylinders || 4,
      fuel_type: raw.vehicle_specs?.fuel_type || raw.fuel_type || raw.specs?.fuel_type || raw.details?.attributes?.FuelTypeDesc || 'Gasoline',
      transmission: raw.vehicle_specs?.transmission || raw.transmission || raw.specs?.transmission || raw.details?.attributes?.Transmission || 'Automatic',
      drive_type: raw.vehicle_specs?.drive_type || raw.drive_type || raw.specs?.drive_type || raw.details?.attributes?.DriveLineTypeDesc || 'FWD',
      airbags: raw.vehicle_specs?.airbags || raw.specs?.airbags || raw.details?.attributes?.AirbagState || 'Intact',
      restraint_system: raw.vehicle_specs?.restraint_system || raw.details?.attributes?.RestraintType || '',
      keys: hasKey ? 'With' : 'No',
      has_key: hasKey,
      run_and_drive: runCondValue,
      run_condition_label: runCondLabel,
      run_condition_class: runCondClass,
      odometer: odoMi ?? 0,
      odometer_mi: odoMi ?? undefined,
      odometer_km: odoKm ?? undefined,
      odometer_status: raw.specs?.odometer_status || raw.details?.attributes?.ODOBrand || 'Actual',
      odometer_unit: 'mi',
    },
    damage: {
      primary: primaryDamage,
      secondary: secondaryDamage,
      loss: raw.condition?.loss || raw.details?.attributes?.LossTypeDesc || '',
    },
    auction: {
      auction_type: platform === 'iaai' ? 2 : 1,
      platform,
      lot_number: lotNum,
      ad: auctionDateIso,
      auction_date: auctionDateIso,
      auction_at: auctionDateIso,
      full_date: auctionDateIso,
      formatted: raw.auction?.formatted || '',
      lane: raw.auction?.lane || raw.details?.attributes?.Lane || 'A',
      slot: raw.auction?.slot || raw.details?.attributes?.Slot || '',
      item_number: raw.auction?.item_number || 1,
      status: auctionState,
      state: auctionState,
      sub_status: raw.auction?.sub_status || (auctionState === 'open' ? 'Open' : auctionState === 'ended' ? 'Ended' : 'Live'),
      lot_status: raw.auction?.lot_status || (raw.auction?.is_buy_now ? 'Buy Now' : 'Timed'),
      is_timed: Boolean(raw.auction?.is_timed),
      is_buy_now: Boolean(raw.auction?.is_buy_now || raw.pricing?.buy_now_usd),
      countdown: raw.auction?.countdown,
    },
    pricing: {
      current_bid_usd: currentBidUsd,
      current_bid: currentBidUsd,
      buy_now_usd: buyNowUsd,
      buy_now_price: buyNowUsd,
      estimated_cost_text: estCostText,
      estimated_cost_from: estCostFrom,
      estimated_cost_to: estCostTo,
      est_retail_value: estRetailValue,
      repair_cost: repairCost,
      sale_price_usd: raw.pricing?.sale_price_usd || null,
      last_sold_price_usd: raw.pricing?.last_sold_price_usd || null,
      currency: 'USD',
      has_shipping_price: true,
      est_shipping_min: 1050,
      est_shipping_max: 3850,
    },
    location: {
      facility_id: raw.facility?.id || raw.location?.facility_id || '',
      name: raw.facility?.source_location_name || raw.facility?.office_name || raw.location?.display || 'Auction Yard',
      display: raw.location?.display || `${raw.facility?.city || 'Toronto'}, ${raw.facility?.state || 'ON'}`,
      city: raw.facility?.city || raw.location?.city || 'Toronto',
      state: raw.facility?.state || raw.location?.state || 'ON',
      state_name: raw.facility?.state || raw.location?.state_name || 'Ontario',
      country: raw.location?.country || 'USA',
      zip: raw.facility?.zip || '',
      address: raw.facility?.address || '',
      office_name: raw.facility?.office_name || '',
      latitude: raw.facility?.lat,
      longitude: raw.facility?.lng,
    },
    media: {
      photos,
      thumbs,
      photo: photos,
      photo_thumb: thumbs,
      has_360: has360,
      vr360_url: vr360Url,
      items: raw.media?.items || [],
    },
    seller: raw.seller ? {
      name: raw.seller.name || raw.details?.attributes?.ProviderName,
      type: raw.seller.type || raw.details?.attributes?.SellerType,
      class: raw.seller.class,
      text_class: raw.seller.text_class,
    } : undefined,
    sale_document: raw.sale_document ? {
      name: raw.sale_document.name || raw.details?.attributes?.TitleSaleDoc,
      type: raw.sale_document.type,
      export: raw.sale_document.export,
      registration: raw.sale_document.registration,
      is_pending: raw.sale_document.is_pending,
      sale_document_group: raw.sale_document.sale_document_group,
    } : undefined,
    details: raw.details || {},
    history: Array.isArray(raw.history) ? raw.history : [],
  };
}

// Client-side mock filter fallback logic
function filterMockVehicles(filters: AuctionFilterValues): VehicleLotItem[] {
  return MOCK_AUCTION_VEHICLES.filter((v) => {
    if (filters.s) {
      const q = filters.s.toLowerCase().trim();
      const matchText = `${v.title} ${v.vin} ${v.lot_number} ${v.make} ${v.model} ${v.specs.body_style}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    if (filters.platform && filters.platform !== 'both' && v.platform !== filters.platform.toLowerCase()) {
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
