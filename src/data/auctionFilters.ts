import { FilterOptionsMetadata } from '../types/auction';

export const STATIC_FILTER_METADATA: FilterOptionsMetadata = {
  makes: [
    'TOYOTA', 'LEXUS', 'HONDA', 'HYUNDAI', 'FORD', 'MERCEDES-BENZ', 'BMW', 'NISSAN', 
    'CHEVROLET', 'JEEP', 'KIA', 'ACURA', 'AUDI', 'VOLKSWAGEN', 'SUBARU', 'MAZDA',
    'LAND ROVER', 'GMC', 'DODGE', 'RAM', 'CADILLAC', 'VOLVO', 'INFINITI', 'PORSCHE',
    'TESLA', 'LINCOLN', 'MITSUBISHI', 'CHRYSLER', 'BUICK', 'JAGUAR', 'GENESIS'
  ],
  seriesByMake: {
    TOYOTA: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Land Cruiser', 'Tacoma', 'Tundra', 'Sienna', '4Runner', 'Prado', 'Venza'],
    LEXUS: ['RX 350', 'GX 460', 'LX 570', 'LX 600', 'ES 350', 'IS 250', 'IS 300', 'NX 300', 'RX 450h'],
    HONDA: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Passport', 'Odyssey', 'HR-V', 'Ridgeline'],
    HYUNDAI: ['Sonata', 'Elantra', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue'],
    FORD: ['F-150', 'Explorer', 'Edge', 'Escape', 'Expedition', 'Mustang', 'Ranger', 'Transit'],
    'MERCEDES-BENZ': ['GLC 300', 'GLE 350', 'GLE 450', 'GLS 450', 'C 300', 'E 350', 'S 550', 'G 550', 'CLA 250'],
    BMW: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X6', 'X7', '4 Series'],
    NISSAN: ['Altima', 'Rogue', 'Pathfinder', 'Murano', 'Sentra', 'Armada', 'Frontier', 'Maxima'],
  },
  modelsByMake: {
    TOYOTA: ['CAMRY', 'COROLLA', 'RAV4', 'HIGHLANDER', 'LAND CRUISER', 'TACOMA', 'TUNDRA', 'SIENNA', '4RUNNER', 'VENZA'],
    LEXUS: ['RX 350', 'GX 460', 'LX 570', 'LX 600', 'ES 350', 'IS 250', 'IS 300', 'NX 300', 'RX 450H'],
    HONDA: ['ACCORD', 'CIVIC', 'CR-V', 'PILOT', 'PASSPORT', 'ODYSSEY', 'HR-V', 'RIDGELINE'],
    HYUNDAI: ['SONATA', 'ELANTRA', 'TUCSON', 'SANTA FE', 'PALISADE', 'KONA'],
    FORD: ['F-150', 'EXPLORER', 'EDGE', 'ESCAPE', 'EXPEDITION', 'MUSTANG', 'RANGER'],
    'MERCEDES-BENZ': ['GLC 300', 'GLE 350', 'GLE 450', 'GLS 450', 'C 300', 'E 350', 'S 550', 'G 550'],
    BMW: ['330I', '530I', 'X3', 'X5', 'X6', 'X7', 'M3', 'M5'],
    NISSAN: ['ALTIMA', 'ROGUE', 'PATHFINDER', 'MURANO', 'SENTRA', 'ARMADA', 'FRONTIER'],
  },
  seriesOptionsByMake: {},
  generationOptionsByMakeAndModel: {},
  types: [
    { id: 1, name: 'SEDAN' },
    { id: 2, name: 'AUTOMOBILE' },
    { id: 3, name: 'COUPE' },
    { id: 4, name: 'SUV' },
    { id: 5, name: 'PICKUP' },
    { id: 6, name: 'VAN' },
    { id: 7, name: 'RECREATIONAL VEHICLE (RV)' },
    { id: 8, name: 'ATV' },
    { id: 9, name: 'TRAILERS' },
    { id: 10, name: 'MEDIUM DUTY/BOX TRUCKS' },
    { id: 11, name: 'BOAT' },
    { id: 12, name: 'JET SKI' },
    { id: 13, name: 'MOTORCYCLE' },
    { id: 14, name: 'HEAVY DUTY TRUCKS' },
    { id: 15, name: 'INDUSTRIAL EQUIPMENT' },
    { id: 16, name: 'INSPECTION' },
    { id: 17, name: 'SNOWMOBILE' },
    { id: 18, name: 'DIRT BIKE' },
    { id: 19, name: 'CONSTRUCTION EQUIPMENT' },
    { id: 20, name: 'TRAILER' },
    { id: 21, name: 'TRAVEL TRAILER' },
    { id: 22, name: 'TRUCK' },
    { id: 23, name: 'MOTOR HOME' },
    { id: 24, name: 'FARM EQUIPMENT' },
    { id: 25, name: 'HEAVY EQUIPMENT' },
    { id: 26, name: 'OTHER' },
    { id: 27, name: 'BUS' },
    { id: 28, name: 'PERSONAL WATERCRAFT' },
    { id: 29, name: 'AGRICULTURE AND FARM EQUIPMENT' },
    { id: 30, name: 'EMERGENCY EQUIPMENT' }
  ],
  colors: [
    'Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Beige', 'Brown', 'Burgundy', 'Gold', 'Other'
  ],
  fuels: [
    'Gasoline', 'Diesel', 'Electric', 'Flexible', 'Hybrid', 'All others'
  ],
  transmissions: [
    'Automatic', 'Manual', 'Unknown'
  ],
  driveTypes: [
    { value: 'FWD', label: 'FWD', desc: 'Front-wheel Drive' },
    { value: 'RWD', label: 'RWD', desc: 'Rear-wheel Drive' },
    { value: 'AWD', label: 'AWD', desc: 'All-wheel Drive' }
  ],
  runConditions: [
    { value: 'RUNS AND DRIVES', label: 'Run and Drive' },
    { value: 'ENGINE START PROGRAM', label: 'Vehicle starts' },
    { value: 'STATIONARY / NO INFORMATION', label: 'Stationary / No information' }
  ],
  damageTypes: [
    'Mechanical', 'Hail', 'Fire', 'Water', 'Theft', 'Repossession', 'Rollover', 'Vandalized', 'Chemical'
  ],
  cylinderOptions: [
    1, 2, 3, 4, 5, 6, 8, 10, 12
  ],
  engineTypes: [
    { value: 'I', label: 'I - Inline' },
    { value: 'V', label: 'V - Engine' },
    { value: 'W', label: 'W - Engine' },
    { value: 'B', label: 'B - Boxer' }
  ],
  hasKeyOptions: [
    'With', 'No', 'All'
  ],
  ranges: {
    price_usd: { min: 0, max: 250000, min_default: 0, max_default: 100000 },
    year: { min: 1900, max: 2027, from_default: 1900, to_default: 2026 },
    odometer_mi: { min: 0, max: 500000, from_default: 0, to_default: 250000 },
    engine_size_l: { min: 0, max: 20, from_default: 0, to_default: 10, step: 0.1 }
  },
  states: [
    'ON (Ontario, Canada)', 'QC (Quebec, Canada)', 'AB (Alberta, Canada)', 'BC (British Columbia, Canada)',
    'TX (Texas, USA)', 'CA (California, USA)', 'FL (Florida, USA)', 'GA (Georgia, USA)', 
    'NJ (New Jersey, USA)', 'NY (New York, USA)', 'PA (Pennsylvania, USA)', 'MD (Maryland, USA)', 
    'IL (Illinois, USA)', 'NC (North Carolina, USA)', 'OH (Ohio, USA)', 'MI (Michigan, USA)'
  ]
};
