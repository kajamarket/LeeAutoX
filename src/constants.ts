import { NavLink, Stat, Service, FleetItem, ProcessStep, Testimonial, FAQItem } from './types';

export const NAV_LINKS: NavLink[] = [
  { 
    label: 'Services', 
    href: '/services/',
    children: [
      { label: 'What We Offer', href: '/services/' },
      { label: 'How It Works', href: '/how-it-works/' },
      { label: 'Lee Auto (Lagos)', href: '/lee-auto/' },
    ]
  },
  { label: 'Cars For Sale', href: '/vehicles/' },
  { label: 'Parts & Accessories', href: '/vehicles/' },
  { label: 'Testimonials', href: '/testimonials/' },
  { label: 'Contact', href: '/contact/' },
];

export const HERO_STATS: Stat[] = [
  { value: '50+', label: 'VEHICLES DELIVERED' },
  { value: '5+', label: 'Major Vehicle Auctions' },
  { value: '98%', label: 'ON-TIME DELIVERY' },
];

export const CONTACT_INFO = {
  phone: '+1 (647) 389-6162',
  whatsapp: '+1 (647) 389-6162',
  whatsappRaw: '16473896162',
  email1: 'info@leeautox.com',
  email2: 'leeautox@gmail.com',
  instagram: 'leeautox',
  base: 'Lagos, Nigeria | Ontario, Canada',
  corpNumber: '1761065-3',
};

export const MARQUEE_ITEMS: string[] = [
  'Luxury Vehicles',
  'Car Auctions',
  'Vehicle Pre-Orders',
  'Commercial Trucks',
  'Bike Procurement',
  'Containerization',
  'Shipping & Logistics',
  'Gadget Imports',
];

export const WHY_CHOOSE_LABELS: string[] = [
  'Secure Vehicle Export',
  'Doorstep Delivery',
  'Premium Selection',
  'Transparent Pricing',
];

export const SERVICES: Service[] = [
  {
    id: '01',
    title: 'Vehicle Sourcing & Pre-Orders',
    description: 'We source new and used cars, SUVs, trucks, and luxury vehicles directly from major auctions and dealerships across the USA and Canada. Place a pre-order and we\'ll find exactly what you need.',
  },
  {
    id: '02',
    title: 'Shipping & Containerization',
    description: 'From the lot to your doorstep in Africa. We manage full containerization, international freight, customs documentation, and last-mile delivery — so you don\'t have to.',
  },
  {
    id: '03',
    title: 'Flexible Installment Plans',
    description: 'Owning a vehicle from North America shouldn\'t require full upfront payment. Our affordable installment plans make premium vehicles accessible to more buyers across Africa.',
  },
  {
    id: '04',
    title: 'Bikes, Gadgets & General Imports',
    description: 'Beyond cars, we procure motorcycles, mobile phones, laptops, and general goods. Our sister company Leeplugshub.com specializes in premium tech imports.',
  },
];

export const FLEET: FleetItem[] = [
  {
    title: 'Luxury & Premium',
    category: 'SUVs · Sedans · Sports Cars',
    label: 'New & Used',
    image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg',
  },
  {
    title: 'Commercial Vehicles',
    category: 'Trucks · Vans · Heavy Duty',
    label: 'New & Used',
    image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Vans.jpeg',
  },
  {
    title: 'Auction Sourced',
    category: 'USA & Canada Auctions',
    label: 'Pre-Order',
    image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Auction.jpeg',
  },
  {
    title: 'Shipping & Logistics',
    category: 'Containerization · Port Clearance',
    label: 'Full Service',
    image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Shipping.jpeg',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: '01',
    title: 'Submit Your Request',
    description: 'Tell us the exact vehicle you want — make, model, year, trim, and budget. We\'ll confirm availability from auctions and dealers across the USA and Canada.',
  },
  {
    id: '02',
    title: 'We Source & Verify',
    description: 'Our procurement team locates your vehicle, inspects it, and provides a full condition report before any payment is made. No surprises.',
  },
  {
    id: '03',
    title: 'Payment & Paperwork',
    description: 'Choose from full payment or our flexible installment plan. We handle all title documentation, export paperwork, and customs requirements end-to-end.',
  },
  {
    id: '04',
    title: 'Ship & Deliver',
    description: 'Your vehicle is containerized, shipped internationally, and cleared through your local port. We track every step and keep you informed throughout.',
  },
];

