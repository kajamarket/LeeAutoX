// Types for Apibara Vehicle Auction Data API (Copart & IAAI)

export type AuctionPlatform = 'copart' | 'iaai' | 'both';

export interface VehicleMedia {
  photo?: string[];
  photo_thumb?: string[];
  video?: string[];
  panorama?: string[];
}

export interface VehicleAuction {
  auction_type?: number; // 1 = Copart, 2 = IAAI
  platform?: 'copart' | 'iaai';
  lot_number?: string | number;
  auction_date?: string; // ISO 8601
  auction_time?: string;
  lane?: string;
  item_number?: string | number;
  status?: string; // Open, Live, Ended, Sold, etc.
  sub_status?: string; // Open, Live, Ended
  lot_status?: string; // All, Buy Now, Timed
}

export interface VehiclePricing {
  current_bid?: number | null;
  starting_bid?: number | null;
  buy_now_price?: number | null;
  reserve_price?: number | null;
  est_retail_value?: number | null;
  repair_cost?: number | null;
  currency?: string;
  has_shipping_price?: boolean;
  est_shipping_min?: number | null;
  est_shipping_max?: number | null;
}

export interface VehicleLocation {
  facility_id?: string;
  name?: string;
  city?: string;
  state?: string;
  state_name?: string;
  country?: string;
  zip?: string;
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
  cylinders?: number | string;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  airbags?: string;
  restraint_system?: string;
  keys?: string | boolean;
  run_and_drive?: string; // RUNS AND DRIVES, ENGINE START PROGRAM, STATIONARY, NO INFORMATION
  odometer?: number;
  odometer_status?: string;
  odometer_unit?: string;
  series?: string;
  generation?: string;
}

export interface VehicleDamage {
  primary?: string;
  secondary?: string;
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
  };
  sale_document?: {
    type?: string;
    state?: string;
    pending?: boolean;
  };
}

export interface VehicleSearchResponse {
  data: VehicleLotItem[];
  meta: {
    cursor?: string | null;
    total?: number;
    per_page?: number;
    count?: number;
  };
  source: 'live' | 'cached' | 'fallback';
}

export interface AuctionFilterValues {
  s?: string; // Keyword, lot, VIN
  lot_status?: string; // All, Buy Now, Timed
  lot_sub_status?: string; // Open, Live, Ended
  auction_type?: string; // 0, 1, 2
  platform?: string; // copart, iaai
  make?: string;
  series?: string;
  model?: string;
  generation_id?: string;
  type_id?: string; // SEDAN, SUV, etc.
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
  has_key?: string;
  loc_state?: string;
  sort?: string;
  cursor?: string;
  per_page?: number;
  include_total?: boolean;
}

export interface FilterOptionsMetadata {
  makes: string[];
  seriesByMake: Record<string, string[]>;
  modelsByMake: Record<string, string[]>;
  types: { id: string; name: string }[];
  colors: string[];
  fuels: string[];
  transmissions: string[];
  driveTypes: string[];
  runConditions: string[];
  damageTypes: string[];
  cylinderOptions: string[];
  engineTypes: string[];
  states: string[];
}
