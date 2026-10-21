export interface AuctionVehicle {
  id: string;
  lotNumber: string;
  title: string;
  source: "Copart" | "IAA";
  location: string;
  image: string;
  currentBid: string;
  estRetail: string;
  odometer: string;
  condition: string;
  damage: string;
  secondsRemaining: number;
  category: "closing-soon" | "upcoming" | "buy-it-now" | "recently-sold";
  isBuyItNow?: boolean;
  buyItNowPrice?: string;
}

export const INITIAL_AUCTION_VEHICLES: AuctionVehicle[] = [
  {
    id: "auc-1",
    lotNumber: "48291044",
    title: "2021 Toyota RAV4 XLE AWD",
    source: "Copart",
    location: "Cookstown, ON (Canada)",
    image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=900",
    currentBid: "$11,200 CAD",
    estRetail: "$28,500 CAD",
    odometer: "42,100 mi",
    condition: "Run & Drive",
    damage: "Minor Dent / Scratch",
    secondsRemaining: 6320,
    category: "closing-soon"
  },
  {
    id: "auc-2",
    lotNumber: "31089241",
    title: "2022 Honda Accord Sport 2.0T",
    source: "IAA",
    location: "Toronto North, ON (Canada)",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=900",
    currentBid: "$13,400 CAD",
    estRetail: "$29,000 CAD",
    odometer: "31,500 mi",
    condition: "Run & Drive",
    damage: "Rear Bumper",
    secondsRemaining: 8140,
    category: "closing-soon"
  },
  {
    id: "auc-3",
    lotNumber: "59201944",
    title: "2020 Lexus RX 350 F-Sport AWD",
    source: "Copart",
    location: "Montreal, QC (Canada)",
    image: "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&q=80&w=900",
    currentBid: "$18,900 CAD",
    estRetail: "$41,000 CAD",
    odometer: "54,000 mi",
    condition: "Run & Drive",
    damage: "Side Scrape",
    secondsRemaining: 16200,
    category: "closing-soon"
  },
  {
    id: "auc-4",
    lotNumber: "62910488",
    title: "2021 Mercedes-Benz C300 4MATIC",
    source: "Copart",
    location: "Bowmanville, ON (Canada)",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=900",
    currentBid: "$15,100 CAD",
    estRetail: "$35,000 CAD",
    odometer: "39,200 mi",
    condition: "Run & Drive",
    damage: "Front Right Fender",
    secondsRemaining: 18600,
    category: "closing-soon"
  },
  {
    id: "auc-5",
    lotNumber: "71092831",
    title: "2023 Ford F-150 SuperCrew XLT 4x4",
    source: "Copart",
    location: "London, ON (Canada)",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=900",
    currentBid: "$22,000 CAD",
    estRetail: "$48,000 CAD",
    odometer: "19,500 mi",
    condition: "Run & Drive",
    damage: "Hail Repairable",
    secondsRemaining: 64800,
    category: "upcoming"
  },
  {
    id: "auc-6",
    lotNumber: "84019230",
    title: "2022 Hyundai Palisade Calligraphy",
    source: "IAA",
    location: "Montreal East, QC (Canada)",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=900",
    currentBid: "$19,500 CAD",
    estRetail: "$44,000 CAD",
    odometer: "36,000 mi",
    condition: "Run & Drive",
    damage: "Mechanical Inspection Needed",
    secondsRemaining: 93600,
    category: "upcoming"
  },
  {
    id: "auc-7",
    lotNumber: "49102941",
    title: "2020 Toyota Highlander Limited AWD",
    source: "Copart",
    location: "Cookstown, ON (Canada)",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=900",
    currentBid: "$21,500 CAD",
    estRetail: "$36,000 CAD",
    odometer: "62,000 mi",
    condition: "Clean Title",
    damage: "None / Normal Wear",
    secondsRemaining: 86400,
    category: "buy-it-now",
    isBuyItNow: true,
    buyItNowPrice: "$21,500 CAD"
  },
  {
    id: "auc-8",
    lotNumber: "91028472",
    title: "2021 Lexus GX 460 Luxury 4WD",
    source: "IAA",
    location: "Toronto East, ON (Canada)",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=900",
    currentBid: "$34,800 CAD",
    estRetail: "$56,000 CAD",
    odometer: "41,200 mi",
    condition: "Clean Title",
    damage: "Minor Repaired",
    secondsRemaining: 86400,
    category: "buy-it-now",
    isBuyItNow: true,
    buyItNowPrice: "$34,800 CAD"
  }
];
