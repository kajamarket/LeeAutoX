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
  location: string;
  status: "Available" | "Reserved" | "Sold";
}

export const INITIAL_INVENTORY: VehicleItem[] = [
  {
    id: "1",
    name: "2021 Hyundai Sonata",
    make: "Hyundai",
    model: "Sonata",
    year: 2021,
    price: "₦22,000,000",
    numericPrice: 22000000,
    image: "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0001.jpg",
    images: [
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0001.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0000.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0021-scaled.jpg"
    ],
    specs: "Auto • 4 CYL • 85k Miles • Run & Drive • Cleared",
    mileage: "85,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Gloss Black",
    condition: "On Ground in Lagos",
    vin: "5NPE24AF8MH891234",
    deposit: "₦4,400,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  },
  {
    id: "2",
    name: "2021 Hyundai Sonata Ultimate",
    make: "Hyundai",
    model: "Sonata",
    year: 2021,
    price: "₦23,000,000",
    numericPrice: 23000000,
    image: "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0021-scaled.jpg",
    images: [
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0021-scaled.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0014-scaled.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0001.jpg"
    ],
    specs: "HUD • Panoramic Sunroof • 360 Camera • Self Parking",
    mileage: "54,200 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Pearl White",
    condition: "On Ground in Lagos",
    vin: "KMHJ24JH8MU654321",
    deposit: "₦4,600,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  },
  {
    id: "3",
    name: "2017 Hyundai Sonata",
    make: "Hyundai",
    model: "Sonata",
    year: 2017,
    price: "₦13,000,000",
    numericPrice: 13000000,
    image: "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0002.jpg",
    images: [
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0002.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0001.jpg"
    ],
    specs: "Keyless • Parking Sensors • Panoramic • Rear AC",
    mileage: "112,000 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Silver Metallic",
    condition: "On Ground in Lagos",
    vin: "5NPE34AF8HH345678",
    deposit: "₦2,600,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  },
  {
    id: "4",
    name: "2017 Toyota Corolla SE",
    make: "Toyota",
    model: "Corolla",
    year: 2017,
    price: "₦15,000,000",
    numericPrice: 15000000,
    image: "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0005.jpg",
    images: [
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0005.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0019-scaled.jpg"
    ],
    specs: "Clean Title • Sunroof • Heated Side Mirrors • Ready",
    mileage: "78,400 mi",
    bodyType: "Sedan",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Midnight Blue",
    condition: "On Ground in Lagos",
    vin: "1NXBR32E8HZ987654",
    deposit: "₦3,000,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  },
  {
    id: "5",
    name: "2020 Toyota RAV4 XLE AWD",
    make: "Toyota",
    model: "RAV4",
    year: 2020,
    price: "₦28,000,000",
    numericPrice: 28000000,
    image: "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260521-WA0007.jpg",
    images: [
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260521-WA0007.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0019-scaled.jpg"
    ],
    specs: "AWD • Apple CarPlay • Reverse Camera • Port Cleared",
    mileage: "49,200 mi",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Magnetic Gray Metallic",
    condition: "On Ground in Lagos",
    vin: "2T3C1RFV8LC459201",
    deposit: "₦5,600,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  },
  {
    id: "6",
    name: "2022 Toyota Land Cruiser VXR",
    make: "Toyota",
    model: "Land Cruiser",
    year: 2022,
    price: "₦95,000,000",
    numericPrice: 95000000,
    image: "https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg",
    images: [
      "https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg",
      "https://leeplugshub.com/wp-content/uploads/2026/05/Auction.jpeg"
    ],
    specs: "Twin Turbo V6 • 4WD • Full Leather • JBL Sound • Cleared",
    mileage: "24,100 mi",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Attitude Black",
    condition: "On Ground in Lagos",
    vin: "JTMCV83J5N4012345",
    deposit: "₦19,000,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  },
  {
    id: "7",
    name: "2020 Ford F-150 Lariat 4x4",
    make: "Ford",
    model: "F-150",
    year: 2020,
    price: "₦38,000,000",
    numericPrice: 38000000,
    image: "https://leeplugshub.com/wp-content/uploads/2026/05/Vans.jpeg",
    images: [
      "https://leeplugshub.com/wp-content/uploads/2026/05/Vans.jpeg",
      "https://leeplugshub.com/wp-content/uploads/2026/05/Shipping.jpeg"
    ],
    specs: "EcoBoost V6 • Twin Moonroof • Leather • Tow Package",
    mileage: "61,000 mi",
    bodyType: "Truck",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Magnetic Metallic",
    condition: "On Ground in Lagos",
    vin: "1FTFW1ED8LFA78901",
    deposit: "₦7,600,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  },
  {
    id: "8",
    name: "2021 Mercedes-Benz GLC 300 4MATIC",
    make: "Mercedes-Benz",
    model: "GLC 300",
    year: 2021,
    price: "₦36,000,000",
    numericPrice: 36000000,
    image: "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0019-scaled.jpg",
    images: [
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0019-scaled.jpg",
      "https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0014-scaled.jpg"
    ],
    specs: "4MATIC • Burmester Sound • Panoramic • AMG Line",
    mileage: "39,400 mi",
    bodyType: "SUV",
    transmission: "Automatic",
    fuelType: "Gasoline",
    colour: "Polar White",
    condition: "On Ground in Lagos",
    vin: "WDC0G4JB0KF456789",
    deposit: "₦7,200,000",
    location: "5 Pepple Street, Ikeja, Lagos (Inspection Lot)",
    status: "Available"
  }
];

export const INVENTORY_VEHICLES = INITIAL_INVENTORY;