export const PROCESS_STATS: Stat[] = [
  { value: '50+', label: 'Vehicles delivered' },
  { value: '7+', label: 'Years in international procurement' },
  { value: '98%', label: 'On-time delivery rate' },
  { value: '5+', label: 'Major North American Auctions' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'LeeAutoX made buying a car from Canada feel like walking into a local dealership. The communication was top-notch, the process was seamless, and my Toyota Land Cruiser arrived exactly as described.',
    author: 'Emeka Okonkwo',
    role: 'Business Owner, Lagos, Nigeria',
  },
  {
    quote: 'I was skeptical about ordering a vehicle internationally, but LeeAutoX handled every detail — from the auction bid to port clearance in Apapa. Couldn\'t have asked for better service.',
    author: 'Fatima Al-Hassan',
    role: 'Entrepreneur, Abuja, Nigeria',
  },
  {
    quote: 'Their installment plan made it possible for me to own a Ford F-150 that would have otherwise been out of reach. Professional, transparent, and reliable from start to finish.',
    author: 'Tunde Folawiyo',
    role: 'CEO, Port Harcourt, Nigeria',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How long does shipping take from Canada to Nigeria?',
    answer: 'Typically, shipping takes between 4 to 6 weeks from the date of container loading. This includes ocean transit and port handling time.',
  },
  {
    question: 'Do you handle customs clearance in Nigeria?',
    answer: 'Yes, we provide end-to-end logistics. Our clearing agents handle all documentation and payments at the port to Ensure a smooth release of your vehicle.',
  },
  {
    question: 'Can I pay for my vehicle in installments?',
    answer: 'Yes, we offer a flexible installment plan. A commitment deposit is required to secure the vehicle, with the balance spread across the shipping and clearing period.',
  },
  {
    question: 'Are the vehicles inspected before purchase?',
    answer: 'Every vehicle undergoes a rigorous 150-point inspection. We provide you with detailed photos, videos, and a full condition report before finalizing any auction bid.',
  },
];

export const CATALOGUE_VEHICLES = [
  {
    id: 1,
    name: '2021 HYUNDAI SONATA',
    price: '₦22,000,000',
    image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260515-WA0001.jpg',
    specs: 'Auto • 4 CYL • 85k Miles • Run & Drive',
  },
  {
    id: 2,
    name: '2021 HYUNDAI Sonata Ultimate',
    price: '₦23,000,000',
    image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0021-scaled.jpg',
    specs: 'HUD • Panoramic Sunroof • 360 Camera • Self Parking',
  },
  {
    id: 3,
    name: '2017 HYUNDAI SONATA',
    price: '₦13,000,000',
    image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260512-WA0002.jpg',
    specs: 'Keyless • Parking Sensors • Panoramic • Rear AC',
  },
  {
    id: 4,
    name: '2017 Toyota Corolla SE',
    price: '₦15,000,000',
    image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/IMG-20260522-WA0005.jpg',
    specs: 'Clean Title • Sunroof • Heated Side Mirrors',
  },
];

export const STORE_PRODUCTS = [
  {
    id: 1,
    name: 'Autel MaxiCOM MK808BT Pro',
    category: 'Tools',
    price: '₦700,000',
    image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/NVTXCK1.jpg',
  },
  {
    id: 2,
    name: 'CarPro CQuartz UK 3.0 Ceramic Coating',
    category: 'Detailing',
    price: '₦160,000',
    image: 'https://leeautox.leeplugshub.com/wp-content/uploads/2026/05/AABVZT1.jpg',
  },
  {
    id: 3,
    name: 'Battery Charger',
    category: 'Tools',
    price: '₦100,000',
    image: 'https://image.made-in-china.com/2f0j00eVubfjSglKkN/E-Fast-Motorcycle-Battery-Charger-12V-6A-for-Truck-Car-Battery-Charge.webp',
  },
  {
    id: 4,
    name: 'ASPERX AX2000 Jump Starter',
    category: 'Tools',
    price: '₦200,000',
    image: 'https://m.media-amazon.com/images/I/41y7WM2Q0fL.__AC_SR200,225___.jpg',
  },
];

export const INSTAGRAM_POSTS = [
  { id: 1, image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Auction.jpeg' },
  { id: 2, image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg' },
  { id: 3, image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Vans.jpeg' },
  { id: 4, image: 'https://leeplugshub.com/wp-content/uploads/2026/05/Shipping.jpeg' },
  { id: 5, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop' },
  { id: 6, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop' },];
