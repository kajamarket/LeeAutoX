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
  types: [
    { id: '1', name: 'SEDAN' },
    { id: '2', name: 'AUTOMOBILE' },
    { id: '3', name: 'COUPE' },
    { id: '4', name: 'SUV' },
    { id: '5', name: 'PICKUP' },
    { id: '6', name: 'VAN' },
    { id: '7', name: 'RECREATIONAL VEHICLE (RV)' },
    { id: '8', name: 'HATCHBACK' },
    { id: '9', name: 'CONVERTIBLE' },
    { id: '10', name: 'WAGON' },
  ],
  colors: [
    'Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Gold', 'Brown', 'Burgundy', 'Yellow', 'Orange'
  ],
  fuels: [
    'Gasoline', 'Diesel', 'Electric', 'Flexible', 'Hybrid', 'All others'
  ],
  transmissions: [
    'Automatic', 'Manual', 'Unknown'
  ],
  driveTypes: [
    'FWD', 'RWD', 'AWD', '4WD'
  ],
  runConditions: [
    'RUNS AND DRIVES',
    'ENGINE START PROGRAM',
    'STATIONARY / NO INFORMATION'
  ],
  damageTypes: [
    'Front End', 'Rear End', 'Side', 'All Over', 'Mechanical', 'Hail', 'Water/Flood', 'Fire', 'Theft', 'Vandalism', 'Rollover', 'Minor Dent/Scratches', 'Suspension', 'Undercarriage'
  ],
  cylinderOptions: [
    '3', '4', '5', '6', '8', '10', '12'
  ],
  engineTypes: [
    'I - Inline', 'V - Engine', 'W - Engine', 'B - Boxer'
  ],
  states: [
    'ON (Ontario, Canada)', 'QC (Quebec, Canada)', 'AB (Alberta, Canada)', 'BC (British Columbia, Canada)',
    'TX (Texas, USA)', 'CA (California, USA)', 'FL (Florida, USA)', 'GA (Georgia, USA)', 
    'NJ (New Jersey, USA)', 'NY (New York, USA)', 'PA (Pennsylvania, USA)', 'MD (Maryland, USA)', 
    'IL (Illinois, USA)', 'NC (North Carolina, USA)', 'OH (Ohio, USA)', 'MI (Michigan, USA)'
  ]
};
