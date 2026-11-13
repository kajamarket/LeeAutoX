import { View360Config } from '../types/view360';

export interface VehicleItem {
  id: string | number;
  name: string;
  make: string;
  model: string;
  year: number;
  price: string;
  numericPrice: number;
  image: string;
  images: string[];
  specs: string;
  mileage: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  colour: string;
  condition: string;
  vin: string;
  deposit: string;
  location: "Nigeria" | "Canada & USA" | string;
  currentLocation?: string;
  status: "Available" | "Reserved" | "Sold";
  '360degree'?: {
    exterior: string;
    interior: string;
  };
  view360?: View360Config;
  exterior360?: string;
}

export function getVehicleSlug(vehicle: { id: string | number; year: number; make: string; model: string }): string {
  const cleanMake = (vehicle.make || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanModel = (vehicle.model || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${vehicle.id}_${vehicle.year}${cleanMake}${cleanModel}`;
}

export function getVehicleUrl(vehicle: { id: string | number; year: number; make: string; model: string }): string {
  return `/vehicle/${getVehicleSlug(vehicle)}`;
}

export const INITIAL_INVENTORY: VehicleItem[] = [
  {
    id: "1",
    name: "2018 Hyundai Sonata",
    make: "Hyundai",
    model: "Sonata",
    year: 2018,
    price: "₦18,000,000",
    numericPrice: 18000000,
    image: "https://leeautox.com/cars/IMG-20261022-WA0031.jpg",
    images: [
      "https://leeautox.com/cars/IMG-20261022-WA0030.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0028.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0034.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0019.jpg"
    ],
    specs: "Auto • 4 CYL • 85k Miles • Run & Drive • Cleared",
    mileage: "85,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Gloss Black",
    condition: "On Ground in Lagos",
    vin: "5NPE24AF8MH891234",
    deposit: "₦10,400,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
  {
    id: "2",
    name: "2021 Hyundai Sonata SEL Plus",
    make: "Hyundai",
    model: "Sonata",
    year: 2021,
    price: "₦29,000,000",
    numericPrice: 29000000,
    image: "https://leeautox.com/cars/IMG-20261022-WA0022.jpg",
    images: [
      "https://leeautox.com/cars/IMG-20261022-WA0023.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0035.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0022.jpg"
    ],
    specs: "HUD • Panoramic Sunroof • 360 Camera • Self Parking",
    mileage: "98,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Flourescent Blue",
    condition: "On Ground in Lagos",
    vin: "KMHJ24JH8MU654321",
    deposit: "₦15,600,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
  {
    id: "3",
    name: "2015 Honda Accord Touring",
    make: "Honda",
    model: "Accord",
    year: 2015,
    price: "₦14,500,000",
    numericPrice: 14500000,
    image: "https://leeautox.com/cars/IMG-20261022-WA0015.jpg",
    images: [
      "https://leeautox.com/cars/IMG-20261022-WA0026.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0012.jpg"
    ],
    specs: "Keyless • Parking Sensors • Panoramic • Rear AC",
    mileage: "112,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Black",
    condition: "On Ground in Lagos",
    vin: "5NPE34AF8HH345678",
    deposit: "₦8,600,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
  {
    id: "4",
    name: "2014 Toyota Corolla Sport",
    make: "Toyota",
    model: "Corolla",
    year: 2014,
    price: "₦14,000,000",
    numericPrice: 14000000,
    image: "https://leeautox.com/cars/IMG-20261022-WA0009.jpg",
    images: [
      "https://leeautox.com/cars/IMG-20261022-WA0008.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0018.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0020.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0004.jpg"
    ],
    specs: "Clean Title • Sunroof • Heated Side Mirrors • Ready",
    mileage: "78,400 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Midnight Blue",
    condition: "On Ground in Lagos",
    vin: "1NXBR32E8HZ987654",
    deposit: "₦7,000,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Sold",
    '360degree': { exterior: '', interior: '' }
  },
  {
    id: "5",
    name: "2019 Lexus RX350",
    make: "Lexus",
    model: "RX350",
    year: 2019,
    price: "₦19,000,000",
    numericPrice: 19000000,
    image: "https://leeautox.com/cars/IMG-20261022-WA0036.jpg",
    images: [
      "https://leeautox.com/cars/IMG-20261022-WA0017.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0013.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0024.jpg"
    ],
    specs: "AWD • Reverse Camera • Port Cleared",
    mileage: "99,200 mi",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Magnetic Gray Metallic",
    condition: "On Ground in Lagos",
    vin: "2T3C1RFV8LC459201",
    deposit: "₦6,000,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
  {
    id: "6",
    name: "2016 Toyota Corolla",
    make: "Toyota",
    model: "Corolla",
    year: 2016,
    price: "₦14,000,000",
    numericPrice: 14000000,
    image: "https://leeautox.com/cars/IMG-20261022-WA0033.jpg",
    images: [
      "https://leeautox.com/cars/IMG-20261022-WA0027.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0014.jpg",
      "https://leeautox.com/cars/IMG-20261022-WA0016.jpg"
    ],
    specs: "Twin Turbo V6 • 4WD • Full Leather • JBL Sound • Cleared",
    mileage: "95,100 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "White",
    condition: "On Ground in Lagos",
    vin: "JTMCV83J5N4012345",
    deposit: "₦10,000,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
  {
    id: "7",
    name: "2021 Hyundai Sonata Luxury",
    make: "Hyundai",
    model: "Sonata",
    year: 2021,
    price: "₦26,000,000",
    numericPrice: 26000000,
    image: "https://leeautox.com/cars/IMG_8233.jpg",
    images: [
      "https://leeautox.com/cars/IMG_8231.jpg",
      "https://leeautox.com/cars/IMG_8236.jpg",
      "https://leeautox.com/cars/IMG_8234.jpg",
      "https://leeautox.com/cars/IMG_8230.jpg"
    ],
    specs: "1.6L V4 Engine • Full Panoramic Roof • 360 Camera • Apple Car Play",
    mileage: "61,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Blood Red",
    condition: "On Ground in Lagos",
    vin: "1FTFW1ED8LFA78901",
    deposit: "₦8,500,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
  {
    id: "9",
    name: "2021 Toyota RAV4 XLE",
    make: "Toyota",
    model: "RAV4",
    year: 2021,
    price: "₦25,000,000",
    numericPrice: 25000000,
    image: "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_1-1024x768.webp",
    images: [
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_1-1024x768.webp",
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_2-1024x768.webp",
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_3-1024x768.webp",
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_4-1024x768.webp",
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_5-1024x768.webp",
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_6-1024x768.jpg",
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_7-1024x768.webp",
      "https://oyinofnorthamerica.com/wp-content/uploads/2026/10/67534736_Image_8-1024x768.webp"
    ],
    specs: "AWD • Sunroof • Blind Spot Monitor • Lane Departure • Clean",
    mileage: "42,000 mi",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Magnetic Gray Metallic",
    condition: "Located Overseas",
    vin: "2T3R1RFV7MW245164",
    deposit: "₦12,500,000",
    location: "Canada & USA",
    currentLocation: "Edmonton, AB (Canada)",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
   {
    id: "11",
    name: "2017 Hyundai Sonata",
    make: "Hyundai",
    model: "Sonata",
    year: 2017,
    price: "₦14,000,000",
    numericPrice: 14000000,
    image: "https://images.leeautox.com/public/cars/IMG-20261104-WA0015.jpg",
    images: [
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0014.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0013.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0012.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0016.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0010.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0011.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0017.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0018.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0019.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0020.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0021.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0022.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0023.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0024.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0025.jpg",
"https://images.leeautox.com/public/cars/IMG-20261104-WA0017.jpg"
    ],
    specs: "Clean Interior & Exterior • Ice-Cold A.C • Apple Car Play",
    mileage: "41,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Blood Red",
    condition: "On Ground in Lagos",
    vin: "JTMCV83J5N4012345",
    deposit: "₦8,000,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': { exterior: '', interior: '' }
  },
 {
    id: "12",
    name: "2018 Hyundai Elantra",
    make: "Hyundai",
    model: "Elantra",
    year: 2018,
    price: "₦12,000,000",
    numericPrice: 12000000,
    image: "https://images.leeautox.com/public/cars/IMG-20261104-WA0031.jpg",
    images: [
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0030.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0032.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0033.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0034.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0035.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0036.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0037.jpg",
      "https://images.leeautox.com/public/cars/IMG-20261104-WA0038.jpg"
    ],
    specs: "2.0L Engine • Ice-Cold A.C • Reverse Camera • Apple Car Play",
    mileage: "61,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Blue",
    condition: "On Ground in Lagos",
    vin: "JTMCV83J5N4012345",
    deposit: "₦6,000,000",
    location: "Nigeria",
    currentLocation: "Lagos, Nigeria",
    status: "Available",
    '360degree': {
      exterior: '',
      interior: '<iframe src="https://tour.panoee.com/corolla-2005-interior-360" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"></iframe>'
    },
    exterior360: '<div class="cloudimage-360" id="ext360-12" data-folder="https://scaleflex.cloudimg.io/v7/demo/earbuds/" data-filename-x="{index}.jpg" data-amount-x="35" data-speed="100" data-draggable="true" data-swipeable="true" data-drag-speed="100" data-keys="true" data-autoplay="true" data-autoplay-behavior="spin-x" data-fullscreen="true" data-zoom-max="5" data-zoom-controls="true" data-pinch-zoom="true"></div>',
    view360: {
      exterior: {
        folder: "https://scaleflex.cloudimg.io/v7/demo/earbuds/",
        filename: "{index}.jpg",
        amount: 35
      },
      interior: {
        embed: '<iframe src="https://tour.panoee.com/corolla-2005-interior-360" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"></iframe>'
      }
    }
  },
  {
    id: "10",
    name: "2005 Toyota Corolla",
    make: "Toyota",
    model: "Corolla",
    year: 2005,
    price: "₦8,500,000",
    numericPrice: 8500000,
    image: "https://leeautox.com/cars/IMG-20261026-WA0003.jpg",
    images: [
      "https://leeautox.com/cars/IMG-20261026-WA0002.jpg",
      "https://leeautox.com/cars/IMG-20261026-WA0003.jpg",
      "https://leeautox.com/cars/IMG-20261026-WA0004.jpg",
      "https://leeautox.com/cars/IMG-20261026-WA0005.jpg",
      "https://leeautox.com/cars/IMG-20261026-WA0006.jpg",
      "https://leeautox.com/cars/IMG-20261026-WA0007.jpg",
      "https://leeautox.com/cars/IMG-20261026-WA0008.jpg",
      "https://leeautox.com/cars/IMG-20261026-WA0009.jpg"
    ],
    specs: "1.8L 4-Cylinder • Automatic • Power Windows • Cold AC • Clean Title",
    mileage: "138,500 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Red",
    condition: "Located Overseas",
    vin: "2T1BR32E65C489120",
    deposit: "₦4,000,000",
    location: "Canada & USA",
    currentLocation: "Ontario, Canada",
    status: "Sold",
    '360degree': {
      exterior: '<iframe src="https://tour.panoee.com/corolla-2005-exterior-360" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"></iframe>',
      interior: '<iframe src="https://tour.panoee.com/corolla-2005-interior-360" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"></iframe>'
    },
    exterior360: '<div class="cloudimage-360" id="ext360-10" data-folder="https://scaleflex.cloudimg.io/v7/demo/earbuds/" data-filename-x="{index}.jpg" data-amount-x="35" data-speed="100" data-draggable="true" data-swipeable="true" data-drag-speed="100" data-keys="true" data-autoplay="true" data-autoplay-behavior="spin-x" data-fullscreen="true" data-zoom-max="5" data-zoom-controls="true" data-pinch-zoom="true"></div>',
    view360: {
      exterior: {
        folder: "https://scaleflex.cloudimg.io/v7/demo/earbuds/",
        filename: "{index}.jpg",
        amount: 35
      },
      interior: {
        embed: '<iframe src="https://tour.panoee.com/corolla-2005-interior-360" width="100%" height="100%" frameborder="0" allowfullscreen allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking"></iframe>'
      }
    }
  }
];

export const INVENTORY_VEHICLES = INITIAL_INVENTORY;

