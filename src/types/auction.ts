// Types for Apibara Vehicle Auction Data API (Copart & IAAI)

export type AuctionPlatform = 'copart' | 'iaai' | 'both';

export interface MediaItem {
  type: string;
  thumb?: string;
  large?: string;
  url?: string;
}

export interface VehicleMedia {
  photos?: string[];
  thumbs?: string[];
  photo?: string[]; // compatibility alias
  photo_thumb?: string[]; // compatibility alias
  video?: string[];
  panorama?: string[];
  has_360?: boolean;
  vr360_url?: string | null;
  items?: MediaItem[];
}

export interface VehicleAuction {
  auction_type?: number; // 1 = Copart, 2 = IAAI
  platform?: 'copart' | 'iaai';
  lot_number?: string | number;
  ad?: string; // ISO 8601 UTC
  auction_at?: string; // ISO 8601 UTC
  auction_date?: string; // ISO 8601
  auction_time?: string;
  full_date?: string;
  formatted?: string;
  lane?: string;
  slot?: string;
  item_number?: string | number;
  status?: string; // open, live, ended
  state?: string; // open, live, ended
  sub_status?: string; // Open, Live, Ended
  lot_status?: string; // All, Buy Now, Timed
  is_timed?: boolean;
  is_buy_now?: boolean;
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
  };
}

export interface VehiclePricing {
  current_bid_usd?: number | null;
  buy_now_usd?: number | null;
  current_bid?: number | null; // compatibility alias
  starting_bid?: number | null;
  buy_now_price?: number | null; // compatibility alias
  reserve_price?: number | null;
  est_retail_value?: number | null;
  estimated_cost_text?: string;
  estimated_cost_from?: number | null;
  estimated_cost_to?: number | null;
  repair_cost?: number | null;
  sale_price_usd?: number | null;
  last_sold_price_usd?: number | null;
  currency?: string;
  has_shipping_price?: boolean;
  est_shipping_min?: number | null;
  est_shipping_max?: number | null;
}

export interface VehicleLocation {
  facility_id?: string | number;
  name?: string;
  display?: string;
  city?: string;
  state?: string;
  state_name?: string;
  country?: string;
  zip?: string;
  office_name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface VehicleSpecs {
  body_style?: string;
  doors?: number;
  color?: string;
  interior_color?: string;
  engine_size?: number | string;
  engine_type?: string;
  engine_raw?: string;
  engine_hp?: number | null;
  cylinders?: number | string;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  airbags?: string;
  restraint_system?: string;
  keys?: string | boolean;
  has_key?: boolean;
  run_and_drive?: string; // RUNS AND DRIVES, ENGINE START PROGRAM, STATIONARY / NO INFORMATION
  run_condition_label?: string; // Run and Drive, Vehicle starts, Stationary / No information
  run_condition_class?: string; // success, warning, neutral
  odometer?: number;
  odometer_mi?: number;
  odometer_km?: number;
  odometer_status?: string;
  odometer_unit?: string;
  series?: string;
  generation?: string;
}

export interface VehicleDamage {
  primary?: string;
  secondary?: string;
  loss?: string;
}

export interface VehicleLotItem {
  id: string;
  platform: 'copart' | 'iaai';
  lot_number: string;
  vin: string;
  slug_vin?: string;
  title: string;
  year: number;
  make: string;
  model: string;
  series?: string;
  generation?: string;
  vehicle_type?: string;
  specs: VehicleSpecs;
  damage: VehicleDamage;
  auction: VehicleAuction;
  pricing: VehiclePricing;
  location: VehicleLocation;
  media: VehicleMedia;
  seller?: {
    name?: string;
    type?: string;
    class?: string;
    text_class?: string;
  };
  sale_document?: {
    name?: string;
    type?: string;
    state?: string;
    export?: boolean;
    registration?: boolean;
    is_pending?: boolean;
    pending?: boolean;
    sale_document_group?: string;
  };
  details?: Record<string, any>;
  history?: Array<{
    date?: string;
    sale_price?: number;
    bid?: number;
    status?: string;
    location?: string;
    source?: string;
  }>;
}

export interface VehicleSearchResponse {
  data: VehicleLotItem[];
  meta: {
    cursor?: string | null;
    next_cursor?: string | null;
    prev_cursor?: string | null;
    has_more?: boolean;
    total?: number | null;
    total_is_exact?: boolean | null;
    per_page?: number;
    count?: number;
  };
  source: 'live' | 'cached' | 'fallback';
  diagnostics?: {
    endpoint: string;
    status: number;
    key_configured: boolean;
    timestamp: string;
    error_class?: string;
    error_message?: string;
  };
}

export interface AuctionFilterValues {
  s?: string; // Keyword, lot, VIN
  lot_status?: string; // All, Buy Now, Timed
  lot_sub_status?: string; // Open, Live, Ended
  auction_type?: string; // 0 (All), 1 (Copart), 2 (IAAI)
  platform?: string; // copart, iaai
  make?: string;
  series?: string;
  model?: string;
  generation_id?: string;
  generation?: string;
  type?: string;
  type_id?: string;
  body_style?: string;
  year_from?: number | string;
  year_to?: number | string;
  price_min?: number | string;
  price_max?: number | string;
  odometer_from?: number | string;
  odometer_to?: number | string;
  engine_size_from?: number | string;
  engine_size_to?: number | string;
  fuel_type?: string[];
  transmission?: string[];
  drive_type?: string[];
  running_condition?: string;
  damage?: string[];
  color?: string[];
  cylinders?: string[];
  engine_type?: string[];
  has_key?: string; // With, No, All
  loc_state?: string;
  sort?: string;
  cursor?: string;
  per_page?: number;
  include_total?: boolean;
  upcoming?: string;
}

export interface FilterOptionsMetadata {
  makes: string[];
  modelsByMake: Record<string, string[]>;
  seriesOptionsByMake: Record<string, Array<{ key: string; name: string; label: string }>>;
  generationOptionsByMakeAndModel: Record<string, Array<{ id: number; label: string; generation: string; year_from?: number; year_to?: number }>>;
  types: Array<{ id: number | string; name: string }>;
  colors: string[];
  fuels: string[];
  transmissions: string[];
  driveTypes: Array<{ value: string; label: string; desc?: string }>;
  runConditions: Array<{ value: string; label: string }>;
  damageTypes: string[];
  cylinderOptions: Array<number | string>;
  engineTypes: Array<{ value: string; label: string }>;
  hasKeyOptions: string[];
  ranges: {
    price_usd: { min: number; max: number; min_default: number; max_default: number };
    year: { min: number; max: number; from_default: number; to_default: number };
    odometer_mi: { min: number; max: number; from_default: number; to_default: number };
    engine_size_l: { min: number; max: number; from_default: number; to_default: number; step: number };
  };
  states?: string[];
  seriesByMake?: Record<string, string[]>;
}
