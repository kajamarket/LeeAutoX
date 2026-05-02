import { NavLink, Stat, Service, FleetItem, ProcessStep, Testimonial, FAQItem } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'Vehicles', href: '#fleet' },
  { label: 'How It Works', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export const HERO_STATS: Stat[] = [
  { value: '500+', label: 'VEHICLES DELIVERED' },
  { value: '12+', label: 'AFRICAN COUNTRIES' },
  { value: '98%', label: 'ON-TIME DELIVERY' },
];

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
  'Self-Drive Experience',
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
    image: 'https://images.unsplash.com/photo-1563721923422-b8ab92f88ab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw5fHxsdXh1cnklMjBTVVYlMjBibGFjayUyMHdoaXRlJTIwbWluaW1hbHxlbnwwfHx8fDE3Nzc3MDIyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Commercial Vehicles',
    category: 'Trucks · Vans · Heavy Duty',
    label: 'New & Used',
    image: 'https://images.unsplash.com/photo-1720014432727-3ec661c27568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxMHx8Y2FyJTIwaW1wb3J0JTIwZXhwb3J0JTIwaW50ZXJuYXRpb25hbCUyMGZyZWlnaHR8ZW58MHx8fHwxNzc3NzAyMjU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Auction Sourced',
    category: 'USA & Canada Auctions',
    label: 'Pre-Order',
    image: 'https://images.unsplash.com/photo-1775948465753-38c8ff55104f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBhdWN0aW9uJTIwZGVhbGVyc2hpcHxlbnwwfHx8fDE3Nzc3MDIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Shipping & Logistics',
    category: 'Containerization · Port Clearance',
    label: 'Full Service',
    image: 'https://images.unsplash.com/photo-1761028218114-a2fefe9c9252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzIwMTN8MHwxfHNlYXJjaHw1fHx2ZWhpY2xlJTIwc2hpcHBpbmclMjBjb250YWluZXIlMjBwb3J0JTIwbG9naXN0aWNzfGVufDB8fHx8MTc3NzcwMjI1NXww&ixlib=rb-4.1.0&q=80&w=1080',
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
  { value: '500+', label: 'Vehicles delivered to Africa' },
  { value: '7+', label: 'Years in international procurement' },
  { value: '98%', label: 'On-time delivery rate' },
  { value: '12+', label: 'African countries served' },
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
    author: 'Kwame Asante',
    role: 'Logistics Manager, Accra, Ghana',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Do you deliver the car to my location?',
    answer: 'Yes. LeeAutoX handles full door-to-door logistics from the auction or dealership in the USA/Canada to your location in Nigeria or across Africa. This includes containerization, international freight, port clearance, and last-mile delivery.',
  },
  {
    question: 'What documents do I need to book?',
    answer: 'You\'ll need a valid government-issued ID and proof of address. For commercial or bulk orders, we may require business registration documents. Our team guides you through the full documentation process at no extra charge.',
  },
  {
    question: 'Is it self-drive or chauffeur-driven?',
    answer: 'All vehicles we source are for personal ownership — they are yours to keep and drive. We are a vehicle procurement and international import service, not a car rental company.',
  },
  {
    question: 'Is fuel included in the delivery?',
    answer: 'Vehicles are delivered with sufficient fuel for initial use. A full inspection and cleaning is completed before delivery so your car arrives ready to drive.',
  },
  {
    question: 'Can I choose a specific make, model, and year?',
    answer: 'Absolutely. Submit your request with exact specifications — make, model, year, trim, colour, and budget — and we\'ll source it from auctions and dealers across North America.',
  },
  {
    question: 'Do you offer installment payment plans?',
    answer: 'Yes. We offer flexible installment plans that make premium North American vehicles accessible without requiring full upfront payment. Contact us to discuss terms tailored to your situation.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Typical transit time from USA/Canada to Nigeria is 6–10 weeks, depending on the port of destination and current shipping schedules. We provide live tracking updates throughout the entire journey.',
  },
];
